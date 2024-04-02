import React, { ReactElement } from 'react';
import { Dimensions, Image } from 'react-native';
import { Card, Text, Layout, StyleService, useStyleSheet } from '@ui-kitten/components';
import Carousel, { Pagination } from 'react-native-snap-carousel'

import AddImagem from './imagem.add';
import Loader from '../../components/Loader';
import { IImagem } from '../../model/imagem.model';
import { IPneuImagem } from '../../model/pneu.model';

export interface PneuImagemGaleryProps {
  data: IPneuImagem[];
  onAddPress?: (item: IPneuImagem) => void;
}

export const PneuImagemGalery = (props: PneuImagemGaleryProps): ReactElement => {

  const styles = useStyleSheet(themedStyles);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [index, setIndex] = React.useState(0)
  const refCarousel = React.useRef(null)
  const SLIDER_WIDTH = Dimensions.get('window').width - 50;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);

  async function addMidia(imagem: IImagem) {
    setIsLoading(true);

    props.onAddPress({
      Id: 0, 
      Caminho: imagem.Uri,
      Descricao: imagem.Descricao,
      Usuario: '',
      Base64: '',
    });

    setIsLoading(false);
  }

  const renderItem = ({ item }) => {
    return (
      <>
        <Layout
          style={styles.carouselContainer} >

          {
            (item.Base64 || item.Caminho)
              ? (
                <Image
                  style={styles.image}
                  source={{ uri: (item.Caminho !== '') ? item.Caminho : `data:image/png;base64,${item.Base64}` }} />
              )
              : (
                <Image
                  style={styles.image}
                  source={require('../../assets/images/image-no-image.png')} />
              )
          }
          <Text
            style={styles.description}>
            {item.Descricao}
          </Text>

        </Layout>
      </>
    )
  }

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
              <>
                <Carousel
                  layout='tinder'
                  layoutCardOffset={5}
                  ref={refCarousel}
                  data={props.data}
                  renderItem={renderItem}
                  sliderWidth={SLIDER_WIDTH}
                  itemWidth={ITEM_WIDTH}
                  inactiveSlideShift={0}
                  useScrollView={true}
                  onSnapToItem={(index) => setIndex(index)} />
                <Pagination
                  dotsLength={props.data?.length}
                  activeDotIndex={index}
                  //carouselRef={refCarousel}
                  dotStyle={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    marginHorizontal: 0,
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  tappableDots={true} />
              </>
            )
            : (
              <Text>
                Não possui imagens
              </Text>
            )
        }

        {
          props.onAddPress &&
          <AddImagem
            onHandleSelect={(imagem) => addMidia(imagem)} />
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
    padding: 8,
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
    marginHorizontal: 8,
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
    width: '90%',
    resizeMode: 'contain',
    alignSelf: 'center',
    height: 300,
  },
});
