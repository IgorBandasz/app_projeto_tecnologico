import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Keyboard, View } from 'react-native';
import { IndexPath, Button, Card, Divider, Icon, Input, Layout, Select, SelectItem, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';

import Loader from '../../components/Loader';
import { AddIcon, ArrowIosBackIcon, MenuIcon } from '../../components/icons';
import { AfericaoList } from './afericao-list.component';
import { IAfericao } from '../../model/afericao.model';
import AfericaoService from '../../services/api-afericao-service';
import { IPermissao } from '../../model/usuario-model';
import { AppStorage } from '../../services/app-storage.service';

interface Params { 
  onSelect: (Item: IAfericao) => void;
}
export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pesquisa, setPesquisa] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [, setLoadingMore] = useState<boolean>(false);
  const [list, setList] = useState<IAfericao[]>([]);
  const [param,] = useState<Params>(route.params as Params);
  const [permissao, setPermissao] = React.useState<IPermissao>({} as IPermissao);

  const [listPesquisa, setListPesquisa] = useState<string[]>([
    'Pesquisa por número de fogo']);
  const [pesquisaIndex, setPesquisaIndex] = React.useState(new IndexPath(0));
  const pesquisaValue = listPesquisa[pesquisaIndex.row];  

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const user = await AppStorage.getUsuario();
        setPermissao(user.Permissao)

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

      const service = new AfericaoService();
      const result = await service.getAll(page, pesquisa, '');
      
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

  /*async function handleAdd() {
    navigation.navigate('AfericaoAdd');
  }*/

  async function handleSelect(item: IAfericao) {
    if(isLoading == false){
      setIsLoading(true);
      if (param?.onSelect) {
        param.onSelect(item);
        navigation.goBack();
      } else {
        navigation.navigate('AfericaoView', { data: item });
      }
      setIsLoading(false);
    }
  }

  async function handleDelete(item: IAfericao) {
    try {
      setIsLoading(true);

      const service = new AfericaoService();
      const result = await service.delete(item.Id);

      if (result.status === 200) {
        
        Alert.alert('Sucesso', `Aferição removida com sucesso. Id: ${item.Id}`, [
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

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={onCancelarButtonPress} />
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
        title={param?.onSelect ? 'SELECIONE UMA AFERIÇÃO' : 'AFERIÇÕES'}
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

      <AfericaoList
        data={list}
        onViewPress={handleSelect}
        onDeletePress={permissao?.AfericaoPneu ? handleDelete : null}
        ListFooterComponent={(list && list.length > 0) && renderFooter}
        onHandleFindMore={handleFindMore} />
    </>
  );
};

const themedStyles = StyleService.create({
  itemContainer: {
    marginVertical: 8,
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
});

