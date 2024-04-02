import React from 'react';
import ContentView from '../../layouts/desenho/list.component';

export const DesenhoScreen = ({ navigation, route }): React.ReactElement => (
  <ContentView navigation={navigation} route={route}/>
);