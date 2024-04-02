import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useFormik } from 'formik';
import { Layout, StyleService, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { Button, Divider, Input } from '@ui-kitten/components';

import Loader from '../../components/Loader';
import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { ArrowIosBackIcon } from '../../components/icons';
import { AppStorage } from '../../services/app-storage.service';
import { IConfiguracao } from '../../model/configuracao.model';
import { configuracaoInsertSchema } from './schemas';

export default ({ navigation }): React.ReactElement => {

  const styles = useStyleSheet(themedStyles);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<IConfiguracao>({} as IConfiguracao);

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={handleCancel}
    />
  );

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const value = await AppStorage.getConfiguracao();
        setModel({ host: value.host });

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        Alert.alert(error);
      }
    }

    handleLoad();
  }, []);

  const handleSave = (values: IConfiguracao): void => {
    if(isLoading == false){
      try {
        setIsLoading(true);

        AppStorage.setConfiguracao(values);

        Alert.alert('Sucesso', 'Configuração salva com sucesso!', [
          { text: 'Ok', onPress: () => { navigation && navigation.goBack() }, }],
          { cancelable: false },
        );

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        Alert.alert(error);
      }
    }
  };

  const handleCancel = (): void => {
    if(isLoading == false){
      setIsLoading(true);
      navigation && navigation.goBack();
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: model,
    validationSchema: configuracaoInsertSchema,
    validateOnBlur: true,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: values => { handleSave(values) },
  });

  const submitForm = () => formik.handleSubmit();

  return (
    <>
      <TopNavigation
        title='CONFIGURAÇÃO'
        accessoryLeft={renderDrawerAction} />

      <Divider />

      <Loader 
        loading={isLoading} />

      <KeyboardAvoidingView 
        style={styles.container}>

        <Layout
          style={styles.form}
          level='1'>

          <Input
            style={styles.input}
            label='Host/Porta'
            placeholder='Informe o host com a porta'
            value={formik.values.host}
            status={formik.errors['host'] && 'danger'}
            caption={formik.errors['host']}
            onChangeText={text => formik.setFieldValue('host', text)}/>
        </Layout>

        <Divider />

        <Button
          disabled={!formik.isValid}
          style={styles.salvarButton}
          size='medium'
          status='success'
          onPress={submitForm}>
          Salvar
        </Button>
        
        <Button
          style={styles.cancelarButton}
          size='medium'
          status='danger'
          onPress={handleCancel}>
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
    paddingVertical: 4,
  },
  input: {
    marginHorizontal: 12,
    marginTop: 8,
  },
  salvarButton: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  cancelarButton: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
});
