import React from 'react';
import ContentView from '../../layouts/chassi/chassi-list.component';

export const ChassiScreen = ({ navigation, route }): React.ReactElement => (
  <ContentView navigation={navigation} route={route}/>
);