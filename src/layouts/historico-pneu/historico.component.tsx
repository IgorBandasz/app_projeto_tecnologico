import React, { useEffect } from 'react';
import { Alert, View } from 'react-native';
import { Button, CheckBox, Divider, IndexPath, Input, Radio, RadioGroup, Select, SelectItem, StyleService, Tab, TabView, Text, Toggle, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { ArrowIosBackIcon, CameraIcon, DadosIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { IPneu, IPneuImagem } from '../../model/pneu.model';
import Loader from '../../components/Loader';
import PneuService from '../../services/api-pneu-service';
import { ModeloPneuCard } from '../modelo-pneu/modelo-pneu-card.component';
import { FabricantePneuCard } from '../fabricante-pneu/fabricante-pneu-card.component';
import { MedidaCard } from '../medida/medida-card.component';
import { BemCard } from '../bem/bem-card.component';
import { IHistoricoPneu } from '../../model/historico-pneu.model';
import { ItemHistoricoPneuList } from './historico-list.component';

interface Params {
  data: IPneu;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [param,] = React.useState(route.params as Params);
  const [model, setModel] = React.useState<IPneu>(param.data);
  const [historico, setHistorico] = React.useState<IHistoricoPneu>({} as IHistoricoPneu);

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

        const service = new PneuService();
        const result = await service.getHistorico(model.Id);

        if (result.status === 200){
          setHistorico(result.data.Data);
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

  function getDisponibilidade(disponibilidade: number): string{
    switch(disponibilidade){
      case 0: return 'Bem'; break;
      case 1: return 'Estoque'; break;
      case 2: return 'Sucata'; break;
      case 3: return 'Recapagem'; break;
      case 4: return 'Venda'; break;
      case 5: return 'Conserto'; break;
    }
  }

  return (
    <>
      <TopNavigation
        title='FICHA HISTÓRICA DO PNEU'
        accessoryLeft={renderDrawerAction} />

      <Divider />

      <Loader
        loading={isLoading} />

      <KeyboardAvoidingView
        style={styles.container}>

        <SafeAreaLayout
          style={styles.form}
          level='1'>

          <Input
            style={styles.input}
            disabled={true}
            label='Número de Fogo'
            value={model.NumeroFogo}/>

          <Input
            style={styles.input}
            disabled={true}
            label='Alocado'
            value={getDisponibilidade(model.Disponibilidade)} /> 

          <BemCard
            data={model.Bem}
            onFindPress={null}
            onLancarContadorPress={null} />

          <FabricantePneuCard
            data={model.FabricantePneu}
            onFindPress={null} />

          <ModeloPneuCard
            data={model.ModeloPneu}
            onFindPress={null} />

          <MedidaCard
            data={model.Medida}
            onFindPress={null} /> 

          <Input
            style={styles.input}
            disabled={true}
            label='Construção'
            value={model.Construcao == 0 ? `Radial` : `Diagonal`}/>

          <Input
            style={styles.input}
            disabled={true}
            label='Capacidade de Lonas'
            value={`${model.CapacidadeLona}`}/>

          
          <ItemHistoricoPneuList
            data={historico.Indicadores}/>

        </SafeAreaLayout>

        <Divider />

        <Button
          style={styles.button}
          size='medium'
          status='danger'
          onPress={onCancelarButtonPress}>
          Fechar
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
