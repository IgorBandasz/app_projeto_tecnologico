import React from 'react';
import { Divider, StyleService, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { MenuIcon } from '../../components/icons';

export const MainScreen = (props): React.ReactElement => {

  const styles = useStyleSheet(themedStyles);

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer} />
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>

      <TopNavigation
        title='PNEU'
        accessoryLeft={renderDrawerAction} />

      <Divider />

    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
});
