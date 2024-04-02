import React from 'react';
import { ListRenderItemInfo  } from 'react-native';
import { Card, CardElement, List, ListElement, ListProps, StyleService, Text, useStyleSheet } from '@ui-kitten/components';

import { IFilial } from '../../model/filial.model';

export interface FilialListProps extends Omit<ListProps, 'renderItem'> {
  data: IFilial[];
  onViewPress: (Item: IFilial) => void;
  onHandleFindMore: (distance: number) => void;
}

export type LayoutListElement = React.ReactElement<FilialListProps>;

export const FilialList = (props: FilialListProps): ListElement => {

  const styles = useStyleSheet(themedStyles);
  const { contentContainerStyle, onViewPress, ...listProps } = props;

  const renderItem = (info: ListRenderItemInfo<IFilial>): CardElement => (
    <Card
      style={[styles.itemContainer, { backgroundColor: info.index % 2 === 0 ? '#f2f2f2' : 'white' }]} 
      onPress={() => onViewPress(info.item)}>

      <Text category='s2' >
        Filial: {info.item.Nome}
      </Text>
    </Card>
  );

  return (
    <List
      {...listProps}
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
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
