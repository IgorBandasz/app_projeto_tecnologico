import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Avatar, Divider, Drawer, DrawerItem, DrawerElement, Layout, Text, IndexPath, StyleService, useStyleSheet } from '@ui-kitten/components';

import { HomeIcon, ConfiguracaoIcon, SiteIcon, TemaIcon, LogOutIcon, AfericaoIcon, MovimentacaoPneuIcon } from '../../components/icons';
import { PneuIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { WebBrowserService } from '../../services/web-browser.service';
import { AppInfoService } from '../../services/app-info.service';
import { AppStorage } from '../../services/app-storage.service';
import { IUsuario } from '../../model/usuario-model';
import { IFilial } from '../../model/filial.model';

export const HomeDrawer = ({ navigation }): DrawerElement => {

  const styles = useStyleSheet(themedStyles);

  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [usuario, setUsuario] = React.useState<IUsuario>({} as IUsuario);
  const [filial, setFilial] = React.useState<IFilial>({} as IFilial);

  useEffect(() => {
    async function handleLoad() {
      try {
        setIsLoading(true);

        const user = await AppStorage.getUsuario();
        setUsuario(user);

        const company = await AppStorage.getFilial();
        setFilial(company);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }

    handleLoad();
  }, []);

  const DATA = [
    {
      title: 'Home',
      icon: HomeIcon,
      onPress: () => {
        navigation.toggleDrawer();
        navigation.navigate('MainScreen');
      },
    },
    usuario.Permissao?.AcessarPneu && {
      title: 'Pneus',
      icon: PneuIcon,
      onPress: () => {
        navigation.toggleDrawer();
        navigation.navigate('Pneu');
      },
    },
    usuario.Permissao?.AfericaoPneu && {
      title: 'Aferição',
      icon: AfericaoIcon,
      onPress: () => {
        navigation.toggleDrawer();
        navigation.navigate('Afericao');
      },
    },
    usuario.Permissao?.MovimentacaoPneu &&{
      title: 'Movimentação de Pneu',
      icon: MovimentacaoPneuIcon,
      onPress: () => {
        navigation.toggleDrawer();
        navigation.navigate('MovimentacaoPneu');
      },
    },
  ];

  const DATA_FOOTER = [
    {
      title: 'Configuração',
      icon: ConfiguracaoIcon,
      onPress: () => {
        navigation.toggleDrawer();
        navigation.navigate('Configuracao');
      },
    },
    {
      title: 'Temas',
      icon: TemaIcon,
      onPress: () => {
        navigation.toggleDrawer();
        navigation.navigate('Tema');
      },
    },
    {
      title: 'Visite o Site',
      icon: SiteIcon,
      onPress: () => {
        WebBrowserService.openBrowserAsync('https://www.anexotecnologia.com.br');
        navigation.toggleDrawer();
      },
    },
    {
      title: 'Sair',
      icon: LogOutIcon,
      onPress: () => {
        navigation.toggleDrawer();
        Alert.alert('Sair', 'Deseja realmente sair?', [
          { text: 'SAIR', onPress: () => { navigation.navigate('Login'); } },
          { text: 'Cancelar', onPress: () => { return null; } } ], 
          { cancelable: false },
        );
      },
    },
  ];

  const renderHeader = (): ReactElement => (
    <SafeAreaLayout insets='top' level='2'>
      <Layout style={styles.header} level='2'>
        <View style={styles.profileContainer}>
          <Avatar
            size='giant'
            source={require('../../assets/images/image-app-icon.png')}
          />
          <View style={styles.profileInfoContainer}>
            <Text style={styles.profileName} category='s1'>
              {isLoading ? '...' : filial.Nome}
            </Text>
            <Text style={styles.profileName} category='s2'>
              {isLoading ? '...' : usuario.Nome}
            </Text>
          </View>
        </View>
      </Layout>
    </SafeAreaLayout>
  );

  const renderFooter = () => (
    <SafeAreaLayout insets='bottom'>
      <React.Fragment>
        <Divider />
        <View style={styles.footer}>
          <Text
            appearance='hint'
            category='s2'>
            {`versão ${AppInfoService.getVersion()}`}
          </Text>
        </View>
      </React.Fragment>
    </SafeAreaLayout>
  );

  return (
    <>
    <View
      style={styles.container}>
    <Drawer
      header={renderHeader}
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index)}
    >
      {DATA.map((el, index) => (
        <DrawerItem
          key={index}
          title={el?.title}
          onPress={el?.onPress}
          accessoryLeft={el?.icon}
        />
      ))}
    </Drawer>

    <Drawer
      style={{flexDirection: 'column-reverse'}}
      footer={renderFooter}
      //selectedIndex={selectedIndex}
      //onSelect={(index) => setSelectedIndex(index)}
    >
      {DATA_FOOTER.map((el, index) => (
        <DrawerItem
          key={index+4}
          title={el?.title}
          onPress={el?.onPress}
          accessoryLeft={el?.icon}
        />
      ))}
    </Drawer>
    </View>
    </>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 100,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 4,
    marginLeft: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfoContainer: {
    flexDirection: 'column',
    width: '90%',
  },
  profileName: {
    marginHorizontal: 16,
  },
  container: {
    flex: 1,
    //alignItems: "flex-end",
    justifyContent: "flex-end",
    flexDirection: 'column',
  }
});
