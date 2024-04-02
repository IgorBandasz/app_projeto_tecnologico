import React, { useEffect, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { Card, Divider, StyleService, Text, TopNavigation, useStyleSheet } from '@ui-kitten/components';

import Loader from '../../components/Loader';
import { FilialList } from './filial-list.component';
import { IFilial } from '../../model/filial.model';
import { AppStorage } from '../../services/app-storage.service';
import FilialService from '../../services/api-filial-service';

interface Params {
  onSelect: (Item: IFilial) => void;
}

export default ({ navigation, route }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [, setLoadingMore] = useState<boolean>(false);
  const [list, setList] = useState<IFilial[]>([]);
  const [param,] = useState<Params>(route.params as Params);

  useEffect(() => {
    async function handleLoad() {
      try {
        handleFind(false);
      } catch (error) {
        console.error(error);
      }
    }

    handleLoad();
  }, []);

  useEffect(() => {
    if (list.length === 1){
      handleSelect(list[0]);
    }
  }, [list]);

  async function handleFind(more: boolean) {
    try {
      setIsLoading(true);
      if (!more)
        setPage(1);

      const service = new FilialService();
      const result = await service.getAll();

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
  
  async function handleSelect(item: IFilial) {
    if (param?.onSelect) {
      param.onSelect(item);
      navigation.goBack();
    } else {
      AppStorage.setFilial(item);
      navigation.navigate('Home');
    }
  }
  
  const renderFooter = (): React.ReactElement => (
    <Card style={styles.footer}>
      <Text>Exibindo {list.length} registro(s)</Text>
    </Card>
  );

  return (
    <>
      <TopNavigation 
        title='FILIAIS' />

      <Divider />

      <Loader 
        loading={false} />
      
      <FilialList
        data={list}
        onViewPress={handleSelect}
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
  footer: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
});

