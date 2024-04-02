import React, { useRef, useState } from 'react';
import { View, Modal } from 'react-native';
import { Button, StyleService, useStyleSheet } from '@ui-kitten/components';
import SignatureCapture from 'react-native-signature-capture';
import RNFS from 'react-native-fs';

import { SafeAreaLayout } from './safe-area-layout.component';
import { IArquivo } from '../model/imagem.model';

export interface PropsSignature {
    onHandleSelect?: (arquivo: IArquivo) => void;
}

const Signature = (props: PropsSignature) => {
    const styles = useStyleSheet(themedStyles);

    const signature = useRef(null);
    const [visible, setVisible] = useState(false);

    async function cancel() {
        props.onHandleSelect({} as IArquivo)
        setVisible(false);
    }
    const saveSign = () => {
        signature.current.saveImage();
    };

    const resetSign = () => {
        signature.current.resetImage();
    };

    const _onSaveEvent = async (result) => {
        let size = 0;
        await RNFS.stat(result.pathName).then(async (res) => { size = Number(res.size); });

        props.onHandleSelect({
            Descricao: 'Assinatura: ',
            Uri: result.pathName,
            Base64: result.encoded,
            Tamanho: size,
            Ext: '.png',
        });
        setVisible(false);
    }

    const renderSignature = (): React.ReactElement => {
        return (
            <SafeAreaLayout
                style={styles.container}>

                <SignatureCapture
                    style={[{ flex: 1 }]}
                    ref={signature}
                    onSaveEvent={_onSaveEvent}
                    saveImageFileInExtStorage={true}

                    showNativeButtons={false}
                    viewMode={'portrait'} />

                <View
                    style={styles.containerButton}>

                    <Button
                        style={styles.button}
                        status='success'
                        onPress={saveSign}>
                        Salvar
                    </Button>

                    <Button
                        style={styles.button}
                        status={'warning'}
                        onPress={resetSign} >
                        Reset
                    </Button>

                    <Button
                        style={styles.button}
                        onPress={() => cancel()}
                        status='danger' >
                        Cancelar
                    </Button>
                </View>

            </SafeAreaLayout>
        );
    }

    async function open() {
        setVisible(true)
    }

    return (
        <>
            <Modal visible={visible}>
                {renderSignature()}
            </Modal>

            <Button
                style={styles.buttonNew}
                onPress={open}
                status='info' >
                Assinatura
            </Button>
        </>
    )
}

export default Signature;

const themedStyles = StyleService.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    containerButton: {
        marginHorizontal: 8,
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    containerButtonZoom: {
        flexDirection: 'row',
        alignContent: 'space-between',
        padding: 8,
    },
    buttonNew: {
        marginHorizontal: 12,
        marginTop: 12,
    },
    button: {
        width: '31%',
    },
});