import React, { useEffect, useRef } from 'react';
import { Alert, Image, View } from 'react-native';
import { StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { Button, Divider, Input } from '@ui-kitten/components';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';

import Loader from '../../components/Loader';
import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { ArrowIosBackIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { formatBytes } from './imagem.util';
import { IPneuImagem } from '../../model/pneu.model';
import PneuService from '../../services/api-pneu-service';

interface Params {
  idPneu: number;
  data: IPneuImagem;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<IPneuImagem>({} as IPneuImagem);
  const [progress, setProgress] = React.useState<number>();
  const [param,] = React.useState(route.params as Params);
  const video = useRef(null);

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={handleCancel} />
  );

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        if (param.data?.Id === 0) {
          setModel(param.data);
        } else {
          const service = new PneuService(setProgress);
          const result = await service.getImagem(param.idPneu, param.data.Id);
          
          if (result.status === 200){
            setModel(result.data.Data);
            await downloadToFile(result.data.Data.Base64, result.data.Data.Id);
          } else {
            Alert.alert('Aviso', result.data.Message)
          }
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

  const handleCancel = (): void => {
    if(isLoading == false){
      setIsLoading(true);
      navigation && navigation.goBack();
      setIsLoading(false);
    }
  };

  const downloadToFile = async (base64Content: string, idContent: number) => {
    const path = `file://${RNFS.DocumentDirectoryPath}/${idContent}.mp4`
    await RNFS.writeFile(path, base64Content, 'base64');
  }

  function renderFileUri() {
    if (model.Base64! === '' && model.Caminho! === '') {
      return (
        <Image
          style={styles.image}
          source={require('../../assets/images/image-no-image.png')} />
      )
    } else {
      if (model.Ext === '.mp4') {
        return (
          <Video
            style={styles.image}
            source={{ uri: model.Id === 0 ? model.Caminho : `file://${RNFS.DocumentDirectoryPath}/${model.Id}.mp4` }}
            ref={video}
            repeat={true}
          />
        )
      } else {
        return (
          <Image
            style={styles.image}
            resizeMode='center'
            source={{ uri: model.Id === 0 ? model.Caminho : `data:image/png;base64,${model.Base64}` }} />
        )
      }
    }
  }

  return (
    <>
      <TopNavigation
        title='VISUALIZAR IMAGEM'
        accessoryLeft={renderDrawerAction} />

      <Divider />

      <Loader
        loading={isLoading}
        progress={progress} />

      <KeyboardAvoidingView >
        <SafeAreaLayout
          style={styles.form}
          level='1'>

          <View
            style={styles.imageContainer} >
            {renderFileUri()}
          </View>
          
          {
            model.Id !== 0 &&
            <Input
              style={styles.input}
              disabled={true}
              label='Código da imagem'
              value={`${model.Id}`} />
          }

          <Input
            style={styles.input}
            disabled={true}
            multiline={true}
            numberOfLines={5}
            textAlignVertical='top'
            label='Descrição da imagem'
            value={model.Descricao} />

          <Input
            style={styles.input}
            disabled={true}
            label='Extensão da imagem'
            value={model.Ext} />

          <Input
            style={styles.input}
            disabled={true}
            label='Tamanho'
            value={`${formatBytes(model.Tamanho)}`} />

          <Text />

          <Divider />

          <Button
            style={styles.button}
            size='medium'
            status='danger'
            onPress={handleCancel}>
            Cancelar
          </Button>

        </SafeAreaLayout>
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
  imageContainer: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'color-info-400',
  },
  image: {
    height: 300,
    width: '100%',
  },
  input: {
    marginHorizontal: 12,
    marginTop: 8,
  },
  button: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
});
