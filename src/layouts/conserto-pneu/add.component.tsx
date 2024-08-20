import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Image, ImageSourcePropType, View } from 'react-native';
import { Button, Divider, Icon, Input, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { useFormik } from 'formik';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon } from '../../components/icons';
import Loader from '../../components/Loader';
import { consertoPneuInsertSchema } from './schemas';
import Mask from '../../components/mask.component';
import { PneuCard } from '../pneu/pneu-card.component';
import { IPneu } from '../../model/pneu.model';
import { IMotivo } from '../../model/motivo.model';
import { IConsertoPneu } from '../../model/conserto-pneu.model';
import { MotivoCard } from '../motivo/motivo-card.component';
import { dataAtual, strToDate } from '../../utils/date';
import { horaAtual, strToTime } from '../../utils/time';
import { FornecedorCard } from '../fornecedor/fornecedor-card.component';
import { IFornecedor } from '../../model/fornecedor.model';
import ConsertoPneuService from '../../services/api-conserto-pneu-service';
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
  const [model, setModel] = React.useState<IConsertoPneu>({ DataString: dataAtual(), HoraString: horaAtual(), SulcoSaida: param.pneu?.SulcoAtual, DataEnvioString: dataAtual(), Pneu: param.pneu} as IConsertoPneu);

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

  async function handleFindFornecedor() {
    navigation.navigate('FornecedorList', {
      onSelect: (item: IFornecedor) => formik.setFieldValue('Fornecedor', item)
    })
  }

  async function handleLancarContador(bem: IBem, ultCont: ILancamentoContador) {
    navigation.navigate('LancamentoContadorAdd', { bem: bem, ultCont: ultCont });
  }

  function validaDatas() {
    if (strToDate(formik.values.DataEnvioString) !== null && strToDate(formik.values.DataPrevEntregaString) !== null){
        const inicio = strToDate(formik.values.DataEnvioString);
        const fim = strToDate(formik.values.DataPrevEntregaString);
        const diferenca = fim.getTime() - inicio.getTime();
        const tempo = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

        if (tempo < 0){
            Alert.alert('Aviso', 'A data de previsão de entrega é menor que a de envio');
            formik.setFieldValue('DataPrevEntregaString', '', true);
        }
    }
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

  const handleSave = async (values: IConsertoPneu): Promise<void> => {
    if(isLoading == false){
      try {
        setIsLoading(true); 

        values.Data = strToDate(values.DataString);
        values.Hora = strToTime(values.HoraString);
        values.DataEnvio = strToDate(values.DataEnvioString);
        values.DataPrevEntrega = strToDate(values.DataPrevEntregaString);
        
        const service = new ConsertoPneuService();
        const result = await service.add(values);

        if (result.status === 201) {
          if(param.onMudarPosicaoPress){
            await param.onMudarPosicaoPress(param.posicaoD, param.posicaoO);
          }

          const resultConserto = await service.getOne(result.data.Id);
          
          if (resultConserto.data.Data){
            var voltas: number;
            param.voltas ? voltas = param.voltas + 1 : voltas = 1;

            setIsLoading(false);
            navigation.navigate('ConsertoPneuEdit', { 
              voltas: voltas,
              data: resultConserto.data.Data, 
              onGoBack: () => param.onGoBack() 
            });
          }else{
            await param.onGoBack();
            Alert.alert('Aviso', 'Erro ao buscar o conserto inserido', [
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
    validationSchema: consertoPneuInsertSchema,
    onSubmit: values => { handleSave(values) },
  });

  const submitForm = (): void => {
    formik.handleSubmit()
  };
  return (
    <>
      <TopNavigation
        title='CONSERTO DO PNEU'
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
            label='Sulco Saída'
            placeholder='Informe o Sulco'
            textAlign='center'
            value={`${formik.values.SulcoSaida}`}
            status={formik.errors['SulcoSaida'] ? 'danger' : 'info'}
            caption={formik.errors['SulcoSaida']}
            mask='inteiro'
            maxLength={8}
            keyboardType='numeric'
            inputMaskChange={text => formik.setFieldValue('SulcoSaida', text)}
            accessoryLeft={(props) => iconDiminuir({...props, nome: 'SulcoSaida'})}
            accessoryRight={(props) => iconAumentar({...props, nome: 'SulcoSaida'})}/>
          
          <FornecedorCard
            data={formik.values.Fornecedor}
            caption={formik?.errors?.Fornecedor?.Id}
            onFindPress={handleFindFornecedor} />

          <Mask
            style={styles.input}
            label='Data Envio'
            placeholder='Informe a Data da Ação'
            value={formik.values.DataEnvioString}
            status={formik.errors['DataEnvioString'] ? 'danger' : 'info'}
            caption={formik.errors['DataEnvioString']}
            mask={'data'}
            maxLength={10}
            keyboardType='number-pad'
            inputMaskChange={text => formik.setFieldValue('DataEnvioString', text)} 
            onBlur={() => validaDatas()} />

          <Mask
            style={styles.input}
            label='Data Previsão Entrega'
            placeholder='Informe a Data de Previsão de Entrega'
            value={formik.values.DataPrevEntregaString}
            status={formik.errors['DataPrevEntregaString'] ? 'danger' : 'info'}
            caption={formik.errors['DataPrevEntregaString']}
            mask={'data'}
            maxLength={10}
            keyboardType='number-pad'
            inputMaskChange={text => formik.setFieldValue('DataPrevEntregaString', text)} 
            onBlur={() => validaDatas()}/>

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
          Salvar e Continuar
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
