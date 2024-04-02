import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Button, Divider, Input, StyleService, TopNavigation, useStyleSheet } from '@ui-kitten/components';

import { KeyboardAvoidingView } from '../../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../../components/safe-area-layout.component';
import { IRecapagemPneuServico } from '../../../model/recapagem-pneu.model';
import { useFormik } from 'formik';
import { recapagemPneuServicoInsertSchema } from '../schemas';
import Loader from '../../../components/Loader';
import Mask from '../../../components/mask.component';
import { formatMoeda, formatQuant, formatValorUnit, strToFloat } from '../../../utils/float';
import { TipoConsertoCard } from '../../../layouts/tipo-conserto/tipo-conserto-card.component';
import { ITipoConserto } from '../../../model/tipo-conserto.model';
import { IPneu } from '../../../model/pneu.model';

interface Params {
    pneu: IPneu;
    onHandleSave: (servico: IRecapagemPneuServico) => void;
}

export default ({ navigation, route }): React.ReactElement => {
    const styles = useStyleSheet(themedStyles);
    const [param,] = React.useState(route.params as Params);
    const [progress, setProgress] = useState<number>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [model, setModel] = React.useState<IRecapagemPneuServico>({Pneu: param.pneu, Quant: 0, ValorUnit: 0, ValorTotal: 0} as IRecapagemPneuServico);
    const [editarValorUnit, setEditarValorUnit] = React.useState<boolean>(false);
    
    useEffect(() => {
        async function handleLoad() {
            try {
                setIsLoading(true);
                
                /* BUSCAR PERMISSÃO DE EDITAR VALOR UNITÁRIO
                const user = await AppStorage.getUsuario();*/
                setEditarValorUnit(true); 
               
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error(error);
                Alert.alert(error);
            }
        }

        handleLoad();
    }, []);

    //*******************************************************************************************************

    async function handleFindTipoConserto() {
        navigation.navigate('TipoConsertoList', {
          onSelect: (item: ITipoConserto) => formik.setFieldValue('TipoConserto', item)
        })
    }

    async function calculaTotal() {
        if (formik.values.Quant && formik.values.ValorUnit){
            const total = formik.values.Quant * formik.values.ValorUnit;
            await formik.setFieldValue('ValorTotal', total, true);
            await formik.setFieldTouched('ValorTotal', true, true);
            formik.validateForm();
        }else{
            await formik.setFieldValue('ValorTotal', 0, true);
            await formik.setFieldTouched('ValorTotal', true, true);
            formik.validateForm();  
        }
    }

    //*******************************************************************************************************

    async function handleSave(item: IRecapagemPneuServico) {
        try{    
            setIsLoading(true);
            
            param.onHandleSave(item);

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            Alert.alert(error);
        }
    }

    const onCancelarButtonPress = (): void => {
        if(isLoading == false){
            setIsLoading(true);
            navigation && navigation.goBack();
        }
    };

    const formik = useFormik({
        initialValues: model,
        enableReinitialize: true,
        validationSchema: recapagemPneuServicoInsertSchema,
        onSubmit: values => { handleSave(values) },
      });

    const submitForm = () => formik.handleSubmit();

    return (
        <>
            <TopNavigation
                title='NOVO SERVIÇO' />

            <Divider />

            <Loader
                loading={isLoading}
                progress={progress} />

            <KeyboardAvoidingView >
                <SafeAreaLayout
                    style={styles.form}
                    level='1'>

                    <TipoConsertoCard
                        data={formik.values.TipoConserto}
                        onFindPress={handleFindTipoConserto}
                        caption={formik?.errors?.TipoConserto?.Id} />

                    <Mask
                        style={styles.input}
                        label='Quantidade'
                        placeholder='Informe a Quantidade'
                        value={formatQuant(formik.values.Quant, 3)}
                        status={formik.errors['Quant'] ? 'danger' : 'info'}
                        mask={'quant'}
                        casas={3}
                        keyboardType='number-pad'
                        inputMaskChange={text => formik.setFieldValue('Quant', strToFloat(text))}
                        onBlur={e => calculaTotal()} />

                    <Mask
                        style={styles.input}
                        label='Valor Unitário'
                        disabled={editarValorUnit === false}
                        placeholder='Informe o Valor Unitário'
                        value={`R$${formatValorUnit(formik.values.ValorUnit, 2)}`}
                        status={formik.errors['ValorUnit'] ? 'danger' : 'info'}
                        mask={'valorUnit'}
                        casas={2}
                        keyboardType='number-pad'
                        inputMaskChange={text => formik.setFieldValue('ValorUnit', strToFloat(text))}
                        onBlur={e => calculaTotal()} />

                    <Input
                        style={styles.input}
                        disabled={true}
                        label='Valor Total'
                        value={`R$${formatMoeda(formik.values.ValorTotal)}`}/>

                    <Divider />
                    
                    <Button
                        style={styles.button}
                        size='medium'
                        status='success'
                        onPress={submitForm} >
                        Salvar
                    </Button>

                    <Button
                        style={styles.buttonLast}
                        size='medium'
                        status='danger'
                        onPress={onCancelarButtonPress} >
                        Cancelar
                    </Button>

                </SafeAreaLayout>
            </KeyboardAvoidingView>
        </>
    )
}

const themedStyles = StyleService.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    picker: {
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
