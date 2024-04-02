import React from 'react';
import { LogBox } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import { MainNavigator } from './main.navigator';
import { HomeDrawer } from '../scenes/home/home-drawer.component';
import { LoginScreen } from '../scenes/login/login.component';
import { ConfiguracaoScreen } from '../scenes/configuracao/configuracao.component';
import { ThemesScreen } from '../scenes/themes/themes.component';
import { FilialScreen } from '../scenes/filial/list.component';

const HeaderOptions = {
    headerShown: true,
    headerTitle: '',
    headerLeft: null,
    headerStyle: { height: 40 }
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const StackApp = createStackNavigator();

const HomeTabsNavigator = (): React.ReactElement => (
    <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName='Main' >
        <Stack.Screen name='Main' component={MainNavigator} />
    </Stack.Navigator>
);

const HomeNavigatorDrawer = (): React.ReactElement => (
    <Drawer.Navigator
        screenOptions={{ headerShown: false }}
        drawerContent={props => <HomeDrawer {...props} />}>
        <Drawer.Screen name='HomeTab' component={HomeTabsNavigator} />
    </Drawer.Navigator>
);

export const HomeNavigator = (): React.ReactElement => (
    <StackApp.Navigator
        initialRouteName='Login'
        screenOptions={{ headerShown: false, gestureEnabled: false }} >
        <StackApp.Screen name='Login' component={LoginScreen} />
        <StackApp.Screen name='Home' component={HomeNavigatorDrawer} />
        <StackApp.Screen name='FilialList' component={FilialScreen} />
        <StackApp.Screen name='Configuracao' component={ConfiguracaoScreen}/>
        <StackApp.Screen name='Tema' component={ThemesScreen} />
    </StackApp.Navigator>
);

LogBox.ignoreLogs(['Accessing the \'state\'']);
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);