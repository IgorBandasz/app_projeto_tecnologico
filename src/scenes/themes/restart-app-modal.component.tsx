import React from 'react';
import { Button, Layout, Modal, ModalProps, StyleService, Text, useStyleSheet } from '@ui-kitten/components';

interface RestartAppModalProps extends Omit<ModalProps, 'children'> {
  onGotItButtonPress: () => void;
}

export const RestartAppModal = (props: RestartAppModalProps): React.ReactElement => {

  const styles = useStyleSheet(themedStyles);
  const { onGotItButtonPress, ...modalProps } = props;

  return (
    <Modal
      backdropStyle={styles.backdrop}
      {...modalProps}>
      <Layout style={styles.container}>
        <Text category='h4'>
          Reiniciar
        </Text>
        <Text
          style={styles.description}
          appearance='hint'
          category='s1'>
          Reinicie o aplicativo para alternar o Design System
        </Text>
        <Button
          onPress={onGotItButtonPress}>
          OK
        </Button>
      </Layout>
    </Modal>
  );
};

const themedStyles = StyleService.create({
  container: {
    borderRadius: 4,
    padding: 16,
    width: 320,
  },
  description: {
    marginTop: 8,
    marginBottom: 24,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
