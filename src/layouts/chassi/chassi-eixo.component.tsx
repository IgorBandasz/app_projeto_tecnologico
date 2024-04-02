import React from 'react';
import { ListRenderItemInfo, View } from 'react-native';
import { Card, CardElement, List, ListElement, ListProps, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { RectButton } from 'react-native-gesture-handler';

import { IPosicaoPneu } from '../../model/posicao.model';
import { ChassiPneu } from './chassi-pneu.component';
import { IEixo } from '../../model/chassi.model';
import { IPneu } from '../../model/pneu.model';

export interface ChassiEixoProps extends Omit<ListProps, 'renderItem'> {
  destino: boolean;
  ult: number;
  data: IEixo[];
  onHandleSelect: (item:  IPosicaoPneu) => void;
  onHandleSelectVazio: (item:  IPosicaoPneu) => void;
  pneuSelecionado?: IPneu;
}

export type LayoutListElement = React.ReactElement<ChassiEixoProps>;

export const ChassiEixo = (props: ChassiEixoProps): ListElement => {

  const styles = useStyleSheet(themedStyles);
  const { contentContainerStyle, onHandleSelect, onHandleSelectVazio, ...listProps } = props;

  function PosicaoEixo(id: number, step: boolean): number{
    if (step)
      return 4
    else if (id == 1)
      return 1
    else if (id == props.ult)
      return 3
    else
      return 2   
  }

  const renderItem = (info: ListRenderItemInfo<IEixo>): CardElement => (
    <ChassiPneu
      destino={props.destino}
      posicaoEixo={PosicaoEixo(info.item.Id, info.item.Step)}
      data={info.item.PosicaoPneus}
      onHandleSelect={onHandleSelect}
      onHandleSelectVazio={onHandleSelectVazio}
      pneuSelecionado={props.pneuSelecionado}/>
  );

  return (
    
      <List
        {...listProps}
        keyExtractor={(item) => item.Id.toString()}
        contentContainerStyle={[styles.container, contentContainerStyle]}
        renderItem={renderItem}
        onEndReachedThreshold={0.1}
      />
  );
};

const themedStyles = StyleService.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 4,
    alignItems: 'center',
    position: 'relative',
  },
  itemContainer: {
    marginVertical: 4,
    marginHorizontal: 4,
  },
});
