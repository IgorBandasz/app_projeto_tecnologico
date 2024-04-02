import React from 'react';
import { Animated, Image, ListRenderItemInfo, View } from 'react-native';
import { Button, Card, CardElement, Divider, List, ListElement, ListProps, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { RectButton } from 'react-native-gesture-handler';

import { IItemHistoricoPneu } from '../../model/historico-pneu.model';
import { formatMoeda } from '../../utils/float';

export interface ItemHistoricoPneuListProps extends Omit<ListProps, 'renderItem'> {
  data: IItemHistoricoPneu[];
}

export type LayoutListElement = React.ReactElement<ItemHistoricoPneuListProps>;

export const ItemHistoricoPneuList = (props: ItemHistoricoPneuListProps): ListElement => {
  const styles = useStyleSheet(themedStyles);
  const { contentContainerStyle, ...listProps } = props;

  const renderItem = (info: ListRenderItemInfo<IItemHistoricoPneu>): CardElement => (
    <Card
      style={styles.itemContainer}>
        <Text category='s1' style={styles.titulo}>
          {info.item.Nome}
        </Text>
        
        <View
          style={styles.button}>
          <Text category='s1' style={styles.celula}>
            Novo: 
          </Text>
          <Text category='s1' style={styles.celula}>
            {info.item.R0}
          </Text>
        </View>
        <Divider/>
        <View
          style={styles.button}>
          <Text category='s1' style={styles.celula}>
            R1: 
          </Text>
          <Text category='s1' style={styles.celula}>
            {info.item.R1}
          </Text>
        </View>
        <Divider/>
        <View
          style={styles.button}>
          <Text category='s1' style={styles.celula}>
            R2: 
          </Text>  
          <Text category='s1' style={styles.celula}>
            {info.item.R2}
          </Text>
        </View>
        <Divider/>
        <View
          style={styles.button}>
          <Text category='s1' style={styles.celula}>
            R3: 
          </Text>  
          <Text category='s1' style={styles.celula}>
            {info.item.R3}
          </Text>
        </View>
        <Divider/>
        <View
          style={styles.button}>
          <Text category='s1' style={styles.celula}>
            R4: 
          </Text>  
          <Text category='s1' style={styles.celula}>
            {info.item.R4}
          </Text>
        </View>
        <Divider/>
        <View
          style={styles.button}>
          <Text category='s1' style={styles.celula}>
            R5: 
          </Text>  
          <Text category='s1' style={styles.celula}>
            {info.item.R5}
          </Text>
        </View>
        { 
          info.item.CalculaTotal &&
          <>
            <Divider/>
            <View
              style={styles.button}>
              <Text category='s1' style={styles.celula}>
                Acumulado: 
              </Text>  
              <Text category='s1' style={styles.celula}>
                {formatMoeda(info.item.Total)}
              </Text>
            </View>
          </>
        }
    </Card>
  );

  return (
    <List
      {...listProps}
      keyExtractor={(item) => item.Id.toString()}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      renderItem={renderItem}
    />
  );
};

const themedStyles = StyleService.create({
  container: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  itemContainer: {
    marginVertical: 4,
    marginHorizontal: 4,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  titulo: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  celula: {
    
    marginHorizontal: 4,
  },

});
