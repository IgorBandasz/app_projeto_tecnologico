import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Image, Keyboard, View } from 'react-native';
import { IndexPath, Button, Card, Divider, Icon, Input, Layout, Select, SelectItem, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';

import Loader from '../../components/Loader';
import { AddIcon, ArrowIosBackIcon, MenuIcon } from '../../components/icons';
import { IPneu } from '../../model/pneu.model';
import { IPosicaoPneu } from '../../model/posicao.model';
import { RectButton } from 'react-native-gesture-handler';
import { IPermissao } from '../../model/usuario-model';
import { AppStorage } from '../../services/app-storage.service';

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [permissao, setPermissao] = React.useState<IPermissao>({} as IPermissao);

  useEffect(() => {
    async function handleLoad() {
      try {
        
        const user = await AppStorage.getUsuario();
        setPermissao(user.Permissao)

      } catch (error) {
        console.error(error);
        Alert.alert(error);
      }
    }

    handleLoad();
  }, []);

  async function handleFindPneu() {
    navigation.navigate('PneuList', {
      onSelect: (item: IPneu, voltas: number) => handleSelectPneu(item, voltas, async() => {}),
      afericao: true
    })
  }

  async function handleFindBem() {
    navigation.navigate('ChassiList', {
      onSelect: (item: IPosicaoPneu, voltas: number, onGoBack:()=> Promise<void>) => handleSelectPneu(item?.Pneu, voltas, onGoBack),
      afericao: true
    })
  }

  async function handleSelectPneu(pneu: IPneu, voltas: number, onGoBack:()=> Promise<void>) {
    if(pneu?.AferiuHoje == true){
      Alert.alert('Aviso', 'O pneu selecionado já foi aferido hoje.');
    }else{
      navigation.navigate('AfericaoAdd', { 
        pneu: pneu,
        voltas: voltas,
        onGoBack: () => onGoBack() 
      });
    }
  }

  async function handleList() {
    navigation.navigate('AfericaoList')
  }

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={navigation.toggleDrawer} />
  );

  return (
    <>
      <TopNavigation
        title='AFERIÇÃO'
        accessoryLeft={renderBackAction} />
        

      <Divider />

      <Layout 
        style={styles.container}>
        <View 
          style={styles.subcontainer} >
          <Card
            style={permissao?.AfericaoPneu ? styles.button : styles.button_disabled}
            onPress={permissao?.AfericaoPneu ? handleFindPneu : ()=>{}}>
            <RectButton>
              <>
                <Image
                  style={styles.imagem}
                  source={require('../../assets/images/acao_pneu.jpg')}
                  ></Image>
                <Text style={{textAlign: 'center'}}>Buscar pelo Pneu</Text>
              </>
            </RectButton>
          </Card>  

          <Card
            style={permissao?.AfericaoPneu ? styles.button : styles.button_disabled}
            onPress={permissao?.AfericaoPneu ? handleFindBem : ()=>{}}>
            <RectButton>
              <>
                <Image
                  style={styles.imagem}
                  source={require('../../assets/images/chassi.jpg')}
                  ></Image>
                <Text style={{textAlign: 'center'}}>Buscar pelo Bem</Text>
              </>  
            </RectButton>
          </Card>
        </View>
        </Layout>
        
        <View 
          style={styles.itemContainer} >

        <Button
          style={styles.button_last}
          size='medium'
          status='success'
          onPress={handleList}>
          Listar Aferições
        </Button>

            
        </View>
      
    </>
  );
};

const themedStyles = StyleService.create({
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  select: {
    marginTop: 8,
    marginBottom: 8,
  },  
  footer: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
  button: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginHorizontal: 16,
    marginTop: 12,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'color-success-400'
  },
  button_disabled: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginHorizontal: 16,
    marginTop: 12,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    opacity: 0.2
  },
  button_last: {
    marginHorizontal: 12,
    marginVertical: 12,
  },
  container: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    position: 'relative',
    alignItems: 'center',

  },
  subcontainer: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imagem: {
    width: 120,
    height: 120,
    marginVertical: 4,
    marginHorizontal: 4,
    borderRadius: 10,
  },
});

