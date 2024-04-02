import React, { ReactElement, useRef } from 'react';
import { Alert, Animated, View } from 'react-native';
import { Button, Card, CardProps, Divider, ListElement, Modal, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { RectButton } from 'react-native-gesture-handler';
import Swippeable from 'react-native-gesture-handler/Swipeable';

import { IPneu } from '../../model/pneu.model';
import { FindIcon } from '../../components/icons';
import { IBem } from '../../model/bem.model';
import { ILancamentoContador } from '../../model/lancamento-contador.model';
import BemService from '../../services/api-bem-service';
import { dateDBToStr } from '../../utils/date';
import Loader from '../../components/Loader';
import { formatMoeda } from '../../utils/float';

export interface PneuCardProps extends Omit<CardProps, 'renderItem'> {
  data: IPneu;
  onFindPress: (item: IPneu) => void;
  onLancarContadorPress: (item: IBem, ultCont: ILancamentoContador) => void;
  caption?: string;
}

export const PneuCard = (props: PneuCardProps): ListElement => {
  const styles = useStyleSheet(themedStyles);
  const { onFindPress } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const swipeableRef = useRef(null);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [bem, setBem] = React.useState<IBem>({} as IBem);
  const [ultCont, setUltCont] = React.useState<ILancamentoContador>({} as ILancamentoContador);


  function clickFind(item: IPneu) {
    swipeableRef?.current?.close();
    onFindPress(item)
  }

  async function CarregaOpcoes(idBem: number){
    if(idBem){
      try {
        setIsLoading(true);

        const service = new BemService();
        const result = await service.getOne(idBem);
        
        if (result.data){
          const resultCont = await service.getUltContadorPneu(idBem);
          
          if (resultCont.status === 200){
            setBem(result.data)
            setUltCont({...resultCont.data.Data,
              DataString: dateDBToStr(resultCont.data.Data.Data)} as ILancamentoContador)
            setVisible(true)
          } else {
            Alert.alert('Aviso', resultCont.data.Message)
          }
        } else {
          Alert.alert('Aviso', 'Falha na busca do Bem')
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        Alert.alert(error);
      }
    }
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
          <Text>Selec...</Text>
        </RectButton>
      </View>
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
          <Text style={styles.titulo}>PNEU</Text>
          <Text category='s1' >
            Código: {props.data?.Id}
          </Text>
          <Text category='s1' >
            Número de Fogo: {props.data?.NumeroFogo}
          </Text>
          <Text category='s1'>
            Posição: {props.data?.Posicao}
          </Text>

          <Divider/>
          
          <Text style={styles.titulo}>BEM</Text>
          <Text category='s1' >
            Código Bem: {bem?.Id}
          </Text>
          <Text category='s1' >
            Frota: {bem?.Frota}
          </Text>
          <Text category='s1'>
            Placa: {bem?.Placa}
          </Text>
          <Text category='s1' >
            Descrição: {bem?.Descricao}
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
            onPress={() => {setVisible(false); props.onLancarContadorPress(props.data?.Bem, ultCont)}}
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

      <Text style={styles.textLabel} appearance='hint' category='label' > Pneu </Text>

      <Card style={[styles.container, !onFindPress ? styles.cardDisable : (props.caption ? styles.cardDanger : styles.cardInfo)]} >

        <Swippeable
          ref={swipeableRef}
          overshootRight={false}
          renderRightActions={onFindPress && renderFind}>

          <RectButton
            style={[styles.itemContainer]} 
            onPress={() => CarregaOpcoes(props.data?.Bem?.Id)}>

            <View>
              <Text category='s2' >
                {props.data ? `Número Fogo: ${props.data?.NumeroFogo}` : 'Sem Pneu Selecionado'}
              </Text>
              <Text category='s2' >
                {props.data ? `Número Série: ` : ''}
                {props.data?.NumeroSerie ? `${props.data.NumeroSerie}` : ''}
              </Text>
              <Text category='s2'>
                {props.data ? `Posição: ` : ''}
                {props.data?.Posicao ? `${props.data.Posicao}` : ''}
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
    //alignItems: 'center',
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
