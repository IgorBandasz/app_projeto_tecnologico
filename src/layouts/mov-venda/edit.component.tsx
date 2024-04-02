import React, { useEffect, useState } from 'react';
import { Alert, Image, ImageSourcePropType, View } from 'react-native';
import { Button, Divider, Input, StyleService, Tab, TabView, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon, CameraIcon, DadosIcon } from '../../components/icons';
import Loader from '../../components/Loader';
import { PneuCard } from '../pneu/pneu-card.component';
import { MotivoCard } from '../motivo/motivo-card.component';
import { dateDBToStr } from '../../utils/date';
import { timeDBToStr } from '../../utils/time';
import { CentroCustoCard } from '../centro-custo/centro-custo-card.component';
import { IMovimentacaoPneu } from '../../model/movimentacao-pneu.model';
import { PneuImagemList } from '../imagem/imagem-list.component';
import { IPneuImagem } from '../../model/pneu.model';
import PneuService from '../../services/api-pneu-service';
import MovVendaService from '../../services/api-mov-venda-service';
import { IBem } from '../../model/bem.model';
import { ILancamentoContador } from '../../model/lancamento-contador.model';

interface Params {
  data: IMovimentacaoPneu;
  voltas: number;
  onGoBack: () => Promise<void>;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [id, setId] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>();
  const [param,] = React.useState(route.params as Params);
  const [model, setModel] = React.useState<IMovimentacaoPneu>(param.data);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  //**********************************************************************************************************/

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const service = new MovVendaService();
        const result = await service.getOne(param.data.Id);
        setId(param.data.Id);
        
        if (result.status === 200){
          setModel({...result.data.Data,
            DataString: dateDBToStr(result.data.Data.Data),
            HoraString: timeDBToStr(result.data.Data.Hora),
            DataVendaString: dateDBToStr(result.data.Data.DataVenda)} as IMovimentacaoPneu);
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

  function getVendaLocal(status: number): string{
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

  async function handleLancarContador(bem: IBem, ultCont: ILancamentoContador) {
    navigation.navigate('LancamentoContadorAdd', { bem: bem, ultCont: ultCont });
  }

  //---------------------------------------------------------------------------------------------------------------

  async function onAddImagemButtonPress(item: IPneuImagem) {
    try {
      setIsLoading(true);
      
      item.Tipo = 4; //venda
      item.IdVenda = id;

      const service = new PneuService(setProgress);
      const result = await service.addImagem(model.Pneu.Id, item);
      
      if (result.status === 201) {
        const resultGet = await service.getAllImagem(model.Pneu.Id, '', '', '', '','',id.toString(),'');
        
        if (resultGet.status === 200){
          model.Imagens = resultGet.data.Data;
          
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
    navigation.navigate('ImagemView', { idPneu: model.Pneu.Id, data: item });
  }

  async function onDeleteImagemButtonPress(item: IPneuImagem) {
    try {
      setIsLoading(true);

      const service = new PneuService();
      const result = await service.deleteImagem(model.Pneu.Id, item.Id);
      
      if (result.status === 200) {
        const resultGet = await service.getAllImagem(model.Pneu.Id, '', '', '', '','',id.toString(),'');
        
        if (resultGet.status === 200){
          model.Imagens = resultGet.data.Data;

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

  //---------------------------------------------------------------------------------------------------------------

  const onCancelarButtonPress = async (): Promise<void> =>{
    if(isLoading == false){
      setIsLoading(true);
      await param.onGoBack();
      navigation && navigation.pop(param.voltas);
    }
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={onCancelarButtonPress} />
  );

  return (
    <>
      <TopNavigation
        title='ALTERAR ENVIO PARA VENDA' 
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

                <CentroCustoCard
                  data={model.CentroCusto}
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
                  label='Sulco Atual'
                  value={`${model.SulcoAtual}`} />

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Valor Ação'
                  value={`${model.ValorVenda}`} />

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Data Ação'
                  value={model.DataVendaString} />

                <Input
                  style={styles.input}
                  disabled={true}
                  label='NF/Laudo'
                  value={model.NFVenda} />

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Empresa'
                  value={model.EmpresaVenda}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  multiline={true}
                  numberOfLines={5}
                  textAlignVertical='top'
                  label='Observação'
                  value={model.Observacao}/>

                <Text />

              </SafeAreaLayout>
            </>
          </Tab>

          <Tab title='Imagens' icon={CameraIcon}>
            <>
              <Divider />
              <PneuImagemList
                data={model.Imagens}
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
