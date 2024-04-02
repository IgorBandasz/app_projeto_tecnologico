import React, { useEffect, useState } from 'react';
import { Alert, Image, ImageSourcePropType, View } from 'react-native';
import { Button, Divider, Input, StyleService, Tab, TabView, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { useFormik } from 'formik';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon, CameraIcon, DadosIcon, ServicoIcon } from '../../components/icons';
import Loader from '../../components/Loader';
import { consertoPneuUpdateSchema } from './schemas';
import Mask from '../../components/mask.component';
import { PneuCard } from '../pneu/pneu-card.component';
import { IMotivo } from '../../model/motivo.model';
import { IConsertoPneu, IConsertoPneuServico } from '../../model/conserto-pneu.model';
import { MotivoCard } from '../motivo/motivo-card.component';
import { dateDBToStr, strToDate } from '../../utils/date';
import { strToTime, timeDBToStr } from '../../utils/time';
import { FornecedorCard } from '../fornecedor/fornecedor-card.component';
import { IFornecedor } from '../../model/fornecedor.model';
import ConsertoPneuService from '../../services/api-conserto-pneu-service';
import { ConsertoServicoList } from './servico/servico-list.component';
import { PneuImagemList } from '../imagem/imagem-list.component';
import { IPneuImagem } from '../../model/pneu.model';
import PneuService from '../../services/api-pneu-service';
import { IBem } from '../../model/bem.model';
import { ILancamentoContador } from '../../model/lancamento-contador.model';

interface Params {
  voltas: number;
  data: IConsertoPneu;
  onGoBack: () => Promise<void>;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [id, setId] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>();
  const [param,] = React.useState(route.params as Params);
  const [model, setModel] = React.useState<IConsertoPneu>(param.data);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  //--------------------------------------------------------------------------------------------------

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

  async function handleAddServico() {
    navigation.navigate('ConsertoPneuServicoAdd', { pneu: formik.values.Pneu ,onHandleSave: onAddServicoButtonPress });
  }

  async function handleViewServico(item: IConsertoPneuServico) {
    navigation.navigate('ConsertoPneuServicoView', { idConserto: id, data: item });
  }

  async function onAddServicoButtonPress(item: IConsertoPneuServico) {
    if(isLoading == false){
      try {
        setIsLoading(true);
        
        const service = new ConsertoPneuService();
        const result = await service.addServico(formik.values.Id, item);
        
        if (result.status === 201) {
          const resultGet = await service.getAllServico(formik.values.Id);
          
          if (resultGet.status === 200){
            formik.values.Servicos = resultGet.data.Data;
            
            if (await atualizaTotais()){
              Alert.alert('Sucesso', `Serviço inserido com sucesso`, [
                { text: 'Ok', onPress: () => { navigation.goBack(); }, }],
                { cancelable: false },
              );
            }
          } else {
            Alert.alert('Aviso', resultGet.data.Message)
          }
        } else {
          Alert.alert('Aviso', result.data.Message)
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        Alert.alert(error);
      }
    }
  }

  async function onDeleteServicoButtonPress(item: IConsertoPneuServico) {
    try {
      setIsLoading(true);

      const service = new ConsertoPneuService();
      const result = await service.deleteServico(formik.values.Id, item.Id);
      
      if (result.status === 200) {
        const resultGet = await service.getAllServico(formik.values.Id);
        
        if (resultGet.status === 200){
          formik.values.Servicos = resultGet.data.Data;

          if (await atualizaTotais()){
            Alert.alert('Sucesso', `Serviço Removido com sucesso`, [
              { text: 'Ok', }],
              { cancelable: false },
            );
          }
        } else {
          Alert.alert('Aviso', resultGet.data.Message)
        }

        setIsLoading(false);
      } else {
        Alert.alert('Aviso', result.data.Message)
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Alert.alert(error);
    }
  }

  //---------------------------------------------------------------------------------------------------------------

  async function onAddImagemButtonPress(item: IPneuImagem) {
    try {
      setIsLoading(true);

      item.Tipo = 6; //conserto
      item.IdConserto = id;
      
      const service = new PneuService(setProgress);
      const result = await service.addImagem(formik.values.Pneu?.Id, item);
      
      if (result.status === 201) {
        const resultGet = await service.getAllImagem(formik.values.Pneu?.Id, '', '', id.toString(), '', '','','');
        
        if (resultGet.status === 200){
          formik.values.Imagens = resultGet.data.Data;
          
          Alert.alert('Sucesso', `Imagem inserida com sucesso`, [
            { text: 'Ok', onPress: () => {  }, }],
            { cancelable: false },
          );
        } else {
          Alert.alert('Aviso', resultGet.data.Message)
        }
        setIsLoading(false);
      } else {
        Alert.alert('Aviso', result.data.Message)
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Alert.alert(error);
    }  
  }

  async function onViewImagemButtonPress(item: IPneuImagem) {
    navigation.navigate('ImagemView', { idPneu: formik.values.Pneu?.Id, data: item });
  }

  async function onDeleteImagemButtonPress(item: IPneuImagem) {
    try {
      setIsLoading(true);

      const service = new PneuService();
      const result = await service.deleteImagem(formik.values.Pneu?.Id, item.Id);
      
      if (result.status === 200) {
        const resultGet = await service.getAllImagem(formik.values.Pneu?.Id, '', '', id.toString(), '','','','');
        
        if (resultGet.status === 200){
          formik.values.Imagens = resultGet.data.Data;

          Alert.alert('Sucesso', `Imagem removida com sucesso`, [
            { text: 'Ok', }],
            { cancelable: false },
          );
        } else {
          Alert.alert('Aviso', resultGet.data.Message)
        }

        setIsLoading(false);
      } else {
        Alert.alert('Aviso', result.data.Message)
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Alert.alert(error);
    }
  }

  //**********************************************************************************************************/

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const service = new ConsertoPneuService();
        const result = await service.getOne(param.data.Id);
        setId(param.data.Id);
        
        if (result.status === 200){
          setModel({...result.data.Data,
            DataString: dateDBToStr(result.data.Data.Data),
            HoraString: timeDBToStr(result.data.Data.Hora),
            DataEnvioString: dateDBToStr(result.data.Data.DataEnvio),
            DataPrevEntregaString: dateDBToStr(result.data.Data.DataPrevEntrega)} as IConsertoPneu);
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

    handleLoad();
  }, []);

  //**********************************************************************************************************/

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

  const onCancelarButtonPress = async (): Promise<void> =>{
    if(isLoading == false){
      setIsLoading(true);
      await param.onGoBack();
      navigation && navigation.pop(param.voltas);
    }
  };

  async function atualizaTotais():Promise<boolean> {
    try {
      const service = new ConsertoPneuService();
      const result = await service.getOneBasico(formik.values.Id);
      
      if (result.status === 200){
        const conserto = {...result.data.Data,
                        DataString: dateDBToStr(result.data.Data.Data),
                        HoraString: timeDBToStr(result.data.Data.Hora),
                        DataEnvioString: dateDBToStr(result.data.Data.DataEnvio),
                        DataPrevEntregaString: dateDBToStr(result.data.Data.DataPrevEntrega),
                        Servicos: formik.values.Servicos} as IConsertoPneu;
                        
        setModel(conserto);
        
        return true;
      } else {
        Alert.alert('Aviso', result.data.Message)
        return false;
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Alert.alert(error);
      return false;
    }
  }

  const handleSave = async (values: IConsertoPneu): Promise<void> => {
    if(isLoading == false){
      try {
        setIsLoading(true); 

        values.Data = strToDate(values.DataString);
        values.Hora = strToTime(values.HoraString);
        values.DataEnvio = strToDate(values.DataEnvioString);
        values.DataPrevEntrega = strToDate(values.DataPrevEntregaString);
        
        const service = new ConsertoPneuService();
        const result = await service.edit(id, values);

        if (result.status === 200) {
          await param.onGoBack();
          Alert.alert('Sucesso', `Conserto alterado com sucesso. Id: ${result.data.Id}`, [
            { text: 'Ok', onPress: () => { navigation.pop(param.voltas) }, }],
            { cancelable: false },
          );
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
    validationSchema: consertoPneuUpdateSchema,
    onSubmit: values => { handleSave(values) },
  });

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={onCancelarButtonPress} />
  );

  const submitForm = (): void => {formik.handleSubmit()};

  return (
    <>
      <TopNavigation
        title='CONSERTO DO PNEU'
        accessoryLeft={renderDrawerAction}/>

      <Divider />

      <Loader
        loading={isLoading}
        progress={progress} />

      <KeyboardAvoidingView
        style={styles.container}>


        <TabView
          selectedIndex={selectedIndex}
          swipeEnabled={false}
          onSelect={index => setSelectedIndex(index)}>
          
          <Tab title='Dados' icon={DadosIcon}>
            <>
              <Divider />

              <SafeAreaLayout
                style={styles.form}
                level='1'>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Código'
                  value={`${model.Id}`} />

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
                      data={model.Pneu}
                      onFindPress={null}
                      onLancarContadorPress={handleLancarContador} /> 
                  </View>
                </View>  

                <Divider/>
                
                <MotivoCard
                  data={model.Motivo}
                  onFindPress={null} />    
                
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
                
                <Input
                  style={styles.input}
                  disabled={true}
                  label='Sulco Saída'
                  value={`${model.SulcoSaida}`}/>

                <FornecedorCard
                  data={model.Fornecedor}
                  onFindPress={null} />

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Data Envio'
                  value={model.DataEnvioString}/>  

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Data Previsão Entrega'
                  value={model.DataPrevEntregaString}/>    

                <Input
                  style={styles.input}
                  disabled={true}
                  multiline={true}
                  numberOfLines={5}
                  textAlignVertical='top'
                  label='Observação'
                  value={formik.values.Observacao}/>

                <Text />

              </SafeAreaLayout>
            </>
          </Tab>

          <Tab title='Serviços' icon={ServicoIcon}>
            <>
              <Divider />
              <ConsertoServicoList
                data={formik.values.Servicos}
                onAddPress={handleAddServico}
                onViewPress={handleViewServico}
                onDeletePress={onDeleteServicoButtonPress} />
            </>    
          </Tab>

          <Tab title='Imagens' icon={CameraIcon}>
            <>
              <Divider />
              <PneuImagemList
                data={formik.values.Imagens}
                onAddPress={onAddImagemButtonPress}
                onViewPress={onViewImagemButtonPress}
                onDeletePress={onDeleteImagemButtonPress}
                />
            </>    
          </Tab>
        </TabView>

        <Divider />

        <Button
          style={styles.button}
          size='medium'
          status='success'
          onPress={onCancelarButtonPress}>
          Concluir
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
