import React, { useEffect } from 'react';
import { Alert, View } from 'react-native';
import { Button, Card, CheckBox, Divider, IndexPath, Input, Radio, RadioGroup, Select, SelectItem, StyleService, Tab, TabView, Text, Toggle, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';

import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { ArrowIosBackIcon, CameraIcon, DadosIcon, MenuIcon, RefreshIcon, SearchIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { IPneu, IPneuImagem } from '../../model/pneu.model';
import Loader from '../../components/Loader';
import { AppStorage } from '../../services/app-storage.service';
import UsuarioService from '../../services/api-usuario-service';

import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale'
import { IHistoricoUsuario, IItemHistoricoUsuario } from '../../model/historico-usuario.model';
import { IUsuario } from '../../model/usuario-model';
import { dateDBToStr, strToDate } from '../../utils/date';

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [usuario, setUsuario] = React.useState<IUsuario>();
  const [historico, setHistorico] = React.useState<IHistoricoUsuario>();
  
  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={navigation.toggleDrawer} />
  );

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const user = await AppStorage.getUsuario();

        const service = new UsuarioService();
        const result = await service.getHistorico(user.Id);

        if (result.status === 200){
          setUsuario(user);

          result.data.Data.Movimentacoes.forEach(function(mov: IItemHistoricoUsuario) {
            var data = dateDBToStr(mov.Data);
            mov.Data = strToDate(data);
          });

          result.data.Data.Afericoes.forEach(function(mov: IItemHistoricoUsuario) {
            var data = dateDBToStr(mov.Data);
            mov.Data = strToDate(data);
          });

          setHistorico(result.data.Data);
        } else {
          Alert.alert('Aviso', result.data?.Message)
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        Alert.alert(error);
      }
    }

    handleLoad();
  }, []);

  async function handleFind() {
    try {
      setIsLoading(true);
      
      const service = new UsuarioService();
      const result = await service.getHistorico(usuario.Id);

      if (result.status === 200){
        result.data.Data.Movimentacoes.forEach(function(mov: IItemHistoricoUsuario) {
          var data = dateDBToStr(mov.Data);
          mov.Data = strToDate(data);
        });

        result.data.Data.Afericoes.forEach(function(mov: IItemHistoricoUsuario) {
          var data = dateDBToStr(mov.Data);
          mov.Data = strToDate(data);
        });

        setHistorico(result.data.Data);
      } else {
        Alert.alert('Aviso', result.data?.Message)
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      Alert.alert(`Ocorreu um erro ao efetuar a busca.`);
    }
  }

  const dia = (date: Date) => {
      var data = `${date}`;
      var dia = data.slice(8, 10) ;
      var mes = date.getMonth()+1 ;
      
      return `${dia}/${mes}`; 
  }

  const contentInset = { top: 20, bottom: 20 }

  return (
    <>
      <TopNavigation
        title='HOME'
        accessoryLeft={renderDrawerAction} />

      <Divider />

      <Loader
        loading={isLoading} />

      {
        historico?.IdUsuario &&
          <>
            <Card
              style={styles.card}>
              <Text style={styles.titulo}>Pneus Aferidos</Text>
              <View
                style={styles.totais}>
                <View
                  style={styles.total}>
                  <Text style={styles.tituloTotal}>30 Dias</Text>
                  <Text style={styles.valorTotal}>{`${historico.Afericoes30Dias}`}</Text>
                </View>
                <View
                  style={styles.total}>
                  <Text style={styles.tituloTotal}>7 Dias</Text>
                  <Text style={styles.valorTotal}>{`${historico.Afericoes7Dias}`}</Text>
                </View>
                <View
                  style={styles.total}>
                  <Text style={styles.tituloTotal}>Hoje</Text>
                  <Text style={styles.valorTotal}>{`${historico.AfericoesHoje}`}</Text>
                </View>
              </View>

              <View style={{ height: 200, flexDirection: 'row' }}>
                <YAxis
                  style={styles.eixoY}
                  data={historico.Afericoes}
                  yAccessor={ ({ item }) => item.Quant }
                  contentInset={contentInset}
                  svg={{
                      fill: 'grey',
                      fontSize: 10,
                  }}
                  numberOfTicks={10}
                  formatLabel={(value) => value}
                />
                <LineChart 
                  style={styles.grafico}
                  data={historico.Afericoes}
                  //xAccessor={ ({ item }) => item.Data }
                  yAccessor={ ({ item }) => item.Quant }
                  xScale={ scale.scaleTime }
                  svg={{ stroke: 'rgb(134, 65, 244)' }}
                  contentInset={contentInset}>
                  <Grid />
                </LineChart>
              </View>
              <XAxis
                style={styles.eixoX}
                scale={ scale.scaleTime } 
                data={historico.Afericoes}
                numberOfTicks={8}
                xAccessor={ ({ item }) => item.Data }
                formatLabel={(value) => dia(value)}
                contentInset={{ left: 10, right: 10 }}
                svg={{ fontSize: 10, fill: 'black' }}/>
            </Card>

            <Card
              style={styles.card}>
              <Text style={styles.titulo}>Movimentações de Pneu</Text>
              <View
                style={styles.totais}>
                <View
                  style={styles.total}>
                  <Text style={styles.tituloTotal}>30 Dias</Text>
                  <Text style={styles.valorTotal}>{`${historico.Movimentacoes30Dias}`}</Text>
                </View>
                <View
                  style={styles.total}>
                  <Text style={styles.tituloTotal}>7 Dias</Text>
                  <Text style={styles.valorTotal}>{`${historico.Movimentacoes7Dias}`}</Text>
                </View>
                <View
                  style={styles.total}>
                  <Text style={styles.tituloTotal}>Hoje</Text>
                  <Text style={styles.valorTotal}>{`${historico.MovimentacoesHoje}`}</Text>
                </View>
              </View>

              <View style={{ height: 200, flexDirection: 'row' }}>
                <YAxis
                  style={styles.eixoY}
                  data={historico.Movimentacoes}
                  yAccessor={ ({ item }) => item.Quant }
                  contentInset={contentInset}
                  svg={{
                      fill: 'grey',
                      fontSize: 10,
                  }}
                  numberOfTicks={10}
                  formatLabel={(value) => value}
                />
                <LineChart 
                  style={styles.grafico}
                  data={historico.Movimentacoes}
                  //xAccessor={ ({ item }) => item.Data }
                  yAccessor={ ({ item }) => item.Quant }
                  xScale={ scale.scaleTime }
                  svg={{ stroke: 'rgb(134, 65, 244)' }}
                  contentInset={contentInset}>
                  <Grid />
                </LineChart>
              </View>
              <XAxis
                style={styles.eixoX}
                scale={ scale.scaleTime } 
                data={historico.Movimentacoes}
                numberOfTicks={ 5 }
                xAccessor={ ({ item }) => item.Data }
                formatLabel={(value) => dia(value)}
                contentInset={{ left: 10, right: 10 }}
                svg={{ fontSize: 10, fill: 'black' }}/>
            </Card>
          </>
      }
        
      <Button
          style={styles.buttonFloat}
          status='success'
          size='giant'
          onPress={handleFind}
          accessoryRight={RefreshIcon} />  
    </>
  );
};

const themedStyles = StyleService.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 8,
  }, 
  totais: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
    marginHorizontal: 4,
  },
  total: {
    marginHorizontal: 8,
    backgroundColor: 'color-success-400',
    borderRadius: 5,
    width: 70,
  },
  titulo: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  tituloTotal: {
    textAlign: 'center',
    marginVertical: 4,
    marginHorizontal: 8,
  },
  valorTotal: {
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
    marginVertical: 4,
    marginHorizontal: 8,
  },


  grafico: {
    flex: 1,
    marginRight: 8,
    marginLeft: 4,
  },
  eixoX: {
    marginLeft: 15,
  },
  eixoY: {
    marginLeft: 8,
  },
  buttonFloat: {
    width: 60,
    height: 60,
    padding: 10,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
