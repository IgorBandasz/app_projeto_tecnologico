import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Image, ImageSourcePropType, View } from 'react-native';
import { Button, CheckBox, Datepicker, Divider, Icon, IndexPath, Input, Radio, RadioGroup, Select, SelectItem, StyleService, Text, Toggle, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { useFormik } from 'formik';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon, CameraIcon } from '../../components/icons';
import Loader from '../../components/Loader';
import { afericaoInsertSchema } from './schemas';
import Mask from '../../components/mask.component';
import { dataAtual, strToDate } from '../../utils/date';
import { IIndicadorAnomalia } from '../../model/indicador-anomalia.model';
import { IAfericao } from '../../model/afericao.model';
import { horaAtual, strToTime } from '../../utils/time';
import IndicadorAnomaliaService from '../../services/api-indicador-anomalia-service';
import AfericaoService from '../../services/api-afericao-service';
import { PneuCard } from '../pneu/pneu-card.component';
import { IPneu } from '../../model/pneu.model';
import { IBem } from '../../model/bem.model';
import { ILancamentoContador } from '../../model/lancamento-contador.model';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';

interface Params {
  pneu: IPneu;
  voltas: number;
  onGoBack: () => Promise<void>;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [param,] = React.useState(route.params as Params);
  const [addImagens, setAddImagens] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<IAfericao>({DataString: dataAtual(), HoraString: horaAtual(), Status: 0,
        Sulco: param.pneu.SulcoAtual, Pressao: param.pneu.PressaoAtual, Hr: param.pneu.HrAtual, Km: param.pneu.KmAtual, Pneu: param.pneu} as IAfericao);

  const [listAvaria, setListAvaria] = useState<IIndicadorAnomalia[]>([]);
  const [avariaIndex, setAvariaIndex] = React.useState(new IndexPath(0));
  const avariaValue = listAvaria[avariaIndex.row];

  const [listCausa, setListCausa] = useState<IIndicadorAnomalia[]>([]);
  const [causaIndex, setCausaIndex] = React.useState(new IndexPath(0));
  const causaValue = listCausa[causaIndex.row];

  const [listAcao, setListAcao] = useState<IIndicadorAnomalia[]>([]);
  const [acaoIndex, setAcaoIndex] = React.useState(new IndexPath(0));
  const acaoValue = listAcao[acaoIndex.row];

  const [listPrecaucao, setListPrecaucao] = useState<IIndicadorAnomalia[]>([]);
  const [precaucaoIndex, setPrecaucaoIndex] = React.useState(new IndexPath(0));
  const precaucaoValue = listPrecaucao[precaucaoIndex.row];

  //**********************************************************************************************************/

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const service = new IndicadorAnomaliaService();
        const resultAv = await service.getAll(null,null,null,null,null,null,null);
        if(resultAv.status == 200){
          var listaAv = [{ Id: 0, Nome: 'Selecione a Avaria' }];
          var listaCa = [{ Id: 0, Nome: 'Selecione a Causa' }];
          var listaAc = [{ Id: 0, Nome: 'Selecione a Ação' }];
          var listaPr = [{ Id: 0, Nome: 'Selecione a Precaução' }];
          resultAv.data.Data.forEach(item => {
            if(item.Avaria === 1)
              listaAv = [...listaAv, item];
            if(item.Causa === 1)
              listaCa = [...listaCa, item];
            if(item.Acao === 1)
              listaAc = [...listaAc, item];
            if(item.Precaucao === 1)
              listaPr = [...listaPr, item];  
          });
          
          setListAvaria(listaAv);
          setListCausa(listaCa);
          setListAcao(listaAc);
          setListPrecaucao(listaPr);
        }else{
          setListAvaria([]);
          setListCausa([]);
          setListAcao([]);
          setListPrecaucao([]);
          Alert.alert('Aviso',resultAv.data.Message);
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

  async function setAvaria(index: IndexPath) {
    setAvariaIndex(index);
    await formik.setFieldValue('Avaria', listAvaria[index.row], true);
    await formik.setFieldTouched('Avaria', true, true);
    formik.validateForm();
  }

  async function setCausa(index: IndexPath) {
    setCausaIndex(index);
    await formik.setFieldValue('Causa', listCausa[index.row], true);
    await formik.setFieldTouched('Causa', true, true);
    formik.validateForm();
  }

  async function setAcao(index: IndexPath) {
    setAcaoIndex(index);
    await formik.setFieldValue('Acao', listAcao[index.row], true);
    await formik.setFieldTouched('Acao', true, true);
    formik.validateForm();
  }

  async function setPrecaucao(index: IndexPath) {
    setPrecaucaoIndex(index);
    await formik.setFieldValue('Precaucao', listPrecaucao[index.row], true);
    await formik.setFieldTouched('Precaucao', true, true); 
    formik.validateForm();
  }

  async function handleLancarContador(bem: IBem, ultCont: ILancamentoContador) {
    navigation.navigate('LancamentoContadorAdd', { bem: bem, ultCont: ultCont });
  }

  const onCancelarButtonPress = (): void => {
    if(isLoading == false){
      setIsLoading(true);
      navigation && navigation.goBack();
    }
  };

  const handleSave = async (values: IAfericao): Promise<void> => {
    if(isLoading == false){
      try {
        setIsLoading(true); 

        values.Data = strToDate(values.DataString);
        values.Hora = strToTime(values.HoraString);
        
        const service = new AfericaoService();
        const result = await service.add(values);
        
        if (result.status === 201) {
          if (addImagens){
            const resultAfericao = await service.getOne(result.data.Id);
            
            if (resultAfericao.data.Data){
              setIsLoading(false);
              var voltas: number;
              param.voltas ? voltas = param.voltas + 1 : voltas = 1;
              
              navigation.navigate('AfericaoEdit', { 
                data: resultAfericao.data.Data,
                voltas: voltas,
                onGoBack: () => param.onGoBack()  
              });
            }else{
              await param.onGoBack();
              Alert.alert('Aviso', 'Erro ao buscar a aferição inserida', [
                { text: 'Ok', onPress: () => { navigation.goBack() }, }],
                { cancelable: false },
              );
            }
          }else{
            await param.onGoBack();
            Alert.alert('Sucesso', `Aferição salva com sucesso. Id: ${result.data.Id}`, [
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
    validationSchema: afericaoInsertSchema,
    onSubmit: values => { handleSave(values) },
  });

  const submitForm = (): void => {formik.handleSubmit()};

  const submitFormAddImagens = (): void => {setAddImagens(true); formik.handleSubmit()};

  return (
    <>
      <TopNavigation
        title='NOVA AFERIÇÃO'
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
          
          <Mask
            style={styles.input}
            label='Data'
            placeholder='Informe a Data'
            value={formik.values.DataString}
            status={formik.errors['DataString'] ? 'danger' : 'info'}
            mask={'data'}
            maxLength={10}
            keyboardType='number-pad'
            inputMaskChange={text => formik.setFieldValue('DataString', text)} />

          <Mask
            style={styles.input}
            label='Hora'
            placeholder='Informe a Hora'
            value={formik.values.HoraString}
            status={formik.errors['HoraString'] ? 'danger' : 'info'}
            mask={'hora'}
            maxLength={5}
            keyboardType='number-pad'
            inputMaskChange={text => formik.setFieldValue('HoraString', text)} />    

          <Mask
            style={styles.input}
            label='Sulco Atual'
            placeholder='Informe o Sulco'
            textAlign='center'
            value={`${formik.values.Sulco}`}
            status={formik.errors['Sulco'] ? 'danger' : 'info'}
            caption={formik.errors['Sulco']}
            mask='inteiro'
            maxLength={8}
            keyboardType='numeric'
            inputMaskChange={text => formik.setFieldValue('Sulco', text)}
            accessoryLeft={(props) => iconDiminuir({...props, nome: 'Sulco'})}
            accessoryRight={(props) => iconAumentar({...props, nome: 'Sulco'})}/>

          <Mask
            style={styles.input}
            label='Pressão Atual'
            placeholder='Informe a Pressão'
            textAlign='center'
            value={`${formik.values.Pressao}`}
            status={formik.errors['Pressao'] ? 'danger' : 'info'}
            caption={formik.errors['Pressao']}
            mask='inteiro'
            maxLength={8}
            keyboardType='numeric'
            inputMaskChange={text => formik.setFieldValue('Pressao', text)}
            accessoryLeft={(props) => iconDiminuir({...props, nome: 'Pressao'})}
            accessoryRight={(props) => iconAumentar({...props, nome: 'Pressao'})}/>

          <Input
            style={styles.input}
            disabled={true}
            label='Hr Atual do Pneu em Todos os Status'
            value={`${formik.values.Hr}`}/>

          <Input
            style={styles.input}
            disabled={true}
            label='Km Atual do Pneu em Todos os Status'
            value={`${formik.values.Km}`}/>

          <Select
            style={styles.input}
            label='Avaria'
            placeholder='Selecione a Avaria'
            value={avariaValue ? avariaValue.Nome : '...'}
            status={formik?.errors?.Avaria?.Id ? 'danger' : 'info'}
            caption={formik?.errors?.Avaria?.Id}
            selectedIndex={avariaIndex}
            onSelect={index => setAvaria(index as IndexPath)} >
            {
              listAvaria.map((item, index) => (
                <SelectItem title={item.Nome} key={index} />
              ))
            }
          </Select>

          <Select
            style={styles.input}
            label='Causa'
            placeholder='Selecione a Causa'
            value={causaValue ? causaValue.Nome : '...'}
            status={formik?.errors?.Causa?.Id ? 'danger' : 'info'}
            caption={formik?.errors?.Causa?.Id}
            selectedIndex={causaIndex}
            onSelect={index => setCausa(index as IndexPath)} >
            {
              listCausa.map((item, index) => (
                <SelectItem title={item.Nome} key={index} />
              ))
            }
          </Select>

          <Select
            style={styles.input}
            label='Ação'
            placeholder='Selecione a Ação'
            value={acaoValue ? acaoValue.Nome : '...'}
            status={formik?.errors?.Acao?.Id ? 'danger' : 'info'}
            caption={formik?.errors?.Acao?.Id}
            selectedIndex={acaoIndex}
            onSelect={index => setAcao(index as IndexPath)} >
            {
              listAcao.map((item, index) => (
                <SelectItem title={item.Nome} key={index} />
              ))
            }
          </Select>

          <Select
            style={styles.input}
            label='Precaução'
            placeholder='Selecione a Precaução'
            value={precaucaoValue ? precaucaoValue.Nome : '...'}
            status={formik?.errors?.Precaucao?.Id ? 'danger' : 'info'}
            caption={formik?.errors?.Precaucao?.Id}
            selectedIndex={precaucaoIndex}
            onSelect={index => setPrecaucao(index as IndexPath)} >
            {
              listPrecaucao.map((item, index) => (
                <SelectItem title={item.Nome} key={index} />
              ))
            }
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
