import React from 'react';
import ContentView from '../../layouts/bem/list.component';

export const BemScreen = ({ navigation, route }): React.ReactElement => (
  <ContentView navigation={navigation} route={route}/>
);