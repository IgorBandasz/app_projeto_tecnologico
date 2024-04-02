import React, { ReactElement } from 'react';
import { Image, ListRenderItemInfo, View } from 'react-native';
import { Card, Text, StyleService, useStyleSheet, List, ListProps, CardElement, Button } from '@ui-kitten/components';

import { IPneuImagem } from '../../model/pneu.model';
import ImagemAdd from './imagem.add';
import Loader from '../../components/Loader';
import { formatBytes } from './imagem.util';
import { IImagem } from '../../model/imagem.model';
import { RectButton } from 'react-native-gesture-handler';
import Swippeable from 'react-native-gesture-handler/Swipeable';
import Animated from 'react-native-reanimated';
import { DeleteIcon } from '../../components/icons';

export interface PneuImagemListProps extends Omit<ListProps, 'renderItem'> {
  data: IPneuImagem[];
  onAddPress?: (item: IPneuImagem) => void;
  onEditPress?: (item: IPneuImagem) => void;
  onViewPress?: (item: IPneuImagem) => void;
  onDeletePress?: (item: IPneuImagem) => void;
}

export const PneuImagemList = (props: PneuImagemListProps): ReactElement => {

  const styles = useStyleSheet(themedStyles);
  const { contentContainerStyle, ...listProps } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  let row: Array<any> = [];
  let prevOpenedRow;

  function closeRow(index: number) {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
		  prevOpenedRow.close();
    }
      prevOpenedRow = row[index];
  }

  function clickDelete(index: number, item: IPneuImagem) {    
    prevOpenedRow = row[index];
    prevOpenedRow.close();
    deletePressButton(item)
  }

  async function addPressButton(arquivo: IImagem) {
    setIsLoading(true);

    props.onAddPress({
      Id: 0,
      Caminho: arquivo.Uri,
      Descricao: arquivo.Descricao,
      Usuario: '',
      Base64: '',
      Tamanho: arquivo.Tamanho,
      Ext: arquivo.Ext,
    });

    setIsLoading(false);
  }

  async function viewPressButton(arquivo: IPneuImagem) {
    setIsLoading(true);
    props.onViewPress(arquivo);
    setIsLoading(false);
  }

  async function deletePressButton(produto: IPneuImagem) {
    setIsLoading(true);
    props.onDeletePress(produto);
    setIsLoading(false);
  } 

  function getImageSource(arquivo: IPneuImagem) {
    let asset = require('../../assets/icons/ext_unknown.png');

    if (arquivo.Id === 0)
      asset = { uri: arquivo.Caminho };
    else {
      if (arquivo.Base64) {
        asset = { uri: `data:image/png;base64,${arquivo.Base64}` };
      } else {
        if (arquivo.Ext === '.jpg')
          asset = require('../../assets/icons/ext_jpg.png');
        else if (arquivo.Ext === '.jpeg')
          asset = require('../../assets/icons/ext_jpeg.png');
        else if (arquivo.Ext === '.png')
          asset = require('../../assets/icons/ext_png.png');
        else if (arquivo.Ext === '.png')
          asset = require('../../assets/icons/ext_png.png');
        else if (arquivo.Ext === '.mp4')
          asset = require('../../assets/icons/ext_mp4.png');
      }
    }
    return asset;
  }

  const renderItem = (info: ListRenderItemInfo<IPneuImagem>): CardElement => (
    <Card
      onPress={() => viewPressButton(info.item)}>
      <Swippeable
        ref={ref => row[info.index] = ref}
        onSwipeableOpen={() => closeRow(info.index)}
        overshootRight={false}
        overshootLeft={false}
        renderLeftActions={
          (props.onDeletePress) &&
          (() => (
          <Animated.View>
            <View>
              <RectButton
                style={styles.buttonDelete}
                onPress={() => clickDelete(info.index, info.item)} >
                  <Button
                    accessoryRight={DeleteIcon}
                    style={{borderColor:'transparent', backgroundColor: 'transparent'}} />
              </RectButton>
            </View>
          </Animated.View>
        ))
      }>

        <RectButton
          style={{ flexDirection: 'row', marginVertical: 4, backgroundColor: info.index % 2 === 0 ? '#f2f2f2' : 'white' }}
          key={info.index}>

          <View
            style={{ flexDirection: 'row' }}>

            <Image
              style={styles.image}
              source={getImageSource(info.item)}
            />

            <View style={{ padding: 4 }}>
              <Text category='s1'>
                {info.item.Descricao ? info.item.Descricao : 'Sem descrição'}
              </Text>

              <Text appearance='hint'>
                {info.item.Tamanho && formatBytes(info.item.Tamanho)} {!info.item.Id && '... aguardando envio'}
              </Text>
            </View>

          </View>
        </RectButton>
      </Swippeable>
    </Card >
  )

  return (
    <>
      <Loader
        loading={isLoading} />

      <Text
        style={styles.textLabel}
        appearance='hint'
        category='label' >
        Lista de Imagens
      </Text>

      <Card
        style={[styles.container, !props.onAddPress ? styles.cardDisable : styles.cardInfo]} >
        {
          (props.data && props.data.length > 0)
            ? (
              <List
                {...listProps}
                keyExtractor={(item) => item.Id.toString()}
                contentContainerStyle={[contentContainerStyle]}
                renderItem={renderItem} />
            )
            : (
              <Text>
                Não possui imagens
              </Text>
            )
        }

        {
          props.onAddPress &&
          <ImagemAdd
            onHandleSelect={(arquivo) => addPressButton(arquivo)} />
        }
      </Card>

    </>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'color-basic-200',
    marginHorizontal: 12,
    marginTop: 4,
    padding: 4,
  },
  cardDisable: {
    borderColor: 'color-basic-disabled',
  },
  cardInfo: {
    borderColor: 'color-info-400',
  },
  cardDanger: {
    borderColor: 'color-danger-500',
  },
  textLabel: {
    marginHorizontal: 12,
    marginTop: 8,
  },
  carouselContainer: {
    borderRadius: 12,
    justifyContent: 'center',
  },
  containerButton: {
    marginHorizontal: 12,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginVertical: 8,
    alignSelf: 'center',
  },
  image: {
    height: 48,
    width: 48,
    borderWidth: 1,
    borderColor: 'color-basic-disabled',
    margin: 4,
  },
  buttonDelete: {
    width: 60,
    height: '100%',
    backgroundColor: 'color-danger-400',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  }
});
