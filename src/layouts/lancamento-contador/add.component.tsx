import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, CheckBox, Datepicker, Divider, IndexPath, Input, Radio, RadioGroup, Select, SelectItem, StyleService, Text, Toggle, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { useFormik } from 'formik';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon, CameraIcon } from '../../components/icons';
import Loader from '../../components/Loader';
import { lancContadorInsertSchema } from './schemas';
import Mask from '../../components/mask.component';
import { PneuCard } from '../pneu/pneu-card.component';
import { IPneu } from '../../model/pneu.model';
import { IMotivo } from '../../model/motivo.model';
import { IMovimentacaoPneu } from '../../model/movimentacao-pneu.model';
import { CentroCustoCard } from '../centro-custo/centro-custo-card.component';
import { MotivoCard } from '../motivo/motivo-card.component';
import { ICentroCusto } from '../../model/centro-custo.model';
import { dataAtual, strToDate } from '../../utils/date';
import { horaAtual, strToTime } from '../../utils/time';
import MovEstoqueService from '../../services/api-mov-estoque-service';
import { IBem } from '../../model/bem.model';
import { IContador, ILancamentoContador } from '../../model/lancamento-contador.model';
import { BemCard } from '../bem/bem-card.component';
import BemService from '../../services/api-bem-service';
import LancContadorService from '../../services/api-lancamento-contador-service';
import { AppStorage } from '../../services/app-storage.service';
import { formatQuant, strToFloat } from '../../utils/float';

interface Params {
  bem: IBem;
  ultCont: ILancamentoContador;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [param,] = React.useState(route.params as Params);
  const [model, setModel] = React.useState<ILancamentoContador>({ DataString: dataAtual(), HoraString: horaAtual(), 
                                Bem: param.bem, Contador: {...param.ultCont?.Contador, ContadorAtualStr: param.ultCont?.ContadorNovoStr }, ContadorNovo: param.ultCont?.ContadorNovo} as ILancamentoContador);

  /*const [listContador, setListContador] = useState<IContador[]>([]);
  const [contadorIndex, setContadorIndex] = React.useState(new IndexPath(0));
  const contadorValue = listContador[contadorIndex.row];                                
*/
  //**********************************************************************************************************/

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);


        
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

  /*async function setContador(index: IndexPath) {
    setContadorIndex(index);
    await formik.setFieldValue('Contador', listContador[index.row], true);
    await formik.setFieldTouched('Contador', true, true);
    formik.validateForm();
  }*/

  async function verificaContador() {
    if (formik.values.ContadorNovo && param.ultCont?.ContadorNovo){
        if(formik.values.ContadorNovo < param.ultCont?.ContadorNovo && formik.values.Data == param.ultCont?.Data){
          Alert.alert('Aviso', 'A posição atual do contador é menor que a posição do último lançamento.');
          await formik.setFieldValue('ContadorNovo', param.ultCont?.ContadorNovo, true);
          await formik.setFieldTouched('ContadorNovo', true, true);
          formik.validateForm();
        }
     
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

  const handleSave = async (values: ILancamentoContador): Promise<void> => {
    if(isLoading == false){
      try {
        setIsLoading(true); 

        values.Data = strToDate(values.DataString);
        values.Hora = strToTime(values.HoraString);

        var lanc = values as ILancamentoContador;
        lanc.ContadorNovoStr = `${values.ContadorNovo}`.replace(".", ",");
        
        const service = new LancContadorService();
        const resultValidacao = await service.validar([lanc]);
        
        if (resultValidacao.data != null) {
          if (resultValidacao.data.Inconsistente == false) {
            const result = await service.add(values);
            
            if (result.data == 1) {
              Alert.alert('Sucesso', `Lançamento de contador gravado com sucesso.`, [
                { text: 'Ok', onPress: () => { navigation.goBack() }, }],
                { cancelable: false },
              );
            } else if (result.data == -10){
              Alert.alert('Aviso', 'Valor do Contador ultrapassou o limite máximo configurado.')
            } else {
              Alert.alert('Aviso', 'Falha no lançamento.')
            }
          }else if (resultValidacao.data.TipoInconsistencia == 1){
            Alert.alert('Aviso', `Existe um lançamento de contador anterior a esta data com um valor MAIOR. Insira um valor MAIOR que ${resultValidacao.data.ContadorSugerido} para ${resultValidacao.data.NomeContador} antes de prosseguir.`);
            await formik.setFieldValue('ContadorNovo', Number(resultValidacao.data.ContadorSugerido.replace(",", ".")), true);
            await formik.setFieldTouched('ContadorNovo', true, true);
            formik.validateForm();
          }else{
            Alert.alert('Aviso', `Existe um lançamento de contador posterior a esta data com um valor MENOR. Insira um valor MENOR que ${resultValidacao.data.ContadorSugerido} para ${resultValidacao.data.NomeContador} antes de prosseguir.`);
            await formik.setFieldValue('ContadorNovo', Number(resultValidacao.data.ContadorSugerido.replace(",", ".")), true);
            await formik.setFieldTouched('ContadorNovo', true, true);
            formik.validateForm();
          }
        }else{
          Alert.alert('Aviso', 'Ocorreu um erro na verificação.')
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
    validationSchema: lancContadorInsertSchema,
    onSubmit: values => { handleSave(values) },
  });

  const submitForm = (): void => {formik.handleSubmit()};

  return (
    <>
      <TopNavigation
        title='LANÇAMENTO DE CONTADOR'
        accessoryLeft={renderDrawerAction} />

      <Divider />

      <Loader
        loading={isLoading} />

      <KeyboardAvoidingView
        style={styles.container}>

        <SafeAreaLayout
          style={styles.form}
          level='1'>
          
          <BemCard
            data={formik.values.Bem}
            onFindPress={null} 
            onLancarContadorPress={null}/>

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
            placeholder='Informe a hora'
            value={formik.values.HoraString}
            status={formik.errors['HoraString'] ? 'danger' : 'info'}
            mask={'hora'}
            maxLength={5}
            keyboardType='number-pad'
            inputMaskChange={text => formik.setFieldValue('HoraString', text)}/>  

          <Input
            style={styles.input}
            disabled={true}
            label='Contador'
            value={model.Contador.NomeContador} />

          <Input
            style={styles.input}
            disabled={true}
            label='Posição Anterior'
            value={formatQuant(param.ultCont.ContadorNovo, 2)} />  

          <Mask
            style={styles.input}
            label='Posição Atual'
            placeholder='Informe a Posição Atual do Contador'
            value={formatQuant(formik.values.ContadorNovo, 2)}
            status={formik.errors['ContadorNovo'] ? 'danger' : 'info'}
            caption={formik.errors['ContadorNovo']}
            mask='moeda'
            casas={2}
            maxLength={11}
            keyboardType='numeric'
            inputMaskChange={text => formik.setFieldValue('ContadorNovo', strToFloat(text))}
            onBlur={e => verificaContador()}/>
          
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
});
