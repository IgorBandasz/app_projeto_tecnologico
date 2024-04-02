import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginScreen } from '../scenes/login/login.component';
import { ConfiguracaoScreen } from '../scenes/configuracao/configuracao.component';

const Stack = createStackNavigator();

export const AuthNavigator = (): React.ReactElement => (
    <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Configuracao' component={ConfiguracaoScreen} />
    </Stack.Navigator>
);
