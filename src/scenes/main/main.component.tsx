import React from 'react';
import ContentView from '../../layouts/main/main.component';

export const MainScreen = ({ navigation, route }): React.ReactElement => (
  <ContentView navigation={navigation} route={route}/>
);
