import React, { useState } from 'react'
import { Button, Divider, Input, StyleService, TopNavigation, useStyleSheet } from '@ui-kitten/components';

import { KeyboardAvoidingView } from '../../../components/keyboard-avoiding-view';
import { SafeAreaLayout } from '../../../components/safe-area-layout.component';
import { IRecapagemPneuServico } from '../../../model/recapagem-pneu.model';
import { TipoConsertoCard } from '../../../layouts/tipo-conserto/tipo-conserto-card.component';
import { formatMoeda } from '../../../utils/float';
import { maskCurrency } from '../../../components/mask.format';

interface Params {
    idRecapagem: number;
    data: IRecapagemPneuServico;
}

export default ({ navigation, route }): React.ReactElement => {
    const styles = useStyleSheet(themedStyles);
    const [param,] = React.useState(route.params as Params);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [model, setModel] = React.useState<IRecapagemPneuServico>(param.data);

    const onCancelarButtonPress = (): void => {
        if(isLoading == false){
            setIsLoading(true);
            navigation && navigation.goBack();
        }
    };

    return (
        <>
            <TopNavigation
                title='VISUALIZAR SERVIÇO' />

            <Divider />

            <KeyboardAvoidingView >
                <SafeAreaLayout
                    style={styles.form}
                    level='1'>

                    <TipoConsertoCard
                        data={model.TipoConserto}
                        onFindPress={null} />

                    <Input
                        style={styles.input}
                        disabled={true}
                        label='Quant'
                        value={maskCurrency(model.Quant.toString())}/>

                    <Input
                        style={styles.input}
                        disabled={true}
                        label='Valor Unitário'
                        value={formatMoeda(model.ValorUnit)}/>

                    <Input
                        style={styles.input}
                        disabled={true}
                        label='Valor Total'
                        value={formatMoeda(model.ValorTotal)}/>

                    <Divider />

                    <Button
                        style={styles.buttonLast}
                        size='medium'
                        status='danger'
                        onPress={onCancelarButtonPress} >
                        Fechar
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
