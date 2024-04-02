import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Keyboard, View } from 'react-native';
import { IndexPath, Button, Card, Divider, Icon, Input, Layout, Select, SelectItem, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';

import Loader from '../../components/Loader';
import { AddIcon, ArrowIosBackIcon, MenuIcon } from '../../components/icons';
import { ModeloPneuList } from './modelo-pneu-list.component';
import { IModeloPneu } from '../../model/modelo-pneu.model';
import ModeloPneuService from '../../services/api-modelo-pneu-service';
import { IFabricantePneu } from '../../model/fabricante-pneu.model';

interface Params { 
  Fabricante: IFabricantePneu;
  onSelect: (Item: IModeloPneu) => void;
}
export default ({ navigation, route }): React.ReactElement => {

  const styles = useStyleSheet(themedStyles);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pesquisa, setPesquisa] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [, setLoadingMore] = useState<boolean>(false);
  const [list, setList] = useState<IModeloPneu[]>([]);
  const [param,] = useState<Params>(route.params as Params);

  const [listPesquisa, setListPesquisa] = useState<string[]>([
    'Pesquisa por nome', 
    'Pesquisa por código interno']);
  const [pesquisaIndex, setPesquisaIndex] = React.useState(new IndexPath(0));
  const pesquisaValue = listPesquisa[pesquisaIndex.row];  

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);
        
        handleFind(false);
        
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

      const nome        = pesquisaIndex.row === 0 ? pesquisa : '';
      const id          = pesquisaIndex.row === 1 ? pesquisa : '';
      
      const idFabricante = param.Fabricante ? param.Fabricante.Id.toString() : '';

      const service = new ModeloPneuService();
      const result = await service.getAll(page, id, nome, idFabricante);

      if(result.status == 200){
        if (page > 1) {
          setList(oldValue => [...oldValue, ...result.data.Data])
        } else {
          setList(result.data.Data);
        }
      }else{
        Alert.alert('Aviso', result.data?.Message);
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

  async function handleSelect(item: IModeloPneu) {
    if(isLoading == false){
      setIsLoading(true);
      if (param?.onSelect) {
        param.onSelect(item);
        navigation.goBack();
      } 
      setIsLoading(false);
    }
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
        title='MODELOS DE PNEU'
        accessoryLeft={renderBackAction} />

      <Divider />

      <Loader 
        loading={isLoading} />

      <Layout >
        <View 
          style={styles.itemContainer} >

          {
            (param?.Fabricante)
             ?
            (<Input
              style={styles.select}
              label='Código do fabricante'
              disabled={true}
              value={`${param.Fabricante.Id}`}/>) 
            : (<></>)
          }

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

      <ModeloPneuList
        data={list}
        onHandleView={handleSelect}
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

