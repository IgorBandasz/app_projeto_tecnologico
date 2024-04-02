import React, { ReactElement, useRef } from 'react';
import { Animated, View } from 'react-native';
import { Button, Card, CardProps, ListElement, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { RectButton } from 'react-native-gesture-handler';
import Swippeable from 'react-native-gesture-handler/Swipeable';

import { ITipoConserto } from '../../model/tipo-conserto.model';
import { FindIcon } from '../../components/icons';

export interface TipoConsertoCardProps extends Omit<CardProps, 'renderItem'> {
  data: ITipoConserto;
  onFindPress: (item?: ITipoConserto) => void;
  caption?: string;
}

export const TipoConsertoCard = (props: TipoConsertoCardProps): ListElement => {

  const styles = useStyleSheet(themedStyles);
  const { onFindPress } = props;
  const swipeableRef = useRef(null);

  function clickFind(item: ITipoConserto) {
    swipeableRef?.current?.close();
    onFindPress(item)
  }

  async function onFind(item: ITipoConserto) {
    if(!item)
      props.onFindPress()
  }

  const renderFind = (props): ReactElement => (
    <Animated.View>
      <View>
        <RectButton
          style={styles.buttonFind}
          onPress={() => clickFind(props.data)} >
          <Button
            accessoryRight={FindIcon}
            style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} />
         
        </RectButton>
      </View>
    </Animated.View>
  );

  return (
    <>
      <Text style={styles.textLabel} appearance='hint' category='label' > Tipo de Conserto </Text>

      <Card style={[styles.container, !onFindPress ? styles.cardDisable : (props.caption ? styles.cardDanger : styles.cardInfo)]} >

        <Swippeable
          ref={swipeableRef}
          overshootRight={false}
          renderRightActions={onFindPress && renderFind}>

          <RectButton
            style={[styles.itemContainer]}
            onPress={async()=> onFind(props.data)} >

            <View>
              <Text category='s2' >
                {props.data ? `Id: ${props.data?.Id}` : ''}
              </Text>
              <Text category='s2' >
                {props.data ? `Nome: ${props.data?.Nome}` : 'Sem Tipo de Conserto Selecionado'}
              </Text>
            </View>

          </RectButton>
        </Swippeable >
      </Card>

      {
        props.caption &&
        <Text style={styles.textError} category='label'>{props.caption}</Text>
      }
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
  itemContainer: {
    marginVertical: 4,
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
  textError: {
    marginHorizontal: 12,
    color: 'color-danger-500',
  },
  buttonFind: {
    width: 90,
    height: '100%',
    backgroundColor: 'color-success-500',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  }
});
