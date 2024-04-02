import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, View } from 'react-native';
import { Card, Divider, Layout, Select, SelectItem, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';

import Loader from '../../components/Loader';
import { ArrowIosBackIcon, MenuIcon } from '../../components/icons';
import { IBem } from '../../model/bem.model';
import BemService from '../../services/api-bem-service';
import { IPneu } from '../../model/pneu.model';
import { IPosicaoPneu } from '../../model/posicao.model';
import { IChassi, IEixo } from '../../model/chassi.model';
import { ChassiEixo } from './chassi-eixo.component';
import { BemCard } from '../bem/bem-card.component';
import PneuService from '../../services/api-pneu-service';
import { ILancamentoContador } from '../../model/lancamento-contador.model';

interface Params { 
  posicao: IPosicaoPneu,
  onSelect: (posD: IPosicaoPneu, posO: IPosicaoPneu, voltas: number, onGoBack: () => Promise<void>) => void;
  voltas: number;
  onGoBack: () => Promise<void>;
}
export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bem, setBem] = useState<IBem>();
  const [matriz, setMatriz] = useState<IEixo[]>();
  const [param,] = useState<Params>(route.params as Params);  

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);
        
        if(param.posicao.Pneu.Bem != null)
          handleSelectBem(param.posicao.Pneu.Bem) 

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        Alert.alert(error);
      }
    }

    handleLoad();
  }, []);

  async function handleFindBem() {
    navigation.navigate('BemList', {
      onSelect: (item: IBem) => handleSelectBem(item)
    })
  }

  async function handleLancarContador(bem: IBem, ultCont: ILancamentoContador) {
    navigation.navigate('LancamentoContadorAdd', { bem: bem, ultCont: ultCont });
  }

  async function handleSelectBem(item: IBem) {
    try {
      setIsLoading(true);

      const service = new BemService();
      const result = await service.getChassi(item.Id);
      
      if(result.status == 200){
        const resultPneu = await service.getPneu(item.Id, false);
        
        if(resultPneu.status == 200){
          if(result.data.Data?.Id == 0){
            Alert.alert('Aviso', 'Este bem não possui chassi vinculado. Entre em contato com o supervisor.');
            }else{
              var matriz = await montarMatriz(result.data.Data)
              matriz = await alocarPneusMatriz(matriz, resultPneu.data.Data);
              
              setBem(item);
              setMatriz(matriz as IEixo[]);
            }
        }else{
          setMatriz([] as IEixo[]);
          Alert.alert('Aviso',resultPneu.data.Message);
        }
      }else{
        setMatriz([] as IEixo[]);
        Alert.alert('Aviso',result.data?.Message);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Alert.alert(error);
    }
  }

  async function montarMatriz(chassi: IChassi): Promise<IEixo[]> {
    var matriz = [] as IEixo[];
    var eixo = {} as IEixo;
    var pos = {} as IPosicaoPneu;
    var alfabeto = ['A','B','C','D','E','F','G','H','Z']
    var id = 1;
    
    const posVazio = {Pneu: null, Posicao: '', Eixo: '', Rodado: ''};
    const posEixoVazio= {Pneu: null, Posicao: 'EIXO_VAZIO', Eixo: '', Rodado: ''} as IPosicaoPneu;
    var eixoVazio = {Id: id, Step: false, PosicaoPneus: [posVazio,posVazio,posVazio,posEixoVazio,posVazio,posVazio,posVazio]} as IEixo;

    if(chassi.DianteiroEixoA == 0 && chassi.DianteiroEixoB == 0 && chassi.DianteiroEixoC == 0 && chassi.DianteiroEixoD == 0 &&
      chassi.DianteiroEixoE == 0 && chassi.DianteiroEixoF == 0 && chassi.DianteiroEixoG == 0 && chassi.DianteiroEixoH == 0){
        matriz = [...matriz, eixoVazio];
        id++;    
    }

    for(var I = 0; I < 9; I++){

      if(chassi[`Eixo${alfabeto[I]}Visivel`] == 1){
        eixo = {Id: id, Step: false, PosicaoPneus: []} as IEixo;

        for(var J = 0; J < 6; J++){
          if(chassi[`Eixo${alfabeto[I]}`][J] == '1'){
            pos= {
              Pneu: null,
              Posicao: chassi[`SiglaEixo${alfabeto[I]}`] + chassi[`SiglaRodado${alfabeto[J]}`],
              Eixo: alfabeto[I],
              Rodado: `${J+1}`,
            };
          }else{
            pos= posVazio;
          }
          
          eixo.PosicaoPneus = [...eixo.PosicaoPneus, pos] as IPosicaoPneu[];

          if(J == 2){
            pos= {
              Pneu: null,
              Posicao: 'EIXO',
              Eixo: chassi[`SiglaEixo${alfabeto[I]}`],
              Tracao: chassi[`TracaoEixo${alfabeto[I]}`] == 1,
              Rodado: '',
            };
            eixo.PosicaoPneus = [...eixo.PosicaoPneus, pos] as IPosicaoPneu[];
          }
        }

        matriz = [...matriz, eixo];
        id++;

        if(chassi[`DianteiroEixo${alfabeto[I]}`] == 1){
          var eixoVazio = {Id: id, Step: false, PosicaoPneus: [posVazio,posVazio,posVazio,posEixoVazio,posVazio,posVazio,posVazio]} as IEixo;
          matriz = [...matriz, eixoVazio];
          id++;
        }
      }
    }

    const posStep = matriz.length;
    matriz[posStep] = {Id: posStep+1, Step: true, PosicaoPneus: []} as IEixo;

    for(var J = 0; J < chassi[`EixoZ`].length; J++){
      if(chassi[`EixoZ`][J] == '1'){
        pos= {
          Pneu: null,
          Posicao: 'STEP' + `${J+1}`,
          Eixo: 'Z',
          Rodado: `${J+1}`,
        };
      }else{
        pos= posVazio;
      }
      
      matriz[posStep].PosicaoPneus = [...matriz[posStep].PosicaoPneus, pos] as IPosicaoPneu[];
    }
   
    return matriz;
  }

  async function alocarPneusMatriz(matriz: IEixo[], lista: IPneu[]): Promise<IEixo[]> {
    //achar os pneus na matriz e inseri-los
    var pneu = {} as IPneu;
    
    for(var I = 0; I < lista.length; I++){
      pneu = lista[I];
      for(var X = 0; X < matriz?.length; X++){
        for(var Y = 0; Y < matriz[X]?.PosicaoPneus.length; Y++){
          if(pneu.Eixo == matriz[X]?.PosicaoPneus[Y].Eixo && pneu.Rodado == matriz[X]?.PosicaoPneus[Y].Rodado){
            matriz[X].PosicaoPneus[Y].Pneu = pneu;
          }
        }
      }
    }

    return matriz
  }

  async function handleSelect(item: IPosicaoPneu) {
    setIsLoading(true);
    if(item?.Pneu?.Id != param.posicao.Pneu.Id){
      item.Bem = bem;
      if (param?.onSelect) {
        param.onSelect(item, param.posicao, param.voltas, param.onGoBack);
      } 
    } else {
      Alert.alert('Aviso', 'Você selecionou a posição atual do pneu que será movimentado.');
    }
    setIsLoading(false);
  }

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={param?.onSelect ? ArrowIosBackIcon : MenuIcon}
      onPress={param?.onSelect ? onCancelarButtonPress : navigation.toggleDrawer} />
  );

  const onCancelarButtonPress = (): void => {
    if(isLoading == false){
        setIsLoading(true);
        navigation && navigation.goBack();
    }
};

  return (
    <>
      <TopNavigation
        title={'SELECIONE UMA POSIÇÃO'}
        accessoryLeft={renderBackAction} />

      <Divider />

      <Loader 
        loading={isLoading} />

      <KeyboardAvoidingView 
        style={styles.container}>
        <Layout>
          <View
            style={styles.itemContainer} >
            <BemCard
              data={bem}
              onFindPress={handleFindBem} 
              onLancarContadorPress={handleLancarContador} /> 
          </View>
        </Layout>    
            
        <ChassiEixo
          destino={true}
          ult={matriz?.length-1}
          data={matriz}
          onHandleSelect={handleSelect}
          onHandleSelectVazio={null}
          pneuSelecionado={param.posicao.Pneu}/> 
   
      </KeyboardAvoidingView> 
    </>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  form: {
    paddingHorizontal: 4,
    paddingVertical: 24,
  },
  itemContainer: {
    marginBottom: 4,
    marginHorizontal: 8,
  },
  select: {
    marginTop: 8,
    marginBottom: 8,
  },  
  footer: {
    marginHorizontal: 4,
    marginVertical: 4,
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
  button: {
    marginHorizontal: 16,
    marginTop: 12,
  },
});

