import React from 'react';
import { ListRenderItemInfo, View } from 'react-native';
import { Button, Card, CardElement, Layout, List, ListElement, ListProps, StyleService, Text, useStyleSheet } from '@ui-kitten/components';

import Swippeable from 'react-native-gesture-handler/Swipeable';
import { IRecapagemPneuServico } from '../../../model/recapagem-pneu.model';
import Loader from '../../../components/Loader';
import { RectButton } from 'react-native-gesture-handler';
import { maskCurrency } from '../../../components/mask.format';
import { formatMoeda } from '../../../utils/float';
import Animated from 'react-native-reanimated';
import { DeleteIcon, EditIcon } from '../../../components/icons';

export interface RecapagemServicoListProps extends Omit<ListProps, 'renderItem'> {
  data: IRecapagemPneuServico[];
  onAddPress?: () => void;
  onViewPress?: (item: IRecapagemPneuServico) => void;
  onDeletePress?: (item: IRecapagemPneuServico) => void;
}

export type LayoutListElement = React.ReactElement<RecapagemServicoListProps>;

export const RecapagemServicoList = (props: RecapagemServicoListProps): ListElement => {
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

  function clickView(index: number, item: IRecapagemPneuServico) {    
    prevOpenedRow = row[index];
    prevOpenedRow.close();
    props.onViewPress(item);
  }

  function clickDelete(index: number, item: IRecapagemPneuServico) {    
    prevOpenedRow = row[index];
    prevOpenedRow.close();
    deletePressButton(item)
  }

  async function deletePressButton(servico: IRecapagemPneuServico) {
    setIsLoading(true);
    props.onDeletePress(servico);
    setIsLoading(false);
  }

  const renderItem = (info: ListRenderItemInfo<IRecapagemPneuServico>): CardElement => (
    <Card>

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
        ))}>

        <RectButton

          style={{ flexDirection: 'row', marginVertical: 4, backgroundColor: info.index % 2 === 0 ? '#f2f2f2' : 'white' }}
          onPress={() => {clickView(info.index, info.item)}}
          key={info.index}>

          <View>
            <Layout style={styles.rowContainer}>
              <Text category='s1' >
                # {info.item.TipoConserto?.Nome}
              </Text>
            </Layout>

            <Layout style={styles.rowContainer}>
              <Text category='s2' appearance='hint' >
                Quant: {info.item.Quant && `${maskCurrency(info.item.Quant.toString())}`} 
              </Text>
              <Text category='s2' appearance='hint' style={{marginHorizontal: 20}}>
                Valor: {info.item.ValorUnit && `R$${formatMoeda(info.item.ValorUnit)}`}
              </Text>
              <Text category='s2' appearance='hint' style={{marginHorizontal: 20}}>
                Total: {info.item.ValorTotal && `R$${formatMoeda(info.item.ValorTotal)}`}
              </Text>
            </Layout>
          
          </View>

        </RectButton>
      </Swippeable>
    </Card>
  ); 

  return (
    <>
      <Loader
        loading={isLoading} />

      <Text
        style={styles.textLabel}
        appearance='hint'
        category='label' >
        Lista de Serviços
      </Text>

      <Card
        style={[styles.container, styles.cardDisable]} >
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
                Não possui serviços
              </Text>
            )
        }

        {
          props.onAddPress &&
          <Button
            onPress={props.onAddPress}
            status='info' >
            Adicionar Serviço
          </Button>  
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
  button: {
    marginHorizontal: 16,
    marginVertical: 12,
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
