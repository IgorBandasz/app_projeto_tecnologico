import React from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import { StyleService, Text, useStyleSheet } from '@ui-kitten/components';

const Loader = (props) => {
    const styles = useStyleSheet(themedStyles);
    const { loading, progress, ...attributes } = props;

    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={loading} >

            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator
                        animating={true}
                        color='#000000'
                        size='large'
                        style={styles.activityIndicator} />
                    {
                        progress &&
                        <View style={styles.text}>
                            <Text >
                                {progress}%
                            </Text>
                        </View>
                    }
                </View>
            </View>
        </Modal>
    );
};

export default Loader;

const themedStyles = StyleService.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 120,
        width: 120,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
    text: {
        padding: 8,
    },
});
