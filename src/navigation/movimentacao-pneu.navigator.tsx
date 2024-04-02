import React from 'react';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { PneuScreen } from '../scenes/pneu/list.component';
import { ChassiScreen } from '../scenes/chassi/chassi-list.component';
import { BemScreen } from '../scenes/bem/list.component';
import { MovimentacaoPneuScreen } from '../scenes/movimentacao-pneu/option.component';
import { MovimentacaoPneuAcaoScreen } from '../scenes/movimentacao-pneu/acao.component';
import { MovEstoqueAddScreen } from '../scenes/mov-estoque/add.component';
import { MovSucataAddScreen } from '../scenes/mov-sucata/add.component';
import { MovVendaAddScreen } from '../scenes/mov-venda/add.component';
import { ConsertoPneuAddScreen } from '../scenes/conserto-pneu/add.component';
import { RecapagemPneuAddScreen } from '../scenes/recapagem-pneu/add.component';
import { MotivoScreen } from '../scenes/motivo/list.component';
import { FornecedorScreen } from '../scenes/fornecedor/list.component';
import { TipoConsertoScreen } from '../scenes/tipo-conserto/list.component';
import { CentroCustoScreen } from '../scenes/centro-custo/list.component';
import { MovSucataEditScreen } from '../scenes/mov-sucata/edit.component';
import { ConsertoPneuEditScreen } from '../scenes/conserto-pneu/edit.component';
import { RecapagemPneuEditScreen } from '../scenes/recapagem-pneu/edit.component';
import { MovVendaEditScreen } from '../scenes/mov-venda/edit.component';
import { RecapagemPneuServicoAddScreen } from '../scenes/recapagem-pneu/servico/add.component';
import { ConsertoPneuServicoAddScreen } from '../scenes/conserto-pneu/servico/add.component';
import { MovimentacaoPneuAcaoOcupadoScreen } from '../scenes/movimentacao-pneu/acao-ocupado.component';
import { ImagemViewScreen } from '../scenes/imagem/view.component';
import { ChassiDestinoScreen } from '../scenes/chassi/chassi-destino-list.component';
import { MovEstoqueEditScreen } from '../scenes/mov-estoque/edit.component';
import { DesenhoScreen } from '../scenes/desenho/list.component';
import { RecapagemPneuServicoViewScreen } from '../scenes/recapagem-pneu/servico/view.component';
import { ConsertoPneuServicoViewScreen } from '../scenes/conserto-pneu/servico/view.component';
import { LancamentoContadorAddScreen } from '../scenes/lancamento-contador/add.component';
import { Text } from '@ui-kitten/components';
import { View } from 'react-native';
import { PneuViewScreen } from '../scenes/pneu/view.component';
import { HistoricoPneuScreen } from '../scenes/historico-pneu/historico.component';

const Header = (): React.ReactElement => (
  <View style={
    {position: 'relative', 
    justifyContent: 'center',
    alignItems: 'center', 
    height: 30,}}>
    <Text category='s1' style={{textAlign: 'center'}}>Movimentação de Pneu</Text>
  </View>
);

const HeaderOptions = {
  headerShown: true,
  header: Header,
} as StackNavigationOptions;

const Stack = createStackNavigator();

export const MovimentacoesPneuNavigator = (): React.ReactElement => (
  <Stack.Navigator
    initialRouteName='MovimentacaoPneuOption'
    screenOptions={{ headerShown: false }}>
    <Stack.Screen name='MovimentacaoPneuOption' component={MovimentacaoPneuScreen} />
    <Stack.Screen name='MovimentacaoPneuAcao' component={MovimentacaoPneuAcaoScreen} options={HeaderOptions}/>
    <Stack.Screen name='MovimentacaoPneuAcaoOcupado' component={MovimentacaoPneuAcaoOcupadoScreen} options={HeaderOptions}/>
    
    <Stack.Screen name='PneuList' component={PneuScreen} options={HeaderOptions}/>
    <Stack.Screen name='ChassiList' component={ChassiScreen} options={HeaderOptions}/>
    <Stack.Screen name='ChassiDestinoList' component={ChassiDestinoScreen} options={HeaderOptions}/>
    <Stack.Screen name='BemList' component={BemScreen} options={HeaderOptions}/>

    <Stack.Screen name='MovEstoqueAdd' component={MovEstoqueAddScreen} />
    <Stack.Screen name='MovEstoqueEdit' component={MovEstoqueEditScreen} />

    <Stack.Screen name='MovSucataAdd' component={MovSucataAddScreen} />
    <Stack.Screen name='MovSucataEdit' component={MovSucataEditScreen}/>

    <Stack.Screen name='MovVendaAdd' component={MovVendaAddScreen} />
    <Stack.Screen name='MovVendaEdit' component={MovVendaEditScreen} />

    <Stack.Screen name='ConsertoPneuAdd' component={ConsertoPneuAddScreen} />
    <Stack.Screen name='ConsertoPneuEdit' component={ConsertoPneuEditScreen} />
    <Stack.Screen name='ConsertoPneuServicoAdd' component={ConsertoPneuServicoAddScreen} />
    <Stack.Screen name='ConsertoPneuServicoView' component={ConsertoPneuServicoViewScreen} />

    <Stack.Screen name='RecapagemPneuAdd' component={RecapagemPneuAddScreen} />
    <Stack.Screen name='RecapagemPneuEdit' component={RecapagemPneuEditScreen} />
    <Stack.Screen name='RecapagemPneuServicoAdd' component={RecapagemPneuServicoAddScreen} />
    <Stack.Screen name='RecapagemPneuServicoView' component={RecapagemPneuServicoViewScreen} />

    <Stack.Screen name='LancamentoContadorAdd' component={LancamentoContadorAddScreen} options={HeaderOptions}/>

    <Stack.Screen name='MotivoList' component={MotivoScreen} />
    <Stack.Screen name='CentroCustoList' component={CentroCustoScreen} />
    <Stack.Screen name='FornecedorList' component={FornecedorScreen} />
    <Stack.Screen name='TipoConsertoList' component={TipoConsertoScreen} />
    <Stack.Screen name='DesenhoList' component={DesenhoScreen}  />
    <Stack.Screen name='ImagemView' component={ImagemViewScreen} />
    <Stack.Screen name='PneuView' component={PneuViewScreen} />
    <Stack.Screen name='HistoricoPneu' component={HistoricoPneuScreen} />
  </Stack.Navigator>
);
