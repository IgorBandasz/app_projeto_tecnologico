import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Image, ImageSourcePropType, View } from 'react-native';
import { Button, CheckBox, Datepicker, Divider, Icon, IndexPath, Input, Radio, RadioGroup, Select, SelectItem, StyleService, Text, Toggle, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { useFormik } from 'formik';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon } from '../../components/icons';
import Loader from '../../components/Loader';
import { pneuInsertSchema } from './schemas';
import { AppStorage } from '../../services/app-storage.service';
import PneuService from '../../services/api-pneu-service';
import { IPneu } from '../../model/pneu.model';
import { IModeloPneu } from '../../model/modelo-pneu.model';
import Mask from '../../components/mask.component';
import { ModeloPneuCard } from '../modelo-pneu/modelo-pneu-card.component';
import { IFabricantePneu } from '../../model/fabricante-pneu.model';
import { IFornecedor } from '../../model/fornecedor.model';
import { FornecedorCard } from '../fornecedor/fornecedor-card.component';
import { FabricantePneuCard } from '../fabricante-pneu/fabricante-pneu-card.component';
import { MedidaCard } from '../medida/medida-card.component';
import { IMedida } from '../../model/medida.model';
import { IDesenho } from '../../model/desenho.model';
import { ICentroCusto } from '../../model/centro-custo.model';
import { IBem } from '../../model/bem.model';
import { DesenhoCard } from '../desenho/desenho-card.component';
import { CentroCustoCard } from '../centro-custo/centro-custo-card.component';
import { BemCard } from '../bem/bem-card.component';
import { IPosicaoPneu } from '../../model/posicao.model';
import { dataAtual, strToDate } from '../../utils/date';
import BemService from '../../services/api-bem-service';
import { ILancamentoContador } from '../../model/lancamento-contador.model';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import { IPermissao } from '../../model/usuario-model';
import { formatQuant, strToFloat } from '../../utils/float';

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [permissao, setPermissao] = React.useState<IPermissao>({CadastroCompletoPneu: false} as IPermissao);
  const [model, setModel] = React.useState<IPneu>({DataAquisicaoString: dataAtual(), Status: 0, Disponibilidade: 1,
        KmAcumulado: 0, KmAtual: 0, VidaUtilEsperadaKm: 0, SulcoAtual: 0, SulcoMax: 0, SulcoMin: 0, 
        PressaoAtual: 0, PressaoMax: 0, PressaoMin: 0, HrAcumulado: 0, HrAtual: 0, VidaUtilEsperadaHr: 0,
        IndiceCarga: 0, IndiceVelocidade: 0, CapacidadeLona: 0, ValorAquisicao: 0, Construcao: 0} as IPneu);
  //const [param,] = React.useState(route.params as Params);

  const [listPosicao, setListPosicao] = useState<IPosicaoPneu[]>([]);
  const [posicaoIndex, setPosicaoIndex] = React.useState(new IndexPath(0));
  const posicaoValue = listPosicao[posicaoIndex.row];

  //**********************************************************************************************************/

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const user = await AppStorage.getUsuario();
        await formik.setFieldValue('Usuario', user);
        setPermissao(user.Permissao);
        
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

  async function setDisponibilidade(index: IndexPath) {
    formik.setFieldValue('Disponibilidade', (index as IndexPath).row);
    formik.validateForm();
  }

  async function setPosicao(index: IndexPath) {
    setPosicaoIndex(index);
    await formik.setFieldValue('Posicao', listPosicao[index.row]?.Posicao, true);
    await formik.setFieldValue('Eixo', listPosicao[index.row]?.Eixo, true);
    await formik.setFieldValue('Rodado', listPosicao[index.row]?.Rodado, true);
    await formik.setFieldTouched('Posicao', true, true);
    formik.validateForm();
  }

  async function handleFindModeloPneu() {
    navigation.navigate('ModeloPneuList', {
      Fabricante: formik.values.FabricantePneu,
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

  async function handleFindBem() {
    navigation.navigate('BemList', {
      onSelect: (item: IBem) => handleSelectBem(item)
    })
  }

  async function handleLancarContador(bem: IBem, ultCont: ILancamentoContador) {
    navigation.navigate('LancamentoContadorAdd', { bem: bem, ultCont: ultCont });
  }

  async function handleSelectBem(item: IBem) {
    try {
      setIsLoading(true);

      const service = new BemService();
      const result = await service.getPosicaoLivre(item.Id);
      
      if(result.status == 200){
        await setListPosicao(result.data.Data);
      }else{
        await setListPosicao([]);
        Alert.alert('Aviso',result.data?.Message);
      }
      const posicao = result.data.Data[0] as IPosicaoPneu;
      await formik.setFieldValue('Posicao', posicao?.Posicao, true);
      await formik.setFieldValue('Eixo', posicao?.Eixo, true);
      await formik.setFieldValue('Rodado', posicao?.Rodado, true);
      
      await formik.setFieldValue('Bem', item)
      await formik.setFieldValue('CentroCusto', item.CentroCusto)
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Alert.alert(error);
    }
  }

  const onCancelarButtonPress = (): void => {
    if(isLoading == false){
      setIsLoading(true);
      navigation && navigation.goBack();
    }
  };

  const onSubmitButtonPress = (): void => {
    if(formik.values.Status == 0){
      Alert.alert('Salvar', 'Você está cadastrando um pneu com status Novo. Deseja continuar?', [{text:'Sim',onPress: ()=>{handleSave(formik.values)}}, {text:'Não',onPress: ()=>{}}]);
    }else{
      handleSave(formik.values);
    }
  };

  const handleSave = async (values: IPneu): Promise<void> => {
    if(isLoading == false){
      try {
        setIsLoading(true); 

        values.DataAquisicao = strToDate(values.DataAquisicaoString);
        values.DataGarantia = strToDate(values.DataGarantiaString);
        values.DataInstalacao = strToDate(values.DataInstalacaoString);
        console.log(JSON.stringify(values))
        const service = new PneuService();
        const result = await service.add(values);
        console.log(result)
        if (result.status === 201) {
          const resultPneu = await service.getOne(result.data.Id);
          
          if (resultPneu.status == 200){
            setIsLoading(false);
            navigation.navigate('PneuEdit', { 
              data: resultPneu.data.Data,
              voltas: 2
            });
          }else{
            Alert.alert('Aviso', 'Erro ao buscar o pneu inserido', [
              { text: 'Ok', onPress: () => { navigation.goBack() }, }],
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
    validationSchema: pneuInsertSchema,
    onSubmit: values => { onSubmitButtonPress() },
  });

  const submitForm = (): void => {formik.handleSubmit()};

  return (
    <>
      <TopNavigation
        title='NOVO PNEU'
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
                  source={imagemDisponibilidade(formik.values.Disponibilidade)}></Image>
            </View> 

            <View
              style={[styles.status, { backgroundColor: corStatus(formik.values.Status) }]}></View>
                
            <View>
              <Select
                style={styles.input_card}
                label='Status'
                status={formik.errors['Status'] ? 'danger' : 'info'}
                caption={formik.errors['Status']}
                value={getStatus(formik.values.Status)}
                selectedIndex={new IndexPath(formik.values.Status)}
                onSelect={index => formik.setFieldValue('Status', (index as IndexPath).row)} >
                <SelectItem title='Novo' key='0' />
                <SelectItem title='R1' key='1' />
                <SelectItem title='R2' key='2' />
                <SelectItem title='R3' key='3' />
                <SelectItem title='R4' key='4' />
                <SelectItem title='R5' key='5' />
              </Select>
              
              <Input
                style={styles.input_card}
                label='Número de Fogo'
                placeholder='Informe o Número de Fogo'
                value={formik.values.NumeroFogo}
                status={formik.errors['NumeroFogo'] ? 'danger' : 'info'}
                caption={formik.errors['NumeroFogo']}
                onChangeText={text => formik.setFieldValue('NumeroFogo', text)} />
            </View>
          </View>  

          <Divider/>

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

          <Select
            style={styles.input}
            label='Alocado'
            status={formik.errors['Disponibilidade'] ? 'danger' : 'info'}
            caption={formik.errors['Disponibilidade']}
            value={getDisponibilidade(formik.values.Disponibilidade)}
            selectedIndex={new IndexPath(formik.values.Disponibilidade)}
            onSelect={index => setDisponibilidade(index as IndexPath)} >
            <SelectItem title='Bem' key='0' />
            <SelectItem title='Estoque' key='1' />
            <SelectItem title='Sucata' key='2' />
            <SelectItem title='Recapagem' key='3' />
            <SelectItem title='Venda' key='4' />
            <SelectItem title='Conserto' key='5' />
          </Select>

          {
            formik.values.Disponibilidade == 0 &&
            <>
              <BemCard
                data={formik.values.Bem}
                onFindPress={formik.values.Disponibilidade == 0 ? handleFindBem : null} 
                onLancarContadorPress={handleLancarContador}/> 

              <Select
                style={styles.input}
                label='Posição'
                disabled={formik.values.Disponibilidade != 0}
                placeholder='Selecione a Posição do Pneu'
                value={posicaoValue ? posicaoValue.Posicao : '...'}
                status={formik?.errors?.Posicao ? 'danger' : 'info'}
                caption={formik?.errors?.Posicao}
                selectedIndex={posicaoIndex}
                onSelect={index => setPosicao(index as IndexPath)} >
                {
                  listPosicao.map((item, index) => (
                    <SelectItem title={item.Posicao} key={index} />
                  ))
                }
              </Select>
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
            caption={formik?.errors?.ModeloPneu?.Id}
            onFindPress={handleFindModeloPneu} />

          <MedidaCard
            data={formik.values.Medida}
            onFindPress={handleFindMedida} /> 

          {
            formik.values.Status != 0 &&
            <DesenhoCard
              data={formik.values.Desenho}
              onFindPress={handleFindDesenho} /> 
          }
          
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
            mask='quant'
            casas={2}
            maxLength={8}
            keyboardType='numeric'
            inputMaskChange={text => formik.setFieldValue('IndiceCarga', strToFloat(text))}/>


          <Mask
            style={styles.input}
            label='Índice de Velocidade'
            placeholder='Informe o Índice de Velocidade'
            value={formatQuant(formik.values.IndiceVelocidade, 2)}
            status={formik.errors['IndiceVelocidade'] ? 'danger' : 'info'}
            caption={formik.errors['IndiceVelocidade']}
            mask='quant'
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
            maxLength={8}
            keyboardType='numeric'
            inputMaskChange={text => formik.setFieldValue('CapacidadeLona', text)}/>

          <Mask
            style={styles.input}
            label='Sulco Mínimo'
            placeholder='Informe o Sulco Mínimo'
            textAlign='center'
            value={`${formik.values.SulcoMin}`}
            status={formik.errors['SulcoMin'] ? 'danger' : 'info'}
            caption={formik.errors['SulcoMin']}
            mask='inteiro'
            maxLength={8}
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
                value={`${formik.values.SulcoMax}`}
                status={formik.errors['SulcoMax'] ? 'danger' : 'info'}
                caption={formik.errors['SulcoMax']}
                mask='inteiro'
                maxLength={8}
                keyboardType='numeric'
                inputMaskChange={text => formik.setFieldValue('SulcoMax', text)}
                accessoryLeft={(props) => iconDiminuir({...props, nome: 'SulcoMax'})}
                accessoryRight={(props) => iconAumentar({...props, nome: 'SulcoMax'})}/>
          }

          <Mask
            style={styles.input}
            label='Sulco Atual'
            placeholder='Informe o Sulco Atual'
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

          {
            permissao.CadastroCompletoPneu &&
            <>
              <Mask
                style={styles.input}
                label='Pressão Mínima'
                placeholder='Informe a Pressão Mínima'
                value={`${formik.values.PressaoMin}`}
                status={formik.errors['PressaoMin'] ? 'danger' : 'info'}
                caption={formik.errors['PressaoMin']}
                mask='inteiro'
                maxLength={8}
                keyboardType='numeric'
                inputMaskChange={text => formik.setFieldValue('PressaoMin', text)}/>

              <Mask
                style={styles.input}
                label='Pressão Máxima'
                placeholder='Informe a Pressão Máxima'
                value={`${formik.values.PressaoMax}`}
                status={formik.errors['PressaoMax'] ? 'danger' : 'info'}
                caption={formik.errors['PressaoMax']}
                mask='inteiro'
                maxLength={8}
                keyboardType='numeric'
                inputMaskChange={text => formik.setFieldValue('PressaoMax', text)}/>
            </>
          }

          <Mask
            style={styles.input}
            label='Pressão Atual'
            placeholder='Informe a Pressão Atual'
            value={`${formik.values.PressaoAtual}`}
            status={formik.errors['PressaoAtual'] ? 'danger' : 'info'}
            caption={formik.errors['PressaoAtual']}
            mask='inteiro'
            maxLength={8}
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
                maxLength={8}
                keyboardType='numeric'
                inputMaskChange={text => formik.setFieldValue('VidaUtilEsperadaHr', text)}/>

              <Mask
                style={styles.input}
                label='Horas Acumuladas do Pneu'
                placeholder='Informe as Horas Acumuladas'
                value={`${formik.values.HrAcumulado}`}
                status={formik.errors['HrAcumulado'] ? 'danger' : 'info'}
                caption={formik.errors['HrAcumulado']}
                mask='inteiro'
                maxLength={8}
                keyboardType='numeric'
                inputMaskChange={text => formik.setFieldValue('HrAcumulado', text)}/>

              <Mask
                style={styles.input}
                label='Hora do Status Atual'
                placeholder='Informe a Hora Atual'
                value={`${formik.values.HrAtual}`}
                status={formik.errors['HrAtual'] ? 'danger' : 'info'}
                caption={formik.errors['HrAtual']}
                mask='inteiro'
                maxLength={8}
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
                maxLength={8}
                keyboardType='numeric'
                inputMaskChange={text => formik.setFieldValue('VidaUtilEsperadaKm', text)}/>

              <Mask
                style={styles.input}
                label='KM Acumulado do Pneu'
                placeholder='Informe o KM Acumulado'
                value={`${formik.values.KmAcumulado}`}
                status={formik.errors['KmAcumulado'] ? 'danger' : 'info'}
                caption={formik.errors['KmAcumulado']}
                mask='moeda'
                maxLength={8}
                keyboardType='numeric'
                inputMaskChange={text => formik.setFieldValue('KmAcumulado', text)}/>

              <Mask
                style={styles.input}
                label='KM do Status Atual'
                placeholder='Informe o KM Atual'
                value={`${formik.values.KmAtual}`}
                status={formik.errors['KmAtual'] ? 'danger' : 'info'}
                caption={formik.errors['KmAtual']}
                mask='inteiro'
                maxLength={8}
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
});
