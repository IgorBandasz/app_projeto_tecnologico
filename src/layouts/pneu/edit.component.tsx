import React, { ReactElement, useEffect } from 'react';
import { Alert, Image, ImageSourcePropType, Keyboard, View } from 'react-native';
import { Button, Divider, Input, IndexPath, StyleService, TopNavigation, TopNavigationAction, useStyleSheet, Select, SelectItem, Text, CheckBox, RadioGroup, Radio, Datepicker, TabView, Tab, Icon, Layout, Card } from '@ui-kitten/components';
import { useFormik } from 'formik';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { AfericaoIcon, ArrowIosBackIcon, CameraIcon, DadosIcon, HistoricoPneuIcon, MovimentacaoPneuIcon } from '../../components/icons';
import Loader from '../../components/Loader';
import Mask from '../../components/mask.component';
import { pneuUpdateSchema } from './schemas';
import PneuService from '../../services/api-pneu-service';
import { IPneu, IPneuImagem } from '../../model/pneu.model';
import { IModeloPneu } from '../../model/modelo-pneu.model';
import { IFabricantePneu } from '../../model/fabricante-pneu.model';
import { IFornecedor } from '../../model/fornecedor.model';
import { IMedida } from '../../model/medida.model';
import { IDesenho } from '../../model/desenho.model';
import { ICentroCusto } from '../../model/centro-custo.model';
import { BemCard } from '../bem/bem-card.component';
import { CentroCustoCard } from '../centro-custo/centro-custo-card.component';
import { DesenhoCard } from '../desenho/desenho-card.component';
import { MedidaCard } from '../medida/medida-card.component';
import { FornecedorCard } from '../fornecedor/fornecedor-card.component';
import { FabricantePneuCard } from '../fabricante-pneu/fabricante-pneu-card.component';
import { ModeloPneuCard } from '../modelo-pneu/modelo-pneu-card.component';
import { dateDBToStr, strToDate } from '../../utils/date';
import { PneuImagemList } from '../imagem/imagem-list.component';
import { IBem } from '../../model/bem.model';
import { ILancamentoContador } from '../../model/lancamento-contador.model';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import { MovPneuList } from '../mov-pneu/mov-pneu-list.component';
import { IMovimentacaoPneu } from '../../model/movimentacao-pneu.model';
import AfericaoService from '../../services/api-afericao-service';
import { IAfericao } from '../../model/afericao.model';
import { AfericaoList } from '../afericao/afericao-list.component';
import { IPermissao } from '../../model/usuario-model';
import { AppStorage } from '../../services/app-storage.service';
import { formatQuant, strToFloat } from '../../utils/float';

interface Params {
  data: IPneu;
  voltas: number;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [id, setId] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [permissao, setPermissao] = React.useState<IPermissao>({CadastroCompletoPneu: false} as IPermissao);
  const [progress, setProgress] = React.useState<number>();
  const [pageAfer, setPageAfer] = React.useState<number>(1);
  const [, setLoadingMoreAfer] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<IPneu>({} as IPneu);
  const [param,] = React.useState(route.params as Params);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [listAfer, setListAfer] = React.useState<IAfericao[]>([] as IAfericao[]);
  const [listMov, setListMov] = React.useState<IMovimentacaoPneu[]>([] as IMovimentacaoPneu[]);

  //**********************************************************************************************************/
  
  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const user = await AppStorage.getUsuario();
        setPermissao(user.Permissao);

        const service = new PneuService();
        const result = await service.getOne(param.data.Id);
        setId(param.data.Id);
        
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

  //**********************************************************************************************************/
  
  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={onCancelarButtonPress} />
  );

  const onCancelarButtonPress = (): void => {
    if(isLoading == false){
        setIsLoading(true);
        navigation.pop(param.voltas)
    }
};

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

  async function handleFindModeloPneu() {
    navigation.navigate('ModeloPneuList', {
      onSelect: (item: IModeloPneu) => formik.setFieldValue('ModeloPneu', item)
    })
  }

  async function handleFindFabricantePneu() {
    navigation.navigate('FabricantePneuList', {
      onSelect: (item: IFabricantePneu) => formik.setFieldValue('FabricantePneu', item)
    })
  }

  async function handleFindFornecedor() {
    navigation.navigate('FornecedorList', {
      onSelect: (item: IFornecedor) => formik.setFieldValue('Fornecedor', item)
    })
  }

  async function handleFindMedida() {
    navigation.navigate('MedidaList', {
      onSelect: (item: IMedida) => formik.setFieldValue('Medida', item)
    })
  }

  async function handleFindDesenho() {
    navigation.navigate('DesenhoList', {
      onSelect: (item: IDesenho) => formik.setFieldValue('Desenho', item)
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

  async function handleHistoricoPneu(pneu: IPneu) {
    navigation.navigate('HistoricoPneu', { data: pneu });
  }

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

  //*********************************************************************

  async function onAddImagemButtonPress(item: IPneuImagem) {
    try {
      setIsLoading(true);

      item.Tipo = 0; //cadastro de pneu
      
      const service = new PneuService(setProgress);
      const result = await service.addImagem(formik.values.Id, item);
      
      if (result.status === 201) {
        const resultGet = await service.getAllImagem(formik.values.Id, '', '', '', '','','','');
        
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
        Alert.alert('Aviso', result.data?.Message)
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Alert.alert(error);
    }  
  }

  async function onViewImagemButtonPress(item: IPneuImagem) {
    navigation.navigate('ImagemView', { idPneu: formik.values.Id, data: item });
  }

  async function onDeleteImagemButtonPress(item: IPneuImagem) {
    try {
      setIsLoading(true);

      const service = new PneuService();
      const result = await service.deleteImagem(formik.values.Id, item.Id);
      
      if (result.status === 200) {
        const resultGet = await service.getAllImagem(formik.values.Id, '', '', '', '','','','');
        
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
        Alert.alert('Aviso', result.data?.Message)
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Alert.alert(error);
    }
  }

  //*********************************************************************

  const handleSave = async (values: IPneu): Promise<void> => {
    if(isLoading == false){
      try {
        setIsLoading(true);

        values.DataAquisicao = strToDate(values.DataAquisicaoString);
        values.DataGarantia = strToDate(values.DataGarantiaString);

        const service = new PneuService();
        const result = await service.edit(values, id);

        if (result.status === 200) {
          Alert.alert('Sucesso', `Pneu ${id} alterado com sucesso`, [
            { text: 'Ok', onPress: () => { navigation.pop(param.voltas); } }],
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
    validationSchema: pneuUpdateSchema,
    enableReinitialize: true,
    onSubmit: values => { handleSave(values) },
  });

  const submitForm = (): void => {formik.handleSubmit()};

  return (
    <>
      <TopNavigation
        title='EDITAR PNEU'
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
                        source={imagemDisponibilidade(formik.values.Disponibilidade)}></Image>
                  </View> 

                  <View
                    style={[styles.status, { backgroundColor: corStatus(formik.values.Status) }]}></View>
                      
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
                      value={getStatus(formik.values.Status)} />
                  </View>
                </View>  

                <Divider/>
                
                <Input
                  style={styles.input}
                  label='Número de Fogo'
                  placeholder='Informe o Número de Fogo'
                  value={formik.values.NumeroFogo}
                  status={formik.errors['NumeroFogo'] ? 'danger' : 'info'}
                  caption={formik.errors['NumeroFogo']}
                  onChangeText={text => formik.setFieldValue('NumeroFogo', text)} />

                <Input
                  style={styles.input}
                  label='Número de Série'
                  placeholder='Informe o Número de Série'
                  value={formik.values.NumeroSerie}
                  status={formik.errors['NumeroSerie'] ? 'danger' : 'info'}
                  caption={formik.errors['NumeroSerie']}
                  onChangeText={text => formik.setFieldValue('NumeroSerie', text)} />

                <Input
                  style={styles.input}
                  label='DOT'
                  placeholder='Informe o DOT'
                  value={formik.values.DOT}
                  status={formik.errors['DOT'] ? 'danger' : 'info'}
                  caption={formik.errors['DOT']}
                  onChangeText={text => formik.setFieldValue('DOT', text)} />  

                <Input
                  style={styles.input}
                  disabled={true}
                  label='Alocado'
                  value={getDisponibilidade(formik.values.Disponibilidade)} />  

                {
                  formik.values.Disponibilidade == 0 &&
                  <>
                    <BemCard
                      data={formik.values.Bem}
                      onFindPress={null}
                      onLancarContadorPress={handleLancarContador} />

                    <Input
                      style={styles.input}
                      disabled={true}
                      label='Posição'
                      value={formik.values.Posicao} /> 
                  </>
                }

                <CentroCustoCard
                  data={formik.values.CentroCusto}
                  caption={formik?.errors?.CentroCusto?.Id}
                  onFindPress={formik.values.Disponibilidade == 0 ? null : handleFindCentroCusto} />

                <FabricantePneuCard
                  data={formik.values.FabricantePneu}
                  onFindPress={handleFindFabricantePneu} />

                <ModeloPneuCard
                  data={formik.values.ModeloPneu}
                  onFindPress={handleFindModeloPneu} />

                <MedidaCard
                  data={formik.values.Medida}
                  onFindPress={handleFindMedida} /> 

                <DesenhoCard
                  data={formik.values.Desenho}
                  onFindPress={handleFindDesenho} /> 

                {    
                  permissao.CadastroCompletoPneu && 
                    <>
                    <FornecedorCard
                      data={formik.values.Fornecedor}
                      onFindPress={handleFindFornecedor} />    

                    <Mask
                      style={styles.input}
                      label='Data de Aquisição'
                      placeholder='Informe a Data de Aquisição'
                      value={formik.values.DataAquisicaoString}
                      status={formik.errors['DataAquisicaoString'] ? 'danger' : 'info'}
                      caption={formik.errors['DataAquisicaoString']}
                      mask={'data'}
                      maxLength={10}
                      keyboardType='number-pad'
                      inputMaskChange={text => formik.setFieldValue('DataAquisicaoString', text)} />

                    <Mask
                      style={styles.input}
                      label='Garantia Até'
                      placeholder='Informe a Data de Garantia'
                      value={formik.values.DataGarantiaString}
                      status={formik.errors['DataGarantiaString'] ? 'danger' : 'info'}
                      caption={formik.errors['DataGarantiaString']}
                      mask={'data'}
                      maxLength={10}
                      keyboardType='number-pad'
                      inputMaskChange={text => formik.setFieldValue('DataGarantiaString', text)} />    

                    <Mask
                      style={styles.input}
                      label={formik.values.Status == 0 ? 'Valor Aquisição' : 'Valor Reforma'}
                      placeholder={formik.values.Status == 0 ? 'Informe o Valor de Aquisição' : 'Informe o Valor da Reforma'}
                      value={`${formik.values.ValorAquisicao}`}
                      status={formik.errors['ValorAquisicao'] ? 'danger' : 'info'}
                      caption={formik.errors['ValorAquisicao']}
                      mask='moeda'
                      maxLength={8}
                      keyboardType='numeric'
                      inputMaskChange={text => formik.setFieldValue('ValorAquisicao', text)}/>
                  </>
                }
                <Select
                  style={styles.input}
                  label='Tipo de Construção'
                  status={formik.errors['Construcao'] ? 'danger' : 'info'}
                  caption={formik.errors['Construcao']}
                  value={formik.values.Construcao == 0 ? `Radial` : `Diagonal`}
                  selectedIndex={new IndexPath(formik.values.Construcao)}
                  onSelect={index => formik.setFieldValue('Construcao', (index as IndexPath).row)} >
                  <SelectItem title='Radial' key='0' />
                  <SelectItem title='Diagonal' key='1' />
                </Select>

                <Mask
                  style={styles.input}
                  label='Índice de Carga'
                  placeholder='Informe o Índice de Carga'
                  value={formatQuant(formik.values.IndiceCarga, 2)}
                  status={formik.errors['IndiceCarga'] ? 'danger' : 'info'}
                  caption={formik.errors['IndiceCarga']}
                  mask={'quant'}
                  casas={2}
                  maxLength={8}
                  keyboardType='numeric'
                  inputMaskChange={text => formik.setFieldValue('IndiceCarga', strToFloat(text))}/>

                <Mask
                  style={styles.input}
                  label='Índice de Velocidade'
                  placeholder='Informe o Índice de Velocidade'
                  value={formatQuant(formik.values.IndiceVelocidade)}
                  status={formik.errors['IndiceVelocidade'] ? 'danger' : 'info'}
                  caption={formik.errors['IndiceVelocidade']}
                  mask={'quant'}
                  casas={2}
                  maxLength={8}
                  keyboardType='numeric'
                  inputMaskChange={text => formik.setFieldValue('IndiceVelocidade', strToFloat(text))}/>

                <Mask
                  style={styles.input}
                  label='Capacidade de Lonas'
                  placeholder='Informe a Capacidade de Lonas'
                  value={`${formik.values.CapacidadeLona}`}
                  status={formik.errors['CapacidadeLona'] ? 'danger' : 'info'}
                  caption={formik.errors['CapacidadeLona']}
                  mask='inteiro'
                  maxLength={4}
                  keyboardType='numeric'
                  inputMaskChange={text => formik.setFieldValue('CapacidadeLona', text)}/>

                <Mask
                  style={styles.input}
                  label='Sulco Mínimo'
                  placeholder='Informe o Sulco Mínimo'
                  textAlign='center'
                  disabled={!formik.values.SulcoMin}
                  value={`${formik.values.SulcoMin}`}
                  status={formik.errors['SulcoMin'] ? 'danger' : 'info'}
                  caption={formik.errors['SulcoMin']}
                  mask='inteiro'
                  maxLength={4}
                  keyboardType='numeric'
                  inputMaskChange={text => formik.setFieldValue('SulcoMin', text)}
                  accessoryLeft={(props) => iconDiminuir({...props, nome: 'SulcoMin'})}
                  accessoryRight={(props) => iconAumentar({...props, nome: 'SulcoMin'})}/>

                {
                  permissao.CadastroCompletoPneu &&
                  <Mask
                    style={styles.input}
                    label='Sulco Máximo'
                    placeholder='Informe o Sulco Máximo'
                    textAlign='center'
                    disabled={!formik.values.SulcoMax}
                    value={`${formik.values.SulcoMax}`}
                    status={formik.errors['SulcoMax'] ? 'danger' : 'info'}
                    caption={formik.errors['SulcoMax']}
                    mask='inteiro'
                    maxLength={4}
                    keyboardType='numeric'
                    inputMaskChange={text => formik.setFieldValue('SulcoMax', text)}
                    accessoryLeft={(props) => iconDiminuir({...props, nome: 'SulcoMax'})}
                    accessoryRight={(props) => iconAumentar({...props, nome: 'SulcoMax'})}/>
                }

                <Mask
                  style={styles.input}
                  disabled={true}
                  label='Sulco Atual'
                  placeholder='Informe o Sulco Atual'
                  value={`${formik.values.SulcoAtual}`}
                  status={formik.errors['SulcoAtual'] ? 'danger' : 'info'}
                  caption={formik.errors['SulcoAtual']}
                  mask='inteiro'
                  maxLength={4}
                  keyboardType='numeric'
                  inputMaskChange={text => formik.setFieldValue('SulcoAtual', text)}/>

                {
                  permissao.CadastroCompletoPneu &&
                  <>
                    <Mask
                      style={styles.input}
                      label='Pressão Mínima'
                      placeholder='Informe a Pressão Mínima'
                      disabled={!formik.values.PressaoMin}
                      value={`${formik.values.PressaoMin}`}
                      status={formik.errors['PressaoMin'] ? 'danger' : 'info'}
                      caption={formik.errors['PressaoMin']}
                      mask='inteiro'
                      maxLength={4}
                      keyboardType='numeric'
                      inputMaskChange={text => formik.setFieldValue('PressaoMin', text)}/>

                    <Mask
                      style={styles.input}
                      label='Pressão Máxima'
                      placeholder='Informe a Pressão Máxima'
                      disabled={!formik.values.PressaoMax}
                      value={`${formik.values.PressaoMax}`}
                      status={formik.errors['PressaoMax'] ? 'danger' : 'info'}
                      caption={formik.errors['PressaoMax']}
                      mask='inteiro'
                      maxLength={4}
                      keyboardType='numeric'
                      inputMaskChange={text => formik.setFieldValue('PressaoMax', text)}/>
                  </>
                }
                <Mask
                  style={styles.input}
                  disabled={true}
                  label='Pressão Atual'
                  placeholder='Informe a Pressão Atual'
                  value={`${formik.values.PressaoAtual}`}
                  status={formik.errors['PressaoAtual'] ? 'danger' : 'info'}
                  caption={formik.errors['PressaoAtual']}
                  mask='inteiro'
                  maxLength={4}
                  keyboardType='numeric'
                  inputMaskChange={text => formik.setFieldValue('PressaoAtual', text)}/>

                {
                  permissao.CadastroCompletoPneu &&
                  <>
                    <Mask
                      style={styles.input}
                      label='Horas Projetadas do Pneu'
                      placeholder='Informe as Horas Projetadas'
                      value={`${formik.values.VidaUtilEsperadaHr}`}
                      status={formik.errors['VidaUtilEsperadaHr'] ? 'danger' : 'info'}
                      caption={formik.errors['VidaUtilEsperadaHr']}
                      mask='inteiro'
                      maxLength={4}
                      keyboardType='numeric'
                      inputMaskChange={text => formik.setFieldValue('VidaUtilEsperadaHr', text)}/>

                    <Mask
                      style={styles.input}
                      label='Horas Acumuladas do Pneu'
                      disabled={true}
                      placeholder='Informe as Horas Acumuladas'
                      value={`${formik.values.HrAcumulado}`}
                      status={formik.errors['HrAcumulado'] ? 'danger' : 'info'}
                      caption={formik.errors['HrAcumulado']}
                      mask='inteiro'
                      maxLength={4}
                      keyboardType='numeric'
                      inputMaskChange={text => formik.setFieldValue('HrAcumulado', text)}/>

                    <Mask
                      style={styles.input}
                      disabled={true}
                      label='Hora do Status Atual'
                      placeholder='Informe a Hora Atual'
                      value={`${formik.values.HrAtual}`}
                      status={formik.errors['HrAtual'] ? 'danger' : 'info'}
                      caption={formik.errors['HrAtual']}
                      mask='inteiro'
                      maxLength={4}
                      keyboardType='numeric'
                      inputMaskChange={text => formik.setFieldValue('HrAtual', text)}/>

                    <Mask
                      style={styles.input}
                      label='KM Projetados do Pneu'
                      placeholder='Informe o KM Projetados'
                      value={`${formik.values.VidaUtilEsperadaKm}`}
                      status={formik.errors['VidaUtilEsperadaKm'] ? 'danger' : 'info'}
                      caption={formik.errors['VidaUtilEsperadaKm']}
                      mask='moeda'
                      maxLength={4}
                      keyboardType='numeric'
                      inputMaskChange={text => formik.setFieldValue('VidaUtilEsperadaKm', text)}/>

                    <Mask
                      style={styles.input}
                      disabled={true}
                      label='KM Acumulado do Pneu'
                      placeholder='Informe o KM Acumulado'
                      value={`${formik.values.KmAcumulado}`}
                      status={formik.errors['KmAcumulado'] ? 'danger' : 'info'}
                      caption={formik.errors['KmAcumulado']}
                      mask='moeda'
                      maxLength={4}
                      keyboardType='numeric'
                      inputMaskChange={text => formik.setFieldValue('KmAcumulado', text)}/>

                    <Mask
                      style={styles.input}
                      disabled={true}
                      label='KM do Status Atual'
                      placeholder='Informe o KM Atual'
                      value={`${formik.values.KmAtual}`}
                      status={formik.errors['KmAtual'] ? 'danger' : 'info'}
                      caption={formik.errors['KmAtual']}
                      mask='inteiro'
                      maxLength={4}
                      keyboardType='numeric'
                      inputMaskChange={text => formik.setFieldValue('KmAtual', text)}/>
                  </>
                }
                
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

              </SafeAreaLayout>
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
          status='success'
          onPress={submitForm}>
          Salvar
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
  inputLast: {
    marginHorizontal: 12,
    marginVertical: 8,
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
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  footer: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
});
