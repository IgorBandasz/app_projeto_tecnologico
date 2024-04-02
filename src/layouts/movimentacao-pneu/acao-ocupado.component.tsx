import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Image, View } from 'react-native';
import { Divider, Layout, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';

import { ArrowIosBackIcon } from '../../components/icons';
import { RectButton } from 'react-native-gesture-handler';
import { IPosicaoPneu } from '../../model/posicao.model';
import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { IPermissao } from '../../model/usuario-model';
import { AppStorage } from '../../services/app-storage.service';

interface Params {
  posicaoO: IPosicaoPneu;
  posicaoD: IPosicaoPneu;
  onMudarPosicaoPress: (posD: IPosicaoPneu, posO: IPosicaoPneu) => Promise<void>;
  onTrocarPosicaoPress: (posD: IPosicaoPneu, posO: IPosicaoPneu, voltas: number, onGoBack:()=> Promise<void>) => void;
  voltas: number;
  onGoBack: () => Promise<void>;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [param,] = React.useState(route.params as Params);
  const [permissao, setPermissao] = React.useState<IPermissao>({} as IPermissao);

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const user = await AppStorage.getUsuario();
        setPermissao(user.Permissao)

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        Alert.alert(error);
      }
    }

    handleLoad();
  }, []);

  async function handleTrocarPosicao() {
    if (param?.onTrocarPosicaoPress) {
      param.onTrocarPosicaoPress(param.posicaoD, param.posicaoO, param.voltas, param.onGoBack);
    } 
  }

  async function handleEstoque() {
    var voltas: number;
    param.voltas ? voltas = param.voltas + 1 : voltas = 1;

    navigation.navigate('MovEstoqueAdd', { 
      voltas: voltas,
      pneu: param.posicaoD.Pneu, 
      posicaoO: param.posicaoO,
      posicaoD: param.posicaoD,
      onMudarPosicaoPress: (posD: IPosicaoPneu, posO: IPosicaoPneu) => param.onMudarPosicaoPress(posD, posO), 
      onGoBack: () => param.onGoBack() 
     });
  }

  async function handleRecapagem() {
    var voltas: number;
    param.voltas ? voltas = param.voltas + 1 : voltas = 1;

    navigation.navigate('RecapagemPneuAdd', { 
      voltas: voltas,
      pneu: param.posicaoD.Pneu, 
      posicaoO: param.posicaoO,
      posicaoD: param.posicaoD,
      onMudarPosicaoPress: (posD: IPosicaoPneu, posO: IPosicaoPneu) => param.onMudarPosicaoPress(posD, posO), 
      onGoBack: () => param.onGoBack() 
    });
  }

  async function handleSucata() {
    var voltas: number;
    param.voltas ? voltas = param.voltas + 1 : voltas = 1;

    navigation.navigate('MovSucataAdd', { 
      voltas: voltas,
      pneu: param.posicaoD.Pneu, 
      posicaoO: param.posicaoO,
      posicaoD: param.posicaoD,
      onMudarPosicaoPress: (posD: IPosicaoPneu, posO: IPosicaoPneu) => param.onMudarPosicaoPress(posD, posO), 
      onGoBack: () => param.onGoBack() 
    });
  }

  async function handleVenda() {
    var voltas: number;
    param.voltas ? voltas = param.voltas + 1 : voltas = 1;

    navigation.navigate('MovVendaAdd', { 
      voltas: voltas,
      pneu: param.posicaoD.Pneu, 
      posicaoO: param.posicaoO,
      posicaoD: param.posicaoD,
      onMudarPosicaoPress: (posD: IPosicaoPneu, posO: IPosicaoPneu) => param.onMudarPosicaoPress(posD, posO), 
      onGoBack: () => param.onGoBack() 
    });
  }

  async function handleConserto() {
    var voltas: number;
    param.voltas ? voltas = param.voltas + 1 : voltas = 1;

    navigation.navigate('ConsertoPneuAdd', { 
      voltas: voltas,
      pneu: param.posicaoD.Pneu, 
      posicaoO: param.posicaoO,
      posicaoD: param.posicaoD,
      onMudarPosicaoPress: (posD: IPosicaoPneu, posO: IPosicaoPneu) => param.onMudarPosicaoPress(posD, posO), 
      onGoBack: () => param.onGoBack() 
    });
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

  const renderBackAction = (): React.ReactElement => (
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

  const onViewButtonPress = (): void => {
    navigation.navigate('PneuView', { data: param.posicaoD.Pneu });
  };

  return (
    <>
      <TopNavigation
        title='AÇÕES'
        accessoryLeft={renderBackAction} />

      <Divider />

      <KeyboardAvoidingView>
        <Layout >
          
          <View 
            style={styles.container} >

            <View 
              style={styles.subcontainer} >  
              <RectButton
                onPress={onViewButtonPress}>
                <View
                  style={[styles.card]} >
                  <View>
                    <Image
                        style={styles.imagem_pneu}
                        source={require('../../assets/images/pneu.jpg')}></Image>
                  </View> 

                  <View
                    style={[styles.status, { backgroundColor: corStatus(param.posicaoD.Pneu.Status) }]}></View>

                  <View>
                    <Text style={styles.titulo}>PNEU A SER REMOVIDO</Text>
                    <Text category='s2'>
                      Código: {param.posicaoD.Pneu.Id}
                    </Text>
                    <Text category='s2'>
                      Número de fogo: {param.posicaoD.Pneu.NumeroFogo}
                    </Text>
                    <Text category='s2'>
                      Placa: {param.posicaoD.Pneu.Bem?.Placa}
                    </Text>
                    <Text category='s2'>
                      Frota: {param.posicaoD.Pneu.Bem?.Frota}  Posição: {param.posicaoD.Pneu.Posicao}
                    </Text>
                  </View>  
                </View>
              </RectButton>
            </View>

            <Divider/>

            <View style={styles.container}>
              <Text style={styles.mensagem}>A posição selecionada está ocupada. Escolha a ação para o pneu a ser removido:</Text>
            </View>

            <Divider/>

            <View 
              style={styles.subcontainer} >
              { param.posicaoO.Bem &&
                <RectButton
                  style={permissao?.MovimentacaoPneu ? styles.button : styles.button_disabled}
                  onPress={permissao?.MovimentacaoPneu ? handleTrocarPosicao : ()=>{}}>
                  <>
                    <Image
                      style={styles.imagem}
                      source={require('../../assets/images/acao_mudar.jpg')}
                      ></Image>
                    <Text>Trocar Posição</Text>
                  </>
                </RectButton>
              }

              <RectButton
                style={permissao?.EstoquePneu ? styles.button : styles.button_disabled}
                onPress={permissao?.EstoquePneu ? handleEstoque : ()=>{}}>
                <>
                  <Image
                    style={styles.imagem}
                    source={require('../../assets/images/acao_estoque.jpg')}
                    ></Image>
                  <Text>Estoque</Text>
                </>  
              </RectButton>
            </View>

            <View 
              style={styles.subcontainer} >
              <RectButton
                style={permissao?.RecapagemPneu ? styles.button : styles.button_disabled}
                onPress={permissao?.RecapagemPneu ? handleRecapagem : ()=>{}}>
                <>
                  <Image
                    style={styles.imagem}
                    source={require('../../assets/images/acao_recapagem.jpg')}
                    ></Image>
                  <Text>Recapagem</Text>
                </>
              </RectButton>

              <RectButton
                style={permissao?.SucataPneu ? styles.button : styles.button_disabled}
                onPress={permissao?.SucataPneu ? handleSucata : ()=>{}}>
                  <>
                  <Image
                    style={styles.imagem}
                    source={require('../../assets/images/acao_sucata.jpg')}
                    ></Image>
                  <Text>Sucata</Text>
                </>
              </RectButton>
            </View>

            <View 
              style={styles.subcontainer} >
              <RectButton
                style={permissao?.VendaPneu ? styles.button : styles.button_disabled}
                onPress={permissao?.VendaPneu ? handleVenda : ()=>{}}>
                <>
                  <Image
                    style={styles.imagem}
                    source={require('../../assets/images/acao_venda.jpg')}
                    ></Image>
                  <Text>Venda</Text>
                </>
              </RectButton>

              <RectButton
                style={permissao?.ConsertoPneu ? styles.button : styles.button_disabled}
                onPress={permissao?.ConsertoPneu ? handleConserto : ()=>{}}>
                <>
                  <Image
                    style={styles.imagem}
                    source={require('../../assets/images/acao_conserto.jpg')}
                    ></Image>
                  <Text>Conserto</Text>
                </>
              </RectButton> 
            </View>   
          </View>
        </Layout>
      </KeyboardAvoidingView>
    </>
  );
};

const themedStyles = StyleService.create({
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
  mensagem: {
    color: 'red',
    textAlign: 'center',
    fontSize: 25,
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
  imagem: {
    width: 120,
    height: 120,
    marginVertical: 4,
    marginHorizontal: 4,
    borderRadius: 10,
  },
  card: {
    borderRadius: 10,
    backgroundColor: '#F5F5F5', 
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titulo: {
    fontWeight: 'bold'
  },
  imagem_pneu: {
    width: 37,
    height: 110,
    marginVertical: 4,
    marginRight: 10,
  },
  status: {
    marginRight: 8,
    paddingVertical: 50,
    paddingHorizontal: 6,
  },
});

