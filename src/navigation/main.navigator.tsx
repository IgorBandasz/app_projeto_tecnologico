import React from 'react';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import { AuthNavigator } from './auth.navigator';
import { PneusNavigator } from './pneu.navigator';
import { MainScreen } from '../scenes/main/main.component';
import { AfericoesNavigator } from './afericao.navigator';
import { MovimentacoesPneuNavigator } from './movimentacao-pneu.navigator';

const Stack = createStackNavigator();

export const MainNavigator = (): React.ReactElement => (
    <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName='MainScreen'>

        <Stack.Screen name='Auth'     component={AuthNavigator}/>    
        <Stack.Screen name='MainScreen'     component={MainScreen}/> 
        <Stack.Screen name='Pneu'     component={PneusNavigator}/>
        <Stack.Screen name='Afericao' component={AfericoesNavigator}/>
        <Stack.Screen name='MovimentacaoPneu' component={MovimentacoesPneuNavigator} options={{tabBarLabel: 'Movimentação de Pneu'} as StackNavigationOptions}/>
    </Stack.Navigator>
);
