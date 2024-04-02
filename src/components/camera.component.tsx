import React, { useRef, useState } from 'react';
import { Text, View, Modal } from 'react-native';
import { Button, StyleService, useStyleSheet } from '@ui-kitten/components';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';

import { SafeAreaLayout } from './safe-area-layout.component';
import { IArquivo } from '../model/imagem.model';

export interface PropsCamera {
    onHandleSelect?: (arquivo: IArquivo) => void;
}

const Camera = (props: PropsCamera) => {
    const styles = useStyleSheet(themedStyles);

    const camera = useRef(null);;
    const [visible, setVisible] = useState(false);
    const [zoom, setZoom] = useState<number>(0);
    const [isRecording, setIsRecording] = useState(false);

    function zoomOut() {
        setZoom(zoom - 0.1 < 0 ? 0 : zoom - 0.1);
    }

    function zoomIn() {
        setZoom(zoom + 0.1 > 1 ? 1 : zoom + 0.1,);
    }

    async function cancel() {
        await camera.current.resumePreview();
        props.onHandleSelect({} as IArquivo)
        setVisible(false);
    }

    async function takePicture() {
        if (camera) {
            const data = await camera.current.takePictureAsync({
                quality: 0.5,
            });

            let size = 0;
            await RNFS.stat(data.uri).then(async (res) => { size = Number(res.size); });

            props.onHandleSelect({
                Descricao: '',
                Tipo: 'image',
                Uri: data.uri,
                Base64: '',
                Tamanho: size,
                Ext: '.jpg',
            });
            setVisible(false);
        }
    }

    async function takeVideo() {
        if (camera && !isRecording) {
            try {
                const promise = camera.current.recordAsync({
                    mute: false,
                    maxFileSize: 11 * 1024 * 1024, //10mega
                    videoBitrate: 300*1000, //5*1000*1000 - 5mb
                    quality: RNCamera.Constants.VideoQuality['4:3'],
                });

                if (promise) {
                    setIsRecording(true);
                    const data = await promise;

                    let size = 0;
                    await RNFS.stat(data.uri).then(async (res) => { size = Number(res.size); });

                    props.onHandleSelect({
                        Descricao: '',
                        Tipo: 'video',
                        Uri: data.uri,
                        Base64: '',
                        Tamanho: size,
                        Ext: '.mp4',
                    });
                    setVisible(false);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    async function stopVideo() {
        await camera.current.stopRecording();
        setIsRecording(false);
    };

    function renderRecording() {
        const action = isRecording ? stopVideo : takeVideo;
        return (
            <Button
                style={styles.button}
                status={isRecording ? 'danger' : 'success'}
                onPress={() => action()} >
                {isRecording ? 'Parar' : 'Gravar'}
            </Button>
        );
    }

    const renderCamera = (): React.ReactElement => {
        return (
            <SafeAreaLayout
                style={styles.container}>

                <RNCamera
                    ref={camera}
                    style={{ flex: 1 }}
                    type='back'
                    flashMode='off'
                    autoFocus='on'
                    zoom={zoom}
                    whiteBalance='auto'
                    ratio='16:9'
                    focusDepth={0}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }} >

                    <SafeAreaLayout
                        style={styles.container}>

                        <View
                            style={styles.containerButtonZoom}>

                            <Button status='basic' style={{ backgroundColor: 'transparent' }} onPress={zoomIn.bind(this)} > + </Button>
                            <Button status='basic' style={{ backgroundColor: 'transparent', marginLeft: 8 }} onPress={zoomOut.bind(this)} > - </Button>
                            {zoom !== 0 && <Text style={styles.zoomText}>Zoom: {zoom}</Text>}

                        </View>

                    </SafeAreaLayout>

                    <View
                        style={styles.containerButton}>

                        {renderRecording()}

                        <Button
                            disabled={isRecording}
                            style={styles.button}
                            status='success'
                            onPress={takePicture.bind(this)} >
                            Foto
                        </Button>

                        <Button
                            disabled={isRecording}
                            style={styles.button}
                            onPress={() => cancel()}
                            status='danger' >
                            Cancelar
                        </Button>
                    </View>
                </RNCamera>




            </SafeAreaLayout>
        );
    }

    async function open() {
        if (camera.current)
            await camera.current.resumePreview();
        setVisible(true)
    }

    return (
        <>
            <Modal visible={visible}>
                {renderCamera()}
            </Modal>

            <Button
                style={styles.buttonNew}
                onPress={open}
                status='info' >
                Foto/Vídeo
            </Button>
        </>
    )
}

export default Camera;

const themedStyles = StyleService.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    containerButton: {
        marginHorizontal: 8,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
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
    zoomText: {
        color: 'white',
        fontSize: 15,
        left: 20,
        top: 12,
    },
});