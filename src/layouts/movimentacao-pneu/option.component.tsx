import React, { ReactElement, useState } from 'react';
import { Alert, Image, Keyboard, View } from 'react-native';
import { IndexPath, Button, Card, Divider, Icon, Input, Layout, Select, SelectItem, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';

import Loader from '../../components/Loader';
import { AddIcon, ArrowIosBackIcon, MenuIcon } from '../../components/icons';
import { IPneu } from '../../model/pneu.model';
import { IPosicaoPneu, ITrocaPneu } from '../../model/posicao.model';
import { IBem } from '../../model/bem.model';
import PneuService from '../../services/api-pneu-service';
import { RectButton } from 'react-native-gesture-handler';

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function handleFindPneu() {
    navigation.navigate('PneuList', {
      onSelect: (item: IPneu, voltas: number, onGoBack:()=> Promise<void>) => handleSelectPneu({Pneu: item, Bem: item?.Bem, Posicao: item?.Posicao, Eixo: item?.Eixo, Rodado: item?.Rodado } as IPosicaoPneu, voltas, onGoBack)
    })
  }

  async function handleFindBem() {
    navigation.navigate('ChassiList', {
      onSelect: (item: IPosicaoPneu, voltas: number, onGoBack:()=> Promise<void>) => handleSelectPneu(item, voltas, onGoBack)
    })
  }
  
  async function handleSelectPneu(pos: IPosicaoPneu, voltas: number, onGoBack:()=> Promise<void>) {
    if(pos.Pneu.Disponibilidade != 1 && pos.Pneu.Disponibilidade != 0){
      Alert.alert('Aviso', 'Não é possivel selecionar um pneu que não esteja no estoque ou em um bem.')
      return
    }

    navigation.navigate('MovimentacaoPneuAcao', { 
      posicao: pos,
      onMudarPosicaoPress: (posicao: IPosicaoPneu, voltas: number) => {handleFindBemMudar(posicao, voltas, onGoBack)},
      voltas: voltas,
      onGoBack: () => onGoBack()
    });
  }
  
  //------------------------------------------------------------------------

  async function handleFindBemMudar(pos: IPosicaoPneu, voltas: number, onGoBack:()=> Promise<void>) {
    navigation.navigate('ChassiDestinoList', {
      posicao: pos,
      onSelect: (posD: IPosicaoPneu, posO: IPosicaoPneu, voltas: number, onGoBack:()=> Promise<void>) => handleVerificaPosicao(posD, posO, voltas, onGoBack),
      voltas: voltas,
      onGoBack: () => onGoBack()
    })
  }

  async function handleVerificaPosicao(posD: IPosicaoPneu, posO: IPosicaoPneu, voltas: number, onGoBack: ()=> Promise<void>) {
    if(posD.Pneu !== null){
      if(posO.Bem){
        Alert.alert('Trocar Posição', 'Deseja trocar a posição com o pneu selecionado?', 
          [{text:'Sim',onPress: ()=>{handleTrocarPosicao(posD, posO, voltas, onGoBack)}}, 
          {text:'Não',onPress: ()=>{handleAcaoOcupado(posD, posO, voltas, onGoBack)}}]);
      }
    }else {
      handleMudarPosicao(posD, posO, voltas, onGoBack);
    }
  }

  async function handleAcaoOcupado(posD: IPosicaoPneu, posO: IPosicaoPneu, voltas: number, onGoBack: ()=> Promise<void>) {
    voltas = voltas + 1;

    navigation.navigate('MovimentacaoPneuAcaoOcupado', { 
      posicaoO: posO,
      posicaoD: posD,
      onMudarPosicaoPress: (posD: IPosicaoPneu, posO: IPosicaoPneu) => handleMudarPosicao(posD, posO),
      onTrocarPosicaoPress: (posD: IPosicaoPneu, posO: IPosicaoPneu, voltas: number, onGoBack:()=> Promise<void>) => handleTrocarPosicao(posD, posO, voltas, onGoBack),
      voltas: voltas,
      onGoBack: () => onGoBack()
    }); 
  }

  async function handleMudarPosicao(posD: IPosicaoPneu, posO: IPosicaoPneu, voltas?: number, onGoBack?: ()=> Promise<void>) {
    if(isLoading == false){
      setIsLoading(true);

      posD.Pneu = posO.Pneu
      const date = new Date();
      date.setHours(date.getHours() - 3);
      posD.DataInstalacao = date
      posD.HoraInstalacao = date
      
      try {
        const service = new PneuService();
        const result = await service.movimentarPneu(posD);
        
        if (result.status === 200) {
          if(onGoBack){
            await onGoBack();
            Alert.alert('Sucesso', `Pneu movimentado com sucesso. Id: ${result.data.Id}`, [
              { text: 'Ok', onPress: () => { navigation.pop(voltas) }, }],
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
  }

  async function handleTrocarPosicao(posD: IPosicaoPneu, posO: IPosicaoPneu, voltas: number, onGoBack: ()=> Promise<void>) {
    if(isLoading == false){
      setIsLoading(true);

      const date = new Date();
      date.setHours(date.getHours() - 3);
      posD.DataInstalacao = date
      posD.HoraInstalacao = date
      posO.DataInstalacao = date
      posO.HoraInstalacao = date
      
      const troca = {PosicaoOrigem: posO, PosicaoDestino: posD} as ITrocaPneu
      try {
        const service = new PneuService();
        const result = await service.trocarPneu(troca);
        
        if (result.status === 200) {
          await onGoBack();
          Alert.alert('Sucesso', `Pneus trocados com sucesso.`, [
            { text: 'Ok', onPress: () => { navigation.pop(voltas) }, }],
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
  }

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={navigation.toggleDrawer} />
  );

  return (
    <>
      <TopNavigation
        title='MOVIMENTAÇÃO DE PNEU'
        accessoryLeft={renderBackAction} />

      <Divider />

      <Layout 
        style={styles.container}>
        <View 
          style={styles.subcontainer} >
          <Card
            style={styles.button}
            onPress={handleFindPneu}>
            <RectButton>
              <>
                <Image
                  style={styles.imagem}
                  source={require('../../assets/images/acao_pneu.jpg')}></Image>
                <Text style={{textAlign: 'center'}}>Buscar pelo Pneu</Text>
              </>
            </RectButton>
          </Card>  

          <Card
            style={styles.button}
            onPress={handleFindBem}>
            <RectButton>
              <>
                <Image
                  style={styles.imagem}
                  source={require('../../assets/images/chassi.jpg')}></Image>
                <Text style={{textAlign: 'center'}}>Buscar pelo Bem</Text>
              </>  
            </RectButton>
          </Card>
        </View>

      </Layout>

    </>
  );
};

const themedStyles = StyleService.create({
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 8,
  },

  button: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginHorizontal: 16,
    marginTop: 12,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'color-success-400',
    border: 'none'
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

