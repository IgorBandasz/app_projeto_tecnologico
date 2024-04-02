import React from 'react';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import { PneuScreen } from '../scenes/pneu/list.component';
import { AfericaoAddScreen } from '../scenes/afericao/add.component';
import { AfericaoScreen } from '../scenes/afericao/option.component';
import { AfericaoViewScreen } from '../scenes/afericao/view.component';
import { AfericaoListScreen } from '../scenes/afericao/list.component';
import { ChassiScreen } from '../scenes/chassi/chassi-list.component';
import { BemScreen } from '../scenes/bem/list.component';
import { AfericaoEditScreen } from '../scenes/afericao/edit.component';
import { ImagemViewScreen } from '../scenes/imagem/view.component';
import { LancamentoContadorAddScreen } from '../scenes/lancamento-contador/add.component';
import { View } from 'react-native';
import { Text } from '@ui-kitten/components';

const Header = (): React.ReactElement => (
  <View style={
    {position: 'relative', 
    justifyContent: 'center',
    alignItems: 'center', 
    height: 30,}}>
    <Text category='s1' style={{textAlign: 'center'}}>Aferição</Text>
  </View>
);

const HeaderOptions = {
  headerShown: true,
  header: Header,
} as StackNavigationOptions;

const Stack = createStackNavigator();

export const AfericoesNavigator = (): React.ReactElement => (
  <Stack.Navigator
    initialRouteName='AfericaoOption'
    screenOptions={{ headerShown: false }}>
    <Stack.Screen name='AfericaoOption' component={AfericaoScreen} />
    <Stack.Screen name='AfericaoAdd' component={AfericaoAddScreen} />
    <Stack.Screen name='AfericaoEdit' component={AfericaoEditScreen} />
    <Stack.Screen name='AfericaoView' component={AfericaoViewScreen} />
    <Stack.Screen name='AfericaoList' component={AfericaoListScreen} />

    <Stack.Screen name='LancamentoContadorAdd' component={LancamentoContadorAddScreen} />

    <Stack.Screen name='PneuList' component={PneuScreen} options={HeaderOptions}/>
    <Stack.Screen name='ChassiList' component={ChassiScreen} options={HeaderOptions}/>
    <Stack.Screen name='BemList' component={BemScreen} options={HeaderOptions}/>
    <Stack.Screen name='ImagemView' component={ImagemViewScreen} />
  </Stack.Navigator>
);
