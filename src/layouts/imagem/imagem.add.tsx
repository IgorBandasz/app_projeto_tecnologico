import React, { useState } from 'react'
import { View, Image, Modal } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker';
import { Button, Divider, Input, StyleService, TopNavigation, useStyleSheet } from '@ui-kitten/components';

import { CameraIcon } from '../../components/icons';
import Camera from '../../components/camera.component';
import Signature from '../../components/signature.component';
import { KeyboardAvoidingView } from '../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { IImagem } from '../../model/imagem.model';

export interface PropsCam {
    onHandleSelect: (arquivo: IImagem) => void;
}

const ArquivoAdd = (props: PropsCam) => {

    const styles = useStyleSheet(themedStyles);

    const [visible, setVisible] = useState<boolean>(false);
    const [arquivo, setArquivo] = useState<IImagem>({} as IImagem);

    function newFile() {
        setArquivo({} as IImagem);
        setVisible(true);
    }

    async function clickSelect() {
        props.onHandleSelect(arquivo);
        setVisible(false);
    }

    const openImageLibrary = () => {
        launchImageLibrary({
            //maxHeight: 400,
            //maxWidth: 400,
            quality: 0.5,
            mediaType: 'photo',
        }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setArquivo({
                    Descricao: '',
                    Uri: response.assets[0].uri,
                    Base64: '',
                    Tamanho: response.assets[0].fileSize,
                    Ext: '.jpg',
                });
            }
        });
    }

    function renderFileUri() {
        if (arquivo) {
            return (
                <Image
                    style={styles.image}
                    resizeMode='center'
                    source={{ uri: arquivo.Base64 !== '' ?  `data:image/png;base64,${arquivo.Base64}` : arquivo.Uri }} />
            )
        } else {
            return (
                <Image
                    style={styles.image}
                    source={require('../../assets/images/image-no-image.png')} />
            )
        }
    }

    return (
        <>
            <Modal
                visible={visible}
                style={styles.modal}>

                <TopNavigation
                    title='NOVA IMAGEM' />

                <Divider />

                <KeyboardAvoidingView >
                    <SafeAreaLayout
                        style={styles.form}
                        level='1'>

                        <View 
                            style={styles.imageContainer} >
                            {renderFileUri()}
                        </View>

                        <Camera
                            onHandleSelect={(arquivo) => setArquivo(arquivo)} />
                        <Button
                            style={styles.button}
                            size='medium'
                            status='info'
                            onPress={openImageLibrary} >
                            Abrir a Galeria
                        </Button>

                        <Signature
                            onHandleSelect={(arquivo) => setArquivo(arquivo)} />

                        <Input
                            style={styles.input}
                            multiline={true}
                            numberOfLines={5}
                            textAlignVertical='top'
                            label='Descrição da imagem'
                            placeholder='Informe a Descrição da imagem'
                            value={arquivo.Descricao}
                            //status={formik.errors['DefeitoReclamado'] ? 'danger' : 'info'}
                            //caption={formik.errors['DefeitoReclamado']}
                            onChangeText={text =>
                                setArquivo((prevState) => ({
                                    ...prevState,
                                    Descricao: text
                                }))} />

                        <Divider />

                        <Button
                            disabled={arquivo?.Uri === ''}
                            style={styles.button}
                            size='medium'
                            status='success'
                            onPress={(clickSelect)} >
                            Selecionar
                        </Button>

                        <Button
                            style={styles.buttonLast}
                            size='medium'
                            status='danger'
                            onPress={() => setVisible(!visible)} >
                            Cancelar
                        </Button>

                    </SafeAreaLayout>
                </KeyboardAvoidingView>
            </Modal>

            <Button
                style={{ marginTop: 8 }}
                accessoryLeft={CameraIcon}
                onPress={newFile}
                status='info' >
                Adicionar Foto/Vídeo
            </Button>
        </>
    )
}

export default ArquivoAdd

const themedStyles = StyleService.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        flex: 1,
        paddingHorizontal: 4,
        paddingVertical: 24,
    },
    input: {
        marginHorizontal: 12,
        marginVertical: 8,
    },
    imageContainer: {
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'color-info-400',
    },
    image: {
        height: 300,
        width: '100%',
    },
    buttonContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
        marginTop: 8,
    },
    button: {
        marginHorizontal: 12,
        marginTop: 12,
    },
    buttonLast: {
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 12,
    },
})
