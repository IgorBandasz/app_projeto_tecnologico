import React from 'react';
import { ListRenderItemInfo, View } from 'react-native';
import { Card, CardElement, List, ListElement, ListProps, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { RectButton } from 'react-native-gesture-handler';

import { IFabricantePneu } from '../../model/fabricante-pneu.model';

export interface FabricantePneuListProps extends Omit<ListProps, 'renderItem'> {
  data: IFabricantePneu[];
  onHandleView: (item:  IFabricantePneu) => void;
  onHandleFindMore: (distance: number) => void;
}

export type LayoutListElement = React.ReactElement<FabricantePneuListProps>;

export const FabricantePneuList = (props: FabricantePneuListProps): ListElement => {

  const styles = useStyleSheet(themedStyles);
  const { contentContainerStyle, onHandleView, ...listProps } = props;

  const renderItem = (info: ListRenderItemInfo<IFabricantePneu>): CardElement => (
    
    <Card 
      style={[styles.itemContainer, { backgroundColor: info.index % 2 === 0 ? '#f2f2f2' : 'white' }]}
      onPress={() => onHandleView(info.item)} >
        <RectButton
          style={[styles.container]}  >

          <View>
            <Text category='s2'>
              Código: {info.item.Id}
            </Text>
            <Text category='s2' >
              Nome: {info.item.Nome}
            </Text>
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
  }
});
