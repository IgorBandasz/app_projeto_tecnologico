import React, { useEffect } from 'react';
import { Alert, View } from 'react-native';
import { Button, CheckBox, Divider, IndexPath, Input, Radio, RadioGroup, Select, SelectItem, StyleService, Tab, TabView, Text, Toggle, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { ArrowIosBackIcon, CameraIcon, DadosIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { IAfericao } from '../../model/afericao.model';
import Loader from '../../components/Loader';
import AfericaoService from '../../services/api-afericao-service';
import { dateDBToStr } from '../../utils/date'
import { timeDBToStr } from '../../utils/time';
import { PneuCard } from '../pneu/pneu-card.component';
import { PneuImagemList } from '../imagem/imagem-list.component';
import { IPneuImagem } from '../../model/pneu.model';
import { IBem } from '../../model/bem.model';
import { ILancamentoContador } from '../../model/lancamento-contador.model';

interface Params {
  data: IAfericao;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<IAfericao>({} as IAfericao);
  const [param,] = React.useState(route.params as Params);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  async function handleLancarContador(bem: IBem, ultCont: ILancamentoContador) {
    navigation.navigate('LancamentoContadorAdd', { bem: bem, ultCont: ultCont });
  }

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={onCancelarButtonPress} />
  );

  const onCancelarButtonPress = (): void => {
    if(isLoading == false){
      setIsLoading(true);
      navigation && navigation.goBack();
    }
  };

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const service = new AfericaoService();
        const result = await service.getOne(param.data.Id);
        
        if (result.status === 200){
          setModel({...result.data.Data,
            DataString: dateDBToStr(result.data.Data.Data),
            HoraString: timeDBToStr(result.data.Data.Hora),} as IAfericao);
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

  async function onViewImagemButtonPress(item: IPneuImagem) {
    navigation.navigate('ImagemView', { idPneu: model.Pneu.Id, data: item });
  }

  return (
    <>
      <TopNavigation
        title='VISUALIZAR AFERIÇÃO'
        accessoryLeft={renderDrawerAction} />

      <Divider />

      <Loader
        loading={isLoading} />

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
                  label='Código da Aferição'
                  value={`${model.Id}`} />

                <PneuCard
                  data={model.Pneu}
                  onFindPress={null}
                  onLancarContadorPress={handleLancarContador} /> 

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Data'
                  value={model.DataString}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Hora'
                  value={model.HoraString}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Sulco Atual'
                  value={`${model.Sulco}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Pressão Atual'
                  value={`${model.Pressao}`} /> 

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Hr Atual do Pneu em Todos os Status'
                  value={`${model.Hr}`} />

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Km Atual do Pneu em Todos os Status'
                  value={`${model.Km}`} />

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Avaria'
                  value={model.Avaria?.Nome}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Causa'
                  value={model.Causa?.Nome}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Ação'
                  value={model.Acao?.Nome}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Precaução'
                  value={model.Precaucao?.Nome}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  multiline={true}
                  numberOfLines={5}
                  textAlignVertical='top'
                  label='Observação'
                  value={model.Observacao} />

                <Text />

              </SafeAreaLayout>
            </>
          </Tab>

          <Tab title='Imagens' icon={CameraIcon}>
            <>
              <Divider />
              <PneuImagemList
                data={model.Imagens}
                onAddPress={null}
                onViewPress={onViewImagemButtonPress}
                onDeletePress={null}
                />
            </>    
          </Tab>
        </TabView>

        <Divider />

        <Button
          style={styles.button}
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
  inputLast: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  button: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  preventiva: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: 'row'
  },
  check: {
    marginHorizontal: 6,
    marginTop: 30,
  },
});
