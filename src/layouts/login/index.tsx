import React, { ReactElement, useEffect } from 'react';
import { View, TouchableWithoutFeedback, Alert } from 'react-native';
import { Button, Input, Text, Icon, CheckBox, useStyleSheet, StyleService } from '@ui-kitten/components';
import { useFormik } from 'formik';

import { ImageOverlay } from '../../components/image-overlay.component';
import Loader from '../../components/Loader';
import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { UserIcon } from '../../components/icons';
import { ILogin } from '../../model/login-model';
import { loginSchema } from './schemas';
import { AppStorage } from '../../services/app-storage.service';
import UsuarioService from '../../services/api-usuario-service';
import { AppInfoService } from '../../services/app-info.service';

export default ({ navigation }): React.ReactElement => {

  const styles = useStyleSheet(themedStyles);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [senhaVisible, setSenhaVisible] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<ILogin>({} as ILogin);

  const onConfiguracaoPress = (): void => {
    navigation && navigation.navigate('Configuracao');
  };

  const onPasswordIconPress = (): void => {
    setSenhaVisible(!senhaVisible);
  };

  const renderIconPassword = (props): ReactElement => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name='lock' />
    </TouchableWithoutFeedback>
  );

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const value = await AppStorage.getLogin();
        if (value && value.lembrar)
          setModel(value);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        Alert.alert(error);
      }
    }

    handleLoad();
  }, []);

  const handleLogin = async (values: ILogin): Promise<void> => {
    setIsLoading(true);

    try {
      const service = new UsuarioService();
      const result = await service.login(values.login, values.senha);
      console.log(result)
      if (result.status === 200) {
        if(result.data.PermitirMobile){
          AppStorage.setLogin({
            login: values.login,
            senha: '',
            token: result.data.Token,
            lembrar: values.lembrar,
          });
    
          AppStorage.setUsuario({
            Id: result.data.Id,
            Nome: result.data.Nome,
            Permissao: result.data.Permissao
          });

          AppStorage.setConfiguracaoGeral(result.data.ConfiguracaoGeral);
    
          setIsLoading(false);
          navigation.navigate('FilialList');
        }else{
          Alert.alert('Aviso','O usuário não tem permissão de usar o mobile');
          setIsLoading(false);
        }
      }else if (result.status === 204){
        Alert.alert('Usuário ou senha inválida');
          setIsLoading(false);
      }else{
        Alert.alert(result.data?.Data?.Message ? result.data?.Data.Message : 'Ocorreu um erro ao tentar acessar as informações');
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Alert.alert(error);
    }
  };

  const formik = useFormik({
    initialValues: model,
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: values => { handleLogin(values) },
  });

  const submitForm = () => formik.handleSubmit();

  return (
    <KeyboardAvoidingView>

      <ImageOverlay
        style={styles.container}
        source={require('../../assets/images/login-image-background.png')}>

        <Loader
          loading={isLoading} />

        <View
          style={styles.loginContainer}>

          <Text
            status='control'
            category='h6'>
            ANEXOTECNOLOGIA.com.br
          </Text>

          <Text
            status='control'
            category='h4'>
            PNEU
          </Text>

        </View>

        <View
          style={styles.formContainer}>

          <Input
            label='LOGIN DO USUÁRIO'
            placeholder='Informe o Login'
            value={formik.values.login}
            status={formik.errors['login'] ? 'danger' : 'control'}
            caption={formik.errors['login']}
            onChangeText={text => formik.setFieldValue('login', text)}
            accessoryRight={UserIcon} />

          <Input
            style={styles.senhaInput}
            secureTextEntry={!senhaVisible}
            label='SENHA DO USUÁRIO'
            placeholder='Informe a Senha'
            value={formik.values.senha}
            status={formik.errors['senha'] ? 'danger' : 'control'}
            caption={formik.errors['senha']}
            onChangeText={text => formik.setFieldValue('senha', text)}
            accessoryRight={renderIconPassword} />

          <CheckBox
            style={styles.senhaInput}
            status='control'
            checked={formik.values.lembrar}
            onChange={nextChecked => formik.setFieldValue('lembrar', nextChecked)} >
            Lembrar minhas credenciais
          </CheckBox>

        </View>

        <Button
          style={styles.button}
          status='control'
          size='medium'
          onPress={submitForm}>
          LOGIN
        </Button>

        <Button
          style={styles.button}
          appearance='ghost'
          status='control'
          onPress={onConfiguracaoPress}>
          Configuração
        </Button>

        <Text
          style={styles.versionLabel}
          appearance='hint'
          category='s2'>
          {`versão ${AppInfoService.getVersion()}`}
        </Text>

      </ImageOverlay>

    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  loginContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 24,
  },
  formContainer: {
    flex: 1,
    marginTop: 48,
  },
  senhaInput: {
    marginTop: 16,
  },
  button: {
    marginTop: 4,
  },
  versionLabel: {
    alignSelf: 'center',
  },
});