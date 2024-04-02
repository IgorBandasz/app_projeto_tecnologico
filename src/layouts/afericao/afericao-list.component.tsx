import React from 'react';
import { Animated, ListRenderItemInfo, View } from 'react-native';
import { Button, Card, CardElement, List, ListElement, ListProps, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { RectButton } from 'react-native-gesture-handler';
import Swippeable from 'react-native-gesture-handler/Swipeable';

import { IAfericao } from '../../model/afericao.model';
import { DeleteIcon, EditIcon } from '../../components/icons';
import { dateDBToStr } from '../../utils/date';
import { timeDBToStr } from '../../utils/time';

export interface AfericaoListProps extends Omit<ListProps, 'renderItem'> {
  data: IAfericao[];
  onViewPress: (item: IAfericao) => void;
  onDeletePress?: (item: IAfericao) => void;
  onHandleFindMore: (distance: number) => void;
}

export type LayoutListElement = React.ReactElement<AfericaoListProps>;

export const AfericaoList = (props: AfericaoListProps): ListElement => {
  const styles = useStyleSheet(themedStyles);
  const { contentContainerStyle, onViewPress, ...listProps } = props;

  let row: Array<any> = [];
  let prevOpenedRow;

  function closeRow(index: number) {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
		  prevOpenedRow.close();
    }
      prevOpenedRow = row[index];
  }

  function clickDelete(index: number, item: IAfericao) {    
    prevOpenedRow = row[index];
    prevOpenedRow.close();
    props.onDeletePress(item);
  }

  const renderItem = (info: ListRenderItemInfo<IAfericao>): CardElement => (
    
    <Card 
      style={[styles.itemContainer, { backgroundColor: info.index % 2 === 0 ? '#f2f2f2' : 'white' }]} 
      onPress={() => onViewPress(info.item)}>

      <Swippeable
        ref={ref => row[info.index] = ref}
        onSwipeableOpen={() => closeRow(info.index)}
        overshootLeft={false}
        renderLeftActions={props.onDeletePress && (() => (
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
        ))}>

        <RectButton
          style={[styles.container]}  >

          <View>
            <Text category='s2'>
              Código: {info.item.Id}
            </Text>
            <Text category='s2' >
              Número de fogo: {info.item.Pneu.NumeroFogo}
            </Text>
            <Text category='s2'>
              Posição: {info.item.Pneu.Posicao}
            </Text>
            <Text category='s2' >
              {`Data: ${dateDBToStr(info.item.Data)}        Hora: ${timeDBToStr(info.item.Hora)}`}
            </Text>
            <Text category='s2' >
              {`Sulco: ${info.item.Sulco}       Pressão: ${info.item.Pressao}`}
            </Text>
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
  }
});
