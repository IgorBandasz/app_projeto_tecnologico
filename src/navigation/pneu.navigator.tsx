import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { PneuScreen } from '../scenes/pneu/list.component';
import { PneuAddScreen } from '../scenes/pneu/add.component';
import { PneuEditScreen } from '../scenes/pneu/edit.component';
import { PneuViewScreen } from '../scenes/pneu/view.component';
import { BemScreen } from '../scenes/bem/list.component';
import { CentroCustoScreen } from '../scenes/centro-custo/list.component';
import { MedidaScreen } from '../scenes/medida/list.component';
import { ModeloPneuScreen } from '../scenes/modelo-pneu/list.component';
import { DesenhoScreen } from '../scenes/desenho/list.component';
import { FornecedorScreen } from '../scenes/fornecedor/list.component';
import { FabricantePneuScreen } from '../scenes/fabricante-pneu/list.component';
import { ImagemViewScreen } from '../scenes/imagem/view.component';
import { LancamentoContadorAddScreen } from '../scenes/lancamento-contador/add.component';
import { HistoricoPneuScreen } from '../scenes/historico-pneu/historico.component';
import { AfericaoViewScreen } from '../scenes/afericao/view.component';

const HeaderOptions = {
  headerShown: true,
  headerTitle: '',
  headerLeft: null,
  headerStyle: { height: 40 }
};

const Stack = createStackNavigator();

export const PneusNavigator = (): React.ReactElement => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}>
    <Stack.Screen name='PneuList' component={PneuScreen} />
    <Stack.Screen name='PneuAdd' component={PneuAddScreen} />
    <Stack.Screen name='PneuEdit' component={PneuEditScreen} />
    <Stack.Screen name='PneuView' component={PneuViewScreen} />

    <Stack.Screen name='LancamentoContadorAdd' component={LancamentoContadorAddScreen} />

    <Stack.Screen name='ImagemView' component={ImagemViewScreen}/>
    <Stack.Screen name='AfericaoView' component={AfericaoViewScreen} />
    <Stack.Screen name='HistoricoPneu' component={HistoricoPneuScreen} />

    <Stack.Screen name='BemList' component={BemScreen} />
    <Stack.Screen name='CentroCustoList' component={CentroCustoScreen}  />
    <Stack.Screen name='DesenhoList' component={DesenhoScreen}  />
    <Stack.Screen name='MedidaList' component={MedidaScreen}  />
    <Stack.Screen name='ModeloPneuList' component={ModeloPneuScreen}  />
    <Stack.Screen name='FornecedorList' component={FornecedorScreen}  />
    <Stack.Screen name='FabricantePneuList' component={FabricantePneuScreen}  />

  </Stack.Navigator>
);
