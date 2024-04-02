import React from 'react';
import { Animated, Image, ImageSourcePropType, ListRenderItemInfo, View } from 'react-native';
import { Button, Card, CardElement, List, ListElement, ListProps, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { RectButton } from 'react-native-gesture-handler';
import Swippeable from 'react-native-gesture-handler/Swipeable';

import { IPneu } from '../../model/pneu.model';
import { DeleteIcon, EditIcon } from '../../components/icons';

export interface PneuListProps extends Omit<ListProps, 'renderItem'> {
  data: IPneu[];
  onEditPress: (item: IPneu) => void;
  onViewPress: (item: IPneu) => void;
  onDeletePress: (item: IPneu) => void;
  onHandleFindMore: (distance: number) => void;
}

export type LayoutListElement = React.ReactElement<PneuListProps>;

export const PneuList = (props: PneuListProps): ListElement => {

  const styles = useStyleSheet(themedStyles);
  const { contentContainerStyle, onEditPress, onViewPress, ...listProps } = props;

  let row: Array<any> = [];
  let prevOpenedRow;

  function closeRow(index: number) {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
		  prevOpenedRow.close();
    }
      prevOpenedRow = row[index];
  }
 
  function clickEdit(index: number, item: IPneu) {
    prevOpenedRow = row[index];
    prevOpenedRow.close();
    onEditPress(item)
  }

  function clickDelete(index: number, item: IPneu) {    
    prevOpenedRow = row[index];
    prevOpenedRow.close();
    props.onDeletePress(item);
  }

  function getStatus(status: number): string {
    switch(status){
      case 0: return 'N'
      case 1: return 'R1'
      case 2: return 'R2'
      case 3: return 'R3'
      case 4: return 'R4'
      case 5: return 'R5'
    }
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

  const renderItem = (info: ListRenderItemInfo<IPneu>): CardElement => (
    
    <Card 
      onPress={() => onViewPress(info.item)}
      style={[styles.itemContainer]} >

      <Swippeable
        ref={ref => row[info.index] = ref}
        onSwipeableOpen={() => closeRow(info.index)}
        overshootRight={false}
        renderLeftActions={() => (
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
        )}
        renderRightActions={() => (
          <Animated.View>
            <View>
              <RectButton
                style={styles.buttonEdit}
                onPress={() => clickEdit(info.index, info.item)} >
                <Button
                  accessoryRight={EditIcon}
                  style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} />
                <Text>Editar</Text>
              </RectButton>
            </View>
          </Animated.View>
        )}>

        <RectButton
          style={[styles.container, {backgroundColor: info.item.AferiuHoje == true && '#98FB98'}]}  >

          <View
            style={styles.card}>
            <View
              style={styles.button}>
              <View>
                <Image
                  style={styles.pneu}
                  source={require('../../assets/images/acao_pneu.jpg')}></Image>
              </View>  
              
              <View>
                <Text category='s2' >
                  Código: {info.item.Id}
                </Text>
                <Text category='s2' >
                  Número de fogo: {info.item.NumeroFogo}
                </Text>
                <Text category='s2'>
                  Frota: {info.item.Bem?.Frota}    Posição: {info.item.Posicao}
                </Text>
              </View>
            </View>

            <View
              style={styles.button}>
              <View>
                <Image
                  style={styles.pneu}
                  source={imagemDisponibilidade(info.item.Disponibilidade)}></Image>
              </View>  

              <View>
                <Text
                  style={[styles.status, { color: corStatus(info.item.Status) }]}>
                  {getStatus(info.item.Status)}
                </Text>
              </View>
            </View>
          </View>

        </RectButton>
      </Swippeable >
    </Card>
  );

  return (
    <List
      {...listProps}
      keyExtractor={(item) => item.Id.toString()}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      renderItem={renderItem}
      onEndReachedThreshold={0.1}
      onEndReached={({ distanceFromEnd }) => props.onHandleFindMore(distanceFromEnd)}
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
  },
  status: {
    textAlign: 'center',
    fontSize: 45,
    marginHorizontal: 4,
    width: 60,
  },
});
