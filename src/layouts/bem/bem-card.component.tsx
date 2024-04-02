import React, { ReactElement, useRef } from 'react';
import { Alert, Animated, View } from 'react-native';
import { Button, Card, CardProps, Divider, ListElement, Modal, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { RectButton } from 'react-native-gesture-handler';
import Swippeable from 'react-native-gesture-handler/Swipeable';

import { IBem } from '../../model/bem.model';
import { FindIcon } from '../../components/icons';
import Loader from '../../components/Loader';
import BemService from '../../services/api-bem-service';
import { ILancamentoContador } from '../../model/lancamento-contador.model';
import { dateDBToStr } from '../../utils/date';
import { formatMoeda } from '../../utils/float';

export interface BemCardProps extends Omit<CardProps, 'renderItem'> {
  data: IBem;
  onFindPress: (item?: IBem) => void;
  onLancarContadorPress: (item: IBem, ultCont: ILancamentoContador) => void;
  caption?: string;
}

export const BemCard = (props: BemCardProps): ListElement => {
  const styles = useStyleSheet(themedStyles);
  const { onFindPress } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const swipeableRef = useRef(null);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [ultCont, setUltCont] = React.useState<ILancamentoContador>({} as ILancamentoContador);

  function clickFind(item: IBem) {
    swipeableRef?.current?.close();
    onFindPress(item)
  }

  async function CarregaOpcoes(bem: IBem){
    if(bem?.Id){
      try {
        setIsLoading(true);

        const service = new BemService();
        const result = await service.getUltContadorPneu(bem.Id);
        
        if (result.status === 200){
          setUltCont({...result.data.Data,
            DataString: dateDBToStr(result.data.Data.Data)} as ILancamentoContador)
          setVisible(true)
        } else {
          Alert.alert('Aviso', result.data.Message)
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        Alert.alert(error);
      }
    }else{
      props.onFindPress()
    }
  }

  const renderFind = (props): ReactElement => (
    <Animated.View>
      <RectButton
        style={styles.buttonFind}
        onPress={() => clickFind(props.data)}>
        <Button
          accessoryRight={FindIcon}
          style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} />
        <Text>Selec...</Text>
      </RectButton>
    </Animated.View>
  );

  return (
    <>
      <Loader
        loading={isLoading} />

      <Modal
        backdropStyle={styles.fundoModal}
        visible={visible}
        onBackdropPress={() => setVisible(false)}
        style={styles.modal}>

        <View>
          <Text style={styles.titulo}>BEM</Text>
          <Text category='s1' >
            Código: {props.data?.Id}
          </Text>
          <Text category='s1' >
            Frota: {props.data?.Frota}
          </Text>
          <Text category='s1'>
            Placa: {props.data?.Placa}
          </Text>
          <Text category='s1' >
            Descrição: {props.data?.Descricao}
          </Text>

          <Divider/>

          <Text style={styles.titulo}>CONTADOR</Text>
          <Text category='s1' >
            Nome: {ultCont.Contador?.NomeContador}
          </Text>
          <Text category='s1' >
            Data Últ Lançamento: {ultCont.DataString}
          </Text>
          <Text category='s1'>
            Posição: {formatMoeda(ultCont.ContadorNovo)}
          </Text>
        </View>  

        <Text/>

        {props.data?.Id && props.onLancarContadorPress &&
          <Button
            style={styles.button}
            onPress={() => {setVisible(false); props.onLancarContadorPress(props.data, ultCont)}}
            status='success' >
            Lançar Contador
          </Button>
        }

        <Button
          style={styles.button}
          onPress={() => setVisible(false)}
          status='danger' >
          Fechar
        </Button>

      </Modal>

      <Text style={styles.textLabel} appearance='hint' category='label' > Bem </Text>
      
      <Card style={[styles.container, !onFindPress ? styles.cardDisable : (props.caption ? styles.cardDanger : styles.cardInfo)]} >

        <Swippeable
          ref={swipeableRef}
          overshootRight={false}
          renderRightActions={onFindPress && renderFind}>

          <RectButton
            style={[styles.itemContainer]}
            onPress={() => CarregaOpcoes(props.data)} >

            <View>
              <Text category='s2' >
                {props.data ? `Id: ${props.data?.Id}` : ''}
              </Text>
              <Text category='s2' >
                {props.data ? `Descrição: ${props.data?.Descricao}` : 'Sem Bem Selecionado'}
              </Text>
              <Text category='s2' >
                {props.data ? `Placa: ${props.data?.Placa}   ` : ''}{props.data ? `Frota: ${props.data?.Frota}` : ''}
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
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10
  },
  fundoModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    marginVertical: 4,
    marginHorizontal: 4,
  },
  titulo: {
    fontWeight: 'bold'
  },
});
