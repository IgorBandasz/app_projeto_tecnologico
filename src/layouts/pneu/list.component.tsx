import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Keyboard, View } from 'react-native';
import { IndexPath, Button, Card, Divider, Icon, Input, Layout, Select, SelectItem, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';

import Loader from '../../components/Loader';
import { AddIcon, ArrowIosBackIcon, MenuIcon } from '../../components/icons';
import { PneuList } from './pneu-list.component';
import { IPneu } from '../../model/pneu.model';
import PneuService from '../../services/api-pneu-service';
import { AppStorage } from '../../services/app-storage.service';
import { IFilial } from '../../model/filial.model';
import { IPermissao } from '../../model/usuario-model';

interface Params {
  estoque?: boolean; 
  onSelect: (Item: IPneu, voltas: number, onGoBack:()=> void) => void;
  voltas?: number;
  afericao?: boolean;
}
export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pesquisa, setPesquisa] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [, setLoadingMore] = useState<boolean>(false);
  const [list, setList] = useState<IPneu[]>([]);
  const [filial, setFilial] = useState<IFilial>({}as IFilial);
  const [permissao, setPermissao] = useState<IPermissao>({}as IPermissao);
  const [param,] = useState<Params>(route.params as Params);

  const [listPesquisa, setListPesquisa] = useState<string[]>([
    'Pesquisa por número de fogo', 
    'Pesquisa por código interno', 
    'Pesquisa por frota', 
    'Pesquisa por placa']);
  const [pesquisaIndex, setPesquisaIndex] = React.useState(new IndexPath(0));
  const pesquisaValue = listPesquisa[pesquisaIndex.row];  

  const [listDisponibilidade, setListDisponibilidade] = useState<string[]>([
    'Todos os Pneus', 
    'Somente em Bem', 
    'Somente em Estoque', 
    'Somente em Sucata',
    'Somente em Recapagem',
    'Somente em Venda',
    'Somente em Conserto']);
  const [disponibilidadeIndex, setDisponibilidadeIndex] = React.useState(new IndexPath(0));
  const disponibilidadeValue = listDisponibilidade[disponibilidadeIndex.row];

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);
        
        const filial = await AppStorage.getFilial();
        setFilial(filial);

        const usuario = await AppStorage.getUsuario();
        setPermissao(usuario.Permissao);
        
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        Alert.alert(error);
      }
    }

    handleLoad();
  }, []);  

  async function handleFind(more: boolean) {
    try {
      setIsLoading(true);
      if (!more)
        setPage(1);

      const disponibilidade = disponibilidadeIndex.row != 0 ? `${disponibilidadeIndex.row - 1}` : "";   //param?.estoque ? '1' : '';
      const centroAtivo = '1'    //= param?.estoque ? '1' : '';

      const numeroFogo = pesquisaIndex.row === 0 ? pesquisa : '';
      const id         = pesquisaIndex.row === 1 ? pesquisa : '';
      const frota      = pesquisaIndex.row === 2 ? pesquisa : '';
      const placa      = pesquisaIndex.row === 3 ? pesquisa.replace(/[^a-zA-Z0-9]/g, '').replace(/^(\D{3})(\d)/g, "$1 $2") : '';
      
      const service = new PneuService();
      const result = await service.getAll(page, filial.Id.toString(), disponibilidade, centroAtivo, numeroFogo, id, frota, placa, param?.afericao);
      
      console.log(result)
      if (result.status == 200){
        if (page > 1) {
          setList(oldValue => [...oldValue, ...result.data.Data])
        } else {
          setList(result.data.Data);
        }
      }else {
        Alert.alert('Aviso', result.data?.Message)
      }

      setIsLoading(false);
      setLoadingMore(false);
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      Alert.alert(`Ocorreu um erro ao efetuar o filtro`);
    }
  }

  function handleFindMore(distance: number) {
    if (distance < 1)
      return;

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    handleFind(true);
  }

  async function handleAdd() {
    if (permissao.AlterarPneu == true){
      navigation.navigate('PneuAdd');
    }else{
      Alert.alert('Aviso', 'Usuário sem permissão para cadastrar pneu.');
    }
  }

  async function handleEdit(item: IPneu) {
    if (permissao.AlterarPneu == true){
      navigation.navigate('PneuEdit', { 
        data: item,
        voltas: 1 
      });
    }else{
      Alert.alert('Aviso', 'Usuário sem permissão para alterar pneu.');
    }
  }

  async function onDeletePress(item: IPneu) {
    if (permissao.ExcluirPneu == true){
      if (isLoading == false){
        Alert.alert('Excluir', 'Deseja excluir o pneu desejado?', [{text:'Sim',onPress: ()=>{handleDelete(item)}}, {text:'Não',onPress: ()=>{}}]);
      }
    }else{
      Alert.alert('Aviso', 'Usuário sem permissão para alterar pneu.');
    }
  }
  async function handleDelete(item: IPneu) {
    
    try {
      setIsLoading(true);

      const service = new PneuService();
      const result = await service.delete(item.Id);

      if (result.status === 200) {
        
        Alert.alert('Sucesso', `Pneu removido com sucesso. Id: ${item.Id}`, [
          { text: 'Ok', onPress: () => { handleFind(false) }, }],
          { cancelable: false },
        );
        
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

  async function handleSelect(item: IPneu) {
    if(isLoading == false){
      setIsLoading(true);
      if (param?.onSelect) {
        var voltas: number;
        param.voltas ? voltas = param.voltas + 1 : voltas = 1;
        
        param.onSelect(item, voltas, refresh);
      } else {
        navigation.navigate('PneuView', { data: item });
      }
      setIsLoading(false);
    }
  }

  async function refresh() {
    await handleFind(false)
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

  const renderIconFilter = (props): ReactElement => (
    <TouchableWithoutFeedback onPress={() => handleFind(false)}>
      <Icon {...props} name='funnel' />
    </TouchableWithoutFeedback>
  );

  const renderFooter = (): React.ReactElement => (
    <Card style={styles.footer}>
      <Text>Exibindo {list.length} registro(s)</Text>
    </Card>
  );

  return (
    <>
      <TopNavigation
        title={param?.onSelect ? 'SELECIONE UM PNEU' : 'PNEUS'}
        accessoryLeft={renderBackAction} />
        

      <Divider />

      <Loader 
        loading={isLoading} />

      <Layout >
        <View 
          style={styles.itemContainer} >

          <Select
            style={styles.select} 
            placeholder='Selecione a pesquisa'
            value={disponibilidadeValue}
            selectedIndex={disponibilidadeIndex}
            onSelect={index => setDisponibilidadeIndex(index as IndexPath)} >
            {
              listDisponibilidade.map((item, index) => (
                <SelectItem title={item} key={index} />
              ))
            }
          </Select>

          <Select
            style={styles.select}
            placeholder='Selecione a pesquisa'
            value={pesquisaValue}
            selectedIndex={pesquisaIndex}
            onSelect={index => setPesquisaIndex(index as IndexPath)} >
            {
              listPesquisa.map((item, index) => (
                <SelectItem title={item} key={index} />
              ))
            }
          </Select>

          <Input
            returnKeyType = {'search'}
            onSubmitEditing={() => { handleFind(false); }}
            placeholder='Informe a pesquisa'
            onChangeText={(pesquisa) => setPesquisa(pesquisa)}
            accessoryRight={renderIconFilter} />
            
        </View>
      </Layout>

      <PneuList
        data={list}
        onViewPress={handleSelect}
        onEditPress={handleEdit}
        onDeletePress={onDeletePress}
        ListFooterComponent={(list && list.length > 0) && renderFooter}
        onHandleFindMore={handleFindMore} />

      {
        param?.onSelect === undefined &&
          <Button
            style={styles.buttonFloat}
            status='success'
            size='giant'
            onPress={handleAdd}
            accessoryRight={AddIcon} />
      }
      
    </>
  );
};

const themedStyles = StyleService.create({
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  select: {
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
});

