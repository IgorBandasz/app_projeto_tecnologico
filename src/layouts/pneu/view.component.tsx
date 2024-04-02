import React, { useEffect } from 'react';
import { Alert, Image, ImageSourcePropType, Keyboard, View } from 'react-native';
import { Button, Card, CheckBox, Divider, IndexPath, Input, Layout, Radio, RadioGroup, Select, SelectItem, StyleService, Tab, TabView, Text, Toggle, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { AfericaoIcon, ArrowIosBackIcon, CameraIcon, DadosIcon, HistoricoPneuIcon, MovimentacaoPneuIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { IPneu, IPneuImagem } from '../../model/pneu.model';
import Loader from '../../components/Loader';
import PneuService from '../../services/api-pneu-service';
import { ModeloPneuCard } from '../modelo-pneu/modelo-pneu-card.component';
import { FabricantePneuCard } from '../fabricante-pneu/fabricante-pneu-card.component';
import { FornecedorCard } from '../fornecedor/fornecedor-card.component';
import { MedidaCard } from '../medida/medida-card.component';
import { DesenhoCard } from '../desenho/desenho-card.component';
import { CentroCustoCard } from '../centro-custo/centro-custo-card.component';
import { BemCard } from '../bem/bem-card.component';
import { dateDBToStr, formatDate } from '../../utils/date'
import { PneuImagemList } from '../imagem/imagem-list.component';
import { IBem } from '../../model/bem.model';
import { ILancamentoContador } from '../../model/lancamento-contador.model';
import { IAfericao } from '../../model/afericao.model';
import { IMovimentacaoPneu } from '../../model/movimentacao-pneu.model';
import AfericaoService from '../../services/api-afericao-service';
import { AfericaoList } from '../afericao/afericao-list.component';
import { MovPneuList } from '../mov-pneu/mov-pneu-list.component';

interface Params {
  data: IPneu;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [param,] = React.useState(route.params as Params);
  const [pageAfer, setPageAfer] = React.useState<number>(1);
  const [, setLoadingMoreAfer] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<IPneu>(param.data);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [listAfer, setListAfer] = React.useState<IAfericao[]>([] as IAfericao[]);
  const [listMov, setListMov] = React.useState<IMovimentacaoPneu[]>([] as IMovimentacaoPneu[]);

  async function handleLancarContador(bem: IBem, ultCont: ILancamentoContador) {
    navigation.navigate('LancamentoContadorAdd', { bem: bem, ultCont: ultCont });
  }

  async function handleHistoricoPneu(pneu: IPneu) {
    navigation.navigate('HistoricoPneu', { data: pneu });
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
        const result = await service.getOne(param.data.Id);

        if (result.status === 200){
          setModel({...result.data.Data,
            DataInstalacaoString: dateDBToStr(result.data.Data.DataInstalacao),
            DataAquisicaoString: dateDBToStr(result.data.Data.DataAquisicao),
            DataGarantiaString: dateDBToStr(result.data.Data.DataGarantia)} as IPneu);
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

  async function handleFindMov() {
    try {
      setIsLoading(true);
      
      const service = new PneuService();
      const result = await service.getMovimentacoes(model.Id);
                               
      if (result.status === 200){
        setListMov(result.data.Data);
      } else {
        Alert.alert('Aviso', result.data.Message)
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      Alert.alert(`Ocorreu um erro ao efetuar o filtro`);
    }
  }

  async function handleFindAfer(more: boolean) {
    try {
      setIsLoading(true);
      if (!more)
        setPageAfer(1);

      const service = new AfericaoService();
      const result = await service.getAll(pageAfer, '', `${model.Id}`);
                               
      if (result.status === 200){
        if (pageAfer > 1) {
          setListAfer(oldValue => [...oldValue, ...result.data.Data])
        } else {
          setListAfer(result.data.Data);
        }
      } else {
        Alert.alert('Aviso', result.data.Message)
      }

      setIsLoading(false);
      setLoadingMoreAfer(false);
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      Alert.alert(`Ocorreu um erro ao efetuar o filtro`);
    }
  }

  function handleFindMoreAfer(distance: number) {
    if (distance < 1)
      return;

    setLoadingMoreAfer(true);
    setPageAfer(oldValue => oldValue + 1);
    handleFindAfer(true);
  }

  const renderFooter = (props): React.ReactElement => (
    <Card style={styles.footer}>
      <Text>Exibindo {props.list.length} registro(s)</Text>
    </Card>
  );

  async function handleViewAfer(item: IAfericao) {
    navigation.navigate('AfericaoView', { data: item });
  }

  function getStatus(status: number): string{
    switch(status){
      case 0: return 'Novo'; break;
      case 1: return 'R1'; break;
      case 2: return 'R2'; break;
      case 3: return 'R3'; break;
      case 4: return 'R4'; break;
      case 5: return 'R5'; break;
    }
  }

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
  
  async function onViewImagemButtonPress(item: IPneuImagem) {
    navigation.navigate('ImagemView', { data: item });
  }

  return (
    <>
      <TopNavigation
        title='VISUALIZAR PNEU'
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

                <View
                  style={styles.card}>
                  <View>
                    <Image
                        style={styles.imagem_pneu}
                        source={imagemDisponibilidade(model.Disponibilidade)}></Image>
                  </View> 

                  <View
                    style={[styles.status, { backgroundColor: corStatus(model.Status) }]}></View>
                      
                  <View
                    style={{width: '62%'}}>
                    <Input
                      style={styles.input_card}
                      disabled={true}
                      label='Código do Pneu'
                      value={`${model.Id}`} />

                    <Input
                      style={styles.input_card}
                      disabled={true}
                      label='Status'
                      value={getStatus(model.Status)} /> 
                  </View>
                </View>  

                <Divider/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Número de Fogo'
                  value={model.NumeroFogo}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Número de Série'
                  value={model.NumeroSerie}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='DOT'
                  value={model.DOT}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Alocado'
                  value={getDisponibilidade(model.Disponibilidade)} /> 

                {
                  model.Disponibilidade == 0 &&
                  <>
                    <BemCard
                      data={model.Bem}
                      onFindPress={null}
                      onLancarContadorPress={handleLancarContador} />

                    <Input
                      style={styles.input}
                      disabled={true}
                      label='Posição'
                      value={model.Posicao} /> 
                  </>
                }

                <CentroCustoCard
                  data={model.CentroCusto}
                  onFindPress={null} />

                <FabricantePneuCard
                  data={model.FabricantePneu}
                  onFindPress={null} />

                <ModeloPneuCard
                  data={model.ModeloPneu}
                  onFindPress={null} />

                <MedidaCard
                  data={model.Medida}
                  onFindPress={null} /> 

                <DesenhoCard
                  data={model.Desenho}
                  onFindPress={null} /> 

                <FornecedorCard
                  data={model.Fornecedor}
                  onFindPress={null} />  

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Data de Instalação'
                  value={model.DataInstalacaoString} />

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Data de Aquisição'
                  value={model.DataAquisicaoString}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Garantia Até'
                  value={model.DataGarantiaString} />    

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Valor Aquisição'
                  value={`${model.ValorAquisicao}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Tipo de Construção'
                  value={model.Construcao == 0 ? `Radial` : `Diagonal`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Índice de Carga'
                  value={`${model.IndiceCarga}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Índice de Velocidade'
                  value={`${model.IndiceVelocidade}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Capacidade de Lonas'
                  value={`${model.CapacidadeLona}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Sulco Mínimo'
                  value={`${model.SulcoMin}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Sulco Máximo'
                  value={`${model.SulcoMax}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Sulco Atual'
                  value={`${model.SulcoAtual}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Pressão Mínima'
                  value={`${model.PressaoMin}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Pressão Máxima'
                  value={`${model.PressaoMax}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Pressão Atual'
                  value={`${model.PressaoAtual}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Horas Projetadas do Pneu'
                  value={`${model.VidaUtilEsperadaHr}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Horas Acumuladas do Pneu'
                  value={`${model.HrAcumulado}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Hora do Status Atual'
                  value={`${model.HrAtual}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='KM Projetados do Pneu'
                  value={`${model.VidaUtilEsperadaKm}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='KM Acumulado do Pneu'
                  value={`${model.KmAcumulado}`}/>

                <Input
                  style={styles.input}
                  disabled={true}
                  label='KM do Status Atual'
                  value={`${model.KmAtual}`}/>

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

          <Tab title='Afer.' icon={AfericaoIcon}>
            <>
              <Divider />

              <Layout>
                <Button
                  status={'info'}
                  style={styles.itemContainer}
                  onPress={()=> {handleFindAfer(false)}}>
                  Carregar Aferições  
                </Button> 
              </Layout>

              <Divider />

              <AfericaoList
                data={listAfer}
                onViewPress={handleViewAfer}
                onDeletePress={null}
                ListFooterComponent={(listAfer && listAfer.length > 0) && renderFooter({list: listAfer})}
                onHandleFindMore={handleFindMoreAfer} />
            </>    
          </Tab>

          <Tab title='Mov.' icon={MovimentacaoPneuIcon}>
            <>
              <Divider />

              <Layout>
                <Button
                  status={'info'}
                  style={styles.itemContainer}
                  onPress={()=> {handleFindMov()}}>
                  Carregar Movimentações  
                </Button> 
              </Layout>

              <Divider />

              <MovPneuList
                data={listMov}
                />
            </>    
          </Tab>

          <Tab title='Histórico' icon={HistoricoPneuIcon}>
            <>
              <Divider />
              <Button
                style={styles.button}
                size='medium'
                status='success'
                onPress={() => handleHistoricoPneu(model)}>
                Ver Ficha Histórica do Pneu
              </Button>
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
  card: {
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  input_card: {
    marginLeft: 12,
    marginTop: 8,
    width: '110%',
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
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  footer: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
});
