import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Image, ImageSourcePropType, View } from 'react-native';
import { Button, CheckBox, Datepicker, Divider, Icon, IndexPath, Input, Radio, RadioGroup, Select, SelectItem, StyleService, Text, Toggle, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { useFormik } from 'formik';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon, CameraIcon } from '../../components/icons';
import Loader from '../../components/Loader';
import { movSucataInsertSchema } from './schemas';
import Mask from '../../components/mask.component';
import { PneuCard } from '../pneu/pneu-card.component';
import { IPneu } from '../../model/pneu.model';
import { IMotivo } from '../../model/motivo.model';
import { IMovimentacaoPneu } from '../../model/movimentacao-pneu.model';
import { CentroCustoCard } from '../centro-custo/centro-custo-card.component';
import { MotivoCard } from '../motivo/motivo-card.component';
import { ICentroCusto } from '../../model/centro-custo.model';
import { dataAtual, strToDate } from '../../utils/date';
import { horaAtual } from '../../utils/time';
import MovSucataService from '../../services/api-mov-sucata-service';
import { IBem } from '../../model/bem.model';
import { ILancamentoContador } from '../../model/lancamento-contador.model';
import { IPosicaoPneu } from '../../model/posicao.model';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
  const [model, setModel] = React.useState<IMovimentacaoPneu>({ DataString: dataAtual(), HoraString: horaAtual(), DataVendaString: dataAtual(), ValorVenda: 0,
                                            TipoMov: 2, SulcoAtual: param.pneu?.SulcoAtual, SucataLocal: 1, Pneu: param.pneu} as IMovimentacaoPneu);

  //**********************************************************************************************************/

  function getSucataLocal(status: number): string{
    switch(status){
      case 0: return 'Próprio'; break;
      case 1: return 'Terceiros'; break;
    }
  }

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

        values.DataVenda = strToDate(values.DataVendaString);
        
        const service = new MovSucataService();
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
              navigation.navigate('MovSucataEdit', {
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
            Alert.alert('Sucesso', `Pneu enviado para a sucata com sucesso.`, [
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
    validationSchema: movSucataInsertSchema,
    onSubmit: values => { handleSave(values) },
  });

  const submitForm = (): void => {formik.handleSubmit()};

  const submitFormAddImagens = (): void => {setAddImagens(true); formik.handleSubmit()};

  return (
    <>
      <TopNavigation
        title='ENVIAR PARA SUCATA'
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
                  source={imagemDisponibilidade(formik.values.Pneu?.Disponibilidade)}></Image>
            </View> 

            <View
              style={[styles.status, { backgroundColor: corStatus(formik.values.Pneu?.Status) }]}></View>
                
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
            inputMaskChange={text => formik.setFieldValue('SulcoAtual', text)}
            accessoryLeft={(props) => iconDiminuir({...props, nome: 'SulcoAtual'})}
            accessoryRight={(props) => iconAumentar({...props, nome: 'SulcoAtual'})}/>
          
          <Mask
            style={styles.input}
            label={'Valor Ação'}
            placeholder={'Informe o Valor da Ação'}
            value={`${formik.values.ValorVenda}`}
            status={formik.errors['ValorVenda'] ? 'danger' : 'info'}
            caption={formik.errors['ValorVenda']}
            mask='moeda'
            maxLength={8}
            keyboardType='numeric'
            inputMaskChange={text => formik.setFieldValue('ValorVenda', text)}/>

          <Mask
            style={styles.input}
            label='Data Ação'
            placeholder='Informe a Data da Ação'
            value={formik.values.DataVendaString}
            status={formik.errors['DataVendaString'] ? 'danger' : 'info'}
            mask={'data'}
            maxLength={10}
            keyboardType='number-pad'
            inputMaskChange={text => formik.setFieldValue('DataVendaString', text)} />

          <Input
            style={styles.input}
            label='NF/Laudo'
            placeholder='Informe o NF/Laudo'
            value={formik.values.NFVenda}
            status={formik.errors['NFVenda'] ? 'danger' : 'info'}
            caption={formik.errors['NFVenda']}
            onChangeText={text => formik.setFieldValue('NFVenda', text)} />

          <Input
            style={styles.input}
            label='Empresa'
            placeholder='Informe a Empresa'
            value={formik.values.EmpresaVenda}
            status={formik.errors['EmpresaVenda'] ? 'danger' : 'info'}
            caption={formik.errors['EmpresaVenda']}
            onChangeText={text => formik.setFieldValue('EmpresaVenda', text)} />

          <Select
            style={styles.input}
            label='Local da Sucata'
            status={formik.errors['SucataLocal'] ? 'danger' : 'info'}
            caption={formik.errors['SucataLocal']}
            value={getSucataLocal(formik.values.SucataLocal)}
            selectedIndex={new IndexPath(formik.values.SucataLocal)}
            onSelect={index => formik.setFieldValue('SucataLocal', (index as IndexPath).row)} >
            <SelectItem title='Próprio' key='0' />
            <SelectItem title='Terceiros' key='1' />
          </Select>

          <Input
            style={styles.input}
            multiline={true}
            numberOfLines={5}
            textAlignVertical='top'
            label='Observação'
            placeholder='Informe a Observação'
            value={formik.values.Observacao}
            status={formik.errors['Observacao'] ? 'danger' : 'info'}
            caption={formik.errors['Observacao']}
            onChangeText={text => formik.setFieldValue('Observacao', text)} />

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
