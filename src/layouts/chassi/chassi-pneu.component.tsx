import React, { ReactElement } from 'react';
import { ImageBackground, ListRenderItemInfo, View } from 'react-native';
import { Button, Card, CardElement, Icon, List, ListElement, ListProps, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { RectButton } from 'react-native-gesture-handler';

import { IPosicaoPneu } from '../../model/posicao.model';
import { Image } from 'react-native';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import { IPneu } from '../../model/pneu.model';

export interface ChassiPneuProps extends Omit<ListProps, 'renderItem'> {
  destino: boolean;
  posicaoEixo: number;
  data: IPosicaoPneu[];
  onHandleSelect: (item:  IPosicaoPneu) => void;
  onHandleSelectVazio: (item:  IPosicaoPneu) => void;
  pneuSelecionado?: IPneu;
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

function corFonte(status: number): string {
  switch(status){
    case 0: return 'white'
    case 1: return 'white'
    case 2: return 'black'
    case 3: return 'white'
    case 4: return 'white'
    case 5: return 'white'
  }
}

export type LayoutListElement = React.ReactElement<ChassiPneuProps>;

export const ChassiPneu = (props: ChassiPneuProps): ListElement => {
  const styles = useStyleSheet(themedStyles);
  const { contentContainerStyle, onHandleSelect, onHandleSelectVazio, ...listProps } = props;

  const renderIconFilter = (props): ReactElement => (
  
    <Icon 
      {...props} 
      name='alert-triangle-outline' 
      animationConfig={{ cycles: Infinity }}
      animation='zoom'/>
  );

  const renderItem = (info: ListRenderItemInfo<IPosicaoPneu>): CardElement => (
    
    <RectButton
      onPress={
        props.destino === true ?
          info.item.Posicao !== '' && info.item.Posicao !== 'EIXO' && info.item.Posicao !== 'EIXO_VAZIO' && (() => onHandleSelect(info.item))
        :
          info.item.Pneu !== null ? 
            (() => onHandleSelect(info.item))
          : 
            info.item.Posicao !== 'EIXO' && info.item.Posicao !== 'EIXO_VAZIO' &&
            (() => onHandleSelectVazio(info.item))}
      style={[styles.itemContainer]}  >
      <View>
        { 
          props.posicaoEixo !== 4 ?
            info.item.Pneu !== null && info.item.Pneu?.AferiuHoje == true ?
              <ImageBackground
                style={styles.imagem}
                source={require('../../assets/images/pneu-aferido.jpg')}>
                <View style={{flex: 1, justifyContent:'space-between'}}>
                  <View style={{backgroundColor: corStatus(info.item.Pneu?.Status)}}>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Posicao}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.NumeroFogo}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.SulcoAtual}</Text>
                  </View>

                  {
                    info.item.Pneu?.SulcoAtual <= info.item.Pneu?.SulcoMin && 
                    <Button
                      style={{height:'8%'}}
                      status='warning'
                      size='small'
                      accessoryRight={renderIconFilter} />
                  }
                </View>  
              </ImageBackground>
            :
            info.item.Pneu !== null && info.item.Pneu?.NumeroFogo == props?.pneuSelecionado?.NumeroFogo ?
              <ImageBackground
                style={styles.imagem}
                source={require('../../assets/images/pneu-selecionado.jpg')}>
                <View style={{flex: 1, justifyContent:'space-between'}}>
                  <View style={{backgroundColor: corStatus(info.item.Pneu?.Status)}}>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Posicao}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.NumeroFogo}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.SulcoAtual}</Text>
                  </View>

                  {
                    info.item.Pneu?.SulcoAtual <= info.item.Pneu?.SulcoMin && 
                    <Button
                      style={{height:'8%'}}
                      status='warning'
                      size='small'
                      accessoryRight={renderIconFilter} />
                  }
                </View>  
              </ImageBackground>
            :
            info.item.Pneu !== null ?
              <ImageBackground
                style={styles.imagem}
                source={require('../../assets/images/pneu.jpg')}>
                <View style={{flex: 1, justifyContent:'space-between'}}>
                  <View style={{backgroundColor: corStatus(info.item.Pneu?.Status)}}>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Posicao}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.NumeroFogo}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.SulcoAtual}</Text>
                  </View>

                  {
                    info.item.Pneu?.SulcoAtual <= info.item.Pneu?.SulcoMin && 
                    <Button
                      style={{height:'8%'}}
                      status='warning'
                      size='small'
                      accessoryRight={renderIconFilter} />
                  }
                </View>
              </ImageBackground>
            :
              info.item.Posicao === 'EIXO' && info.item.Tracao == false ?
                props.posicaoEixo === 1 ?
                  <ImageBackground
                    style={styles.eixo}
                    source={require('../../assets/images/frente_eixo.png')}>
                      <View
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom:9}}>
                        <Text style={styles.nomeEixo}>{info.item.Eixo}</Text>
                      </View>
                  </ImageBackground>
                :
                  props.posicaoEixo === 2 ?
                    <ImageBackground
                      style={styles.eixo}
                      source={require('../../assets/images/eixo.png')}>
                        <View
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom:9}}>
                        <Text style={styles.nomeEixo}>{info.item.Eixo}</Text>
                      </View>
                      </ImageBackground>  
                  :
                    <ImageBackground
                      style={styles.eixo}
                      source={require('../../assets/images/fim_eixo.png')}>
                        <View
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom:9}}>
                        <Text style={styles.nomeEixo}>{info.item.Eixo}</Text>
                      </View>
                      </ImageBackground> 
              :
                info.item.Posicao === 'EIXO' && info.item.Tracao ?
                  props.posicaoEixo === 1 ?
                    <ImageBackground
                      style={styles.eixo}
                      source={require('../../assets/images/frente_eixo_tracao.png')}>
                        <View
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom:9}}>
                        <Text style={styles.nomeEixo}>{info.item.Eixo}</Text>
                      </View>
                      </ImageBackground>
                  :
                    props.posicaoEixo === 2 ?
                      <ImageBackground
                        style={styles.eixo}
                        source={require('../../assets/images/eixo_tracao.png')}>
                          <View
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom:9}}>
                        <Text style={styles.nomeEixo}>{info.item.Eixo}</Text>
                      </View>
                        </ImageBackground>  
                    :
                      <ImageBackground
                        style={styles.eixo}
                        source={require('../../assets/images/fim_eixo_tracao.png')}>
                          <View
                        style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom:9}}>
                        <Text style={styles.nomeEixo}>{info.item.Eixo}</Text>
                      </View>
                        </ImageBackground> 
                :
                  info.item.Posicao === 'EIXO_VAZIO' ?
                    <Image
                      style={styles.eixo}
                      source={require('../../assets/images/eixo_vazio.png')}></Image>
                  :
                    info.item.Posicao !== '' &&
                      <Image
                        style={styles.imagem}
                        source={require('../../assets/images/pneu-vazio.jpg')}></Image>
          :
            info.item.Pneu !== null && info.item.Pneu?.AferiuHoje == true ?
              <ImageBackground
                style={styles.imagem_step}
                source={require('../../assets/images/step-aferido.jpg')}>
                <View style={{flex: 1, justifyContent:'space-between', flexDirection: 'row'}}>
                  <View style={{width: 40, height:'90%', backgroundColor: corStatus(info.item.Pneu?.Status)}}>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Posicao}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.NumeroFogo}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.SulcoAtual}</Text>
                  </View>
                  {
                    info.item.Pneu?.SulcoAtual <= info.item.Pneu?.SulcoMin && 
                    <Button
                      style={{height:'8%', width:'10%'}}
                      status='warning'
                      size='small'
                      accessoryRight={renderIconFilter} />
                  }
                </View>
              </ImageBackground>
            :
            info.item.Pneu !== null && info.item.Pneu?.NumeroFogo == props?.pneuSelecionado?.NumeroFogo ?
              <ImageBackground
                style={styles.imagem_step}
                source={require('../../assets/images/step-selecionado.jpg')}>
                <View style={{flex: 1, justifyContent:'space-between', flexDirection: 'row'}}>
                  <View style={{width: 40, height:'90%', backgroundColor: corStatus(info.item.Pneu?.Status)}}>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Posicao}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.NumeroFogo}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.SulcoAtual}</Text>
                  </View>
                  {
                    info.item.Pneu?.SulcoAtual <= info.item.Pneu?.SulcoMin && 
                    <Button
                      style={{height:'8%', width:'10%'}}
                      status='warning'
                      size='small'
                      accessoryRight={renderIconFilter} />
                  }
                </View> 
              </ImageBackground>
            :  
            info.item.Pneu !== null ?
              <ImageBackground
                style={styles.imagem_step}
                source={require('../../assets/images/step.jpg')}>
                <View style={{flex: 1, justifyContent:'space-between', flexDirection: 'row'}}>
                  <View style={{width: 40, height:'90%', backgroundColor: corStatus(info.item.Pneu?.Status)}}>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Posicao}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.NumeroFogo}</Text>
                    <Text style={[styles.numeroFogo, {color: corFonte(info.item.Pneu?.Status)}]}>{info.item.Pneu?.SulcoAtual}</Text>
                  </View>
                  {
                    info.item.Pneu?.SulcoAtual <= info.item.Pneu?.SulcoMin && 
                    <Button
                      style={{height:'8%', width:'10%'}}
                      status='warning'
                      size='small'
                      accessoryRight={renderIconFilter} />
                  }
                </View>
              </ImageBackground>
            :  
              info.item.Posicao !== '' &&
                <Image
                  style={styles.imagem_step}
                  source={require('../../assets/images/step-vazio.jpg')}></Image>   
        }     
      </View>
    </RectButton>
   
  );

  return (
    <List
      {...listProps}
      keyExtractor={(item) => item.Pneu?.Id.toString()}
      contentContainerStyle={[contentContainerStyle]} 
      renderItem={renderItem}
      numColumns={7}
      onEndReachedThreshold={0.1}
    />
  );
};

const themedStyles = StyleService.create({
  itemContainer: {
    marginHorizontal: 2,
  },
  view: {
    overlayColor: "transparent",
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  imagem: {
    width: 37,
    height: 110,
    marginVertical: 4,
  },
  imagem_step: {
    width: 110,
    height: 37,
    marginVertical: 4,
  },
  eixo: {
    width: 125,
    height: 120,
  },
  numeroFogo: {
    fontSize: 8,
    color: 'white'
  },
  nomeEixo:{
    textAlign: 'center', 
    fontSize: 15, 
    backgroundColor:'white', 
    borderRadius: 5, 
    paddingHorizontal: 6, 
    paddingTop: 3,
    borderWidth: 3
  }
});
