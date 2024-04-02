import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Image, ImageSourcePropType, View } from 'react-native';
import { Button, CheckBox, Datepicker, Divider, Icon, IndexPath, Input, Radio, RadioGroup, Select, SelectItem, StyleService, Text, Toggle, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { useFormik } from 'formik';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon, CameraIcon } from '../../components/icons';
import Loader from '../../components/Loader';
import { movEstoqueInsertSchema } from './schemas';
import Mask from '../../components/mask.component';
import { PneuCard } from '../pneu/pneu-card.component';
import { IPneu } from '../../model/pneu.model';
import { IMotivo } from '../../model/motivo.model';
import { IMovimentacaoPneu } from '../../model/movimentacao-pneu.model';
import { CentroCustoCard } from '../centro-custo/centro-custo-card.component';
import { MotivoCard } from '../motivo/motivo-card.component';
import { ICentroCusto } from '../../model/centro-custo.model';
import { dataAtual } from '../../utils/date';
import { horaAtual } from '../../utils/time';
import MovEstoqueService from '../../services/api-mov-estoque-service';
import { IBem } from '../../model/bem.model';
import { ILancamentoContador } from '../../model/lancamento-contador.model';
import { IPosicaoPneu } from '../../model/posicao.model';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';

interface Params {
  pneu: IPneu;
  posicaoO: IPosicaoPneu;
  posicaoD: IPosicaoPneu;
  onMudarPosicaoPress: (posD: IPosicaoPneu, posO: IPosicaoPneu) => Promise<void>;
  voltas: number;
  onGoBack: () => Promise<void>;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [param,] = React.useState(route.params as Params);
  const [addImagens, setAddImagens] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<IMovimentacaoPneu>({ DataString: dataAtual(), HoraString: horaAtual(), 
                                TipoMov: 1, SulcoAtual: param.pneu?.SulcoAtual, Pneu: param.pneu} as IMovimentacaoPneu);

  //**********************************************************************************************************/

  function corStatus(status: number): string {
    switch(status){
      case 0: return 'green'
      case 1: return 'blue'
      case 2: return 'yellow'
      case 3: return 'maroon'
      case 4: return 'red'
      case 5: return 'black'
    }
  }

  function imagemDisponibilidade(disponibilidade: number): ImageSourcePropType {
    switch(disponibilidade){
      case 0: return require('../../assets/images/acao_mudar.jpg')
      case 1: return require('../../assets/images/acao_pneu.jpg')
      case 2: return require('../../assets/images/acao_sucata.jpg')
      case 3: return require('../../assets/images/acao_recapagem.jpg')
      case 4: return require('../../assets/images/acao_venda.jpg')
      case 5: return require('../../assets/images/acao_conserto.jpg')
    }
  }

  async function handleFindMotivo() {
    navigation.navigate('MotivoList', {
      onSelect: (item: IMotivo) => formik.setFieldValue('Motivo', item)
    })
  }

  async function handleFindCentroCusto() {
    navigation.navigate('CentroCustoList', {
      onSelect: (item: ICentroCusto) => formik.setFieldValue('CentroCusto', item)
    })
  }

  async function handleLancarContador(bem: IBem, ultCont: ILancamentoContador) {
    navigation.navigate('LancamentoContadorAdd', { bem: bem, ultCont: ultCont });
  }

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={onCancelarButtonPress} />
  );

  const iconAumentar = (props): ReactElement => (
    <TouchableWithoutFeedback onPress={() => {formik.setFieldValue(props.nome, formik.values[props.nome] + 1)}}>
      <Icon {...props} name='plus-outline' /> 
    </TouchableWithoutFeedback>
  );

  const iconDiminuir = (props): ReactElement => (
    <TouchableWithoutFeedback onPress={() => {formik.values[props.nome] > 0 ? formik.setFieldValue(props.nome, formik.values[props.nome] - 1) : {}}}>
      <Icon {...props} name='minus-outline' />
    </TouchableWithoutFeedback>
  );

  const onCancelarButtonPress = (): void => {
    if(isLoading == false){
      setIsLoading(true);
      navigation && navigation.goBack();
    }
  };

  const handleSave = async (values: IMovimentacaoPneu): Promise<void> => {
    if(isLoading == false){
      try {
        setIsLoading(true); 
        
        const service = new MovEstoqueService();
        const result = await service.add(values);

        if (result.status === 201) {
          if(param?.onMudarPosicaoPress){
            await param.onMudarPosicaoPress(param.posicaoD, param.posicaoO);
          }

          if (addImagens){
            const resultMov = await service.getOne(result.data.Id);

            if (resultMov.data.Data){
              var voltas: number;
              param.voltas ? voltas = param.voltas + 1 : voltas = 1;
              
              setIsLoading(false);
              navigation.navigate('MovEstoqueEdit', { 
                voltas: voltas,
                data: resultMov.data.Data,
                onGoBack: () => param.onGoBack() 
              });
            }else{
              await param.onGoBack();
              Alert.alert('Aviso', 'Erro ao buscar a movimentação inserida', [
                { text: 'Ok', onPress: () => { navigation.pop(param.voltas) }, }],
                { cancelable: false },
              );
            }
          }else{
            await param.onGoBack();
            Alert.alert('Sucesso', `Pneu enviado para o estoque com sucesso.`, [
              { text: 'Ok', onPress: () => { navigation.pop(param.voltas) }, }],
              { cancelable: false },
            );
          }
        } else {
          Alert.alert('Aviso', result.data?.Message)
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        Alert.alert(error);
      }
    }
  };

  const formik = useFormik({
    initialValues: model,
    enableReinitialize: true,
    validationSchema: movEstoqueInsertSchema,
    onSubmit: values => { handleSave(values) },
  });

  const submitForm = (): void => {formik.handleSubmit()};

  const submitFormAddImagens = (): void => {setAddImagens(true); formik.handleSubmit()};

  return (
    <>
      <TopNavigation
        title='ENVIAR PARA ESTOQUE'
        accessoryLeft={renderDrawerAction} />

      <Divider />

      <Loader
        loading={isLoading} />

      <KeyboardAvoidingView
        style={styles.container}>

        <SafeAreaLayout
          style={styles.form}
          level='1'>

          <View
            style={styles.card}> 
            <View>
              <Image
                  style={styles.imagem_pneu}
                  source={imagemDisponibilidade(model.Pneu?.Disponibilidade)}></Image>
            </View> 

            <View
              style={[styles.status, { backgroundColor: corStatus(model.Pneu?.Status) }]}></View>
                
            <View
              style={{width: '69%'}}>
              <PneuCard
                data={formik.values.Pneu}
                onFindPress={null}
                onLancarContadorPress={handleLancarContador} />
            </View>
          </View>  

          <Divider/>
          

          <MotivoCard
            data={formik.values.Motivo}
            caption={formik?.errors?.Motivo?.Id}
            onFindPress={handleFindMotivo} /> 

          <CentroCustoCard
            data={formik.values.CentroCusto}
            caption={formik?.errors?.CentroCusto?.Id}
            onFindPress={handleFindCentroCusto} />     
          
          {
            false &&
            <>
              <Input
                style={styles.input}
                disabled={true}
                label='Data'
                value={model.DataString} />

              <Input
                style={styles.input}
                disabled={true}
                label='Hora'
                value={model.HoraString} />
            </>
          }

          <Mask
            style={styles.input}
            label='Sulco Atual'
            placeholder='Informe o Sulco'
            textAlign='center'
            value={`${formik.values.SulcoAtual}`}
            status={formik.errors['SulcoAtual'] ? 'danger' : 'info'}
            caption={formik.errors['SulcoAtual']}
            mask='inteiro'
            maxLength={8}
            keyboardType='numeric'
            inputMaskChange={text => formik.setFieldValue('SulcoAtual', parseInt(text))}
            accessoryLeft={(props) => iconDiminuir({...props, nome: 'SulcoAtual'})}
            accessoryRight={(props) => iconAumentar({...props, nome: 'SulcoAtual'})}/>
          
          <Text />

        </SafeAreaLayout>
        
        <Divider />

        <Button
          style={styles.button}
          size='medium'
          status='success'
          onPress={submitForm}>
          Salvar
        </Button>

        <Button
          style={styles.button}
          size='medium'
          status='success'
          onPress={submitFormAddImagens}
          accessoryRight={CameraIcon}>
          Salvar e Adicionar Imagens
        </Button>

        <Button
          style={styles.buttonLast}
          size='medium'
          status='danger'
          onPress={onCancelarButtonPress}>
          Cancelar
        </Button>

      </KeyboardAvoidingView>
    </>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  form: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 24,
  },
  input: {
    marginHorizontal: 12,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  button: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  buttonLast: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  preventiva: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: 'row'
  },
  check: {
    marginHorizontal: 20,
    marginTop: 15,
  },
  card: {
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  input_card: {
    marginLeft: 12,
    marginTop: 8,
    width: '100%',
  },
  imagem_pneu: {
    width: 110,
    height: 110,
    marginLeft: -10,
  },
  status: {
    marginRight: 8,
    paddingVertical: 50,
    paddingHorizontal: 6,
  },
});
