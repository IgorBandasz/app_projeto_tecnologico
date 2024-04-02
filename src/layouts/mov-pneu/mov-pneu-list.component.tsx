import React from 'react';
import { Animated, Image, ImageSourcePropType, ListRenderItemInfo, View } from 'react-native';
import { Button, Card, CardElement, Layout, List, ListElement, ListProps, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { RectButton } from 'react-native-gesture-handler';

import { IMovimentacaoPneu } from '../../model/movimentacao-pneu.model';
import { formatDate } from '../../utils/date';
import { formatTime } from '../../utils/time';

export interface MovPneuListProps extends Omit<ListProps, 'renderItem'> {
  data: IMovimentacaoPneu[];
  //onViewPress: (item: IPneu) => void;
  //onHandleFindMore: (distance: number) => void;
}

export type LayoutListElement = React.ReactElement<MovPneuListProps>;

export const MovPneuList = (props: MovPneuListProps): ListElement => {

  const styles = useStyleSheet(themedStyles);
  const { contentContainerStyle, ...listProps } = props;

  function tipoMov(tipomov: number): string {
    switch(tipomov){
      case 0: return 'Alocado'
      case 1: return 'Estoque'
      case 2: return 'Sucata'
      case 3: return 'Recapagem'
      case 4: return 'Venda'
      case 5: return 'Conserto'
    }
  }

  function imagemDisponibilidade(disponibilidade: number): ImageSourcePropType {
    switch(disponibilidade){
      case 0: return require('../../assets/images/icone_mudar.png')
      case 1: return require('../../assets/images/icone_estoque.png')
      case 2: return require('../../assets/images/icone_sucata.png')
      case 3: return require('../../assets/images/icone_recapagem.png')
      case 4: return require('../../assets/images/icone_venda.png')
      case 5: return require('../../assets/images/icone_conserto.png')
    }
  }

  const renderItem = (info: ListRenderItemInfo<IMovimentacaoPneu>): CardElement => (
    
    <Card 
      //onPress={() => onViewPress(info.item)}
      style={[styles.itemContainer]} >
        <RectButton
          style={[styles.container]}  >

          <View
            style={styles.card}>
            <View
              style={styles.button}>
              <View>
                <Image
                  style={styles.pneu}
                  source={imagemDisponibilidade(info.item.TipoMov)}></Image>
              </View>  
              
              <View
                style={{flexBasis:'auto', flexGrow:1}}>
                <Layout style={styles.rowContainer}>
                  <Text category='s2' style={{flex:1}}>
                    Tipo Mov.: {tipoMov(info.item.TipoMov)}
                  </Text>
                  <Text category='s2' style={{flex:1}}>
                    Código: {info.item.Id}
                  </Text>
                </Layout>

                <Layout style={styles.rowContainer}>
                  <Text category='s2' >
                    Data: {info.item.Data && `${formatDate(info.item.Data)}`} 
                  </Text>
                  <Text category='s2'>
                    Hora: {info.item.Hora && `${formatTime(info.item.Hora)}`}
                  </Text>
                  <Text category='s2' >
                    Sulco Atual: {info.item.SulcoAtual}
                  </Text>
                </Layout>
                
                <Layout style={styles.rowContainer}>
                  <Text category='s2' style={{flex:1}} >
                    Frota: {info.item.Pneu?.Bem?.Frota}
                  </Text>
                  <Text category='s2' style={{flex:1}}>
                    Placa: {info.item.Pneu?.Bem?.Placa}
                  </Text>
                </Layout>
                
                <Layout style={styles.rowContainer}>
                  <Text category='s2' >
                    Bem: {info.item.Pneu?.Bem?.Descricao}
                  </Text>
                </Layout>
              </View>
            </View>

          </View>
        </RectButton>
    </Card>
  );

  return (
    <List
      {...listProps}
      keyExtractor={(item) => item.Id.toString()}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      renderItem={renderItem}
      //onEndReachedThreshold={0.1}
      //onEndReached={({ distanceFromEnd }) => props.onHandleFindMore(distanceFromEnd)}
    />
  );
};

const themedStyles = StyleService.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  itemContainer: {
    marginVertical: 4,
    marginHorizontal: 4,
  },
  buttonEdit: {
    width: 90,
    height: '100%',
    backgroundColor: 'color-warning-400',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  
  pneu: {
    width: 44,
    height: 44,
    marginRight: 4,
  },
  status: {
    textAlign: 'center',
    fontSize: 45,
    marginHorizontal: 4,
    width: 60,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
