import React from 'react';
import { Input, InputProps } from '@ui-kitten/components';
import { maskCEP, maskPhone, maskCurrency , maskCPF, maskCNPJ, maskPlaca, maskInteger, maskDate, maskTime} from './mask.format';

interface MaskProps extends InputProps{
    mask: 'cep' | 'fone' | 'data' | 'hora' | 'inteiro' | 'moeda' | 'quant' | 'valorUnit' | 'cpf' | 'cnpj' | 'placa',
    casas?: number,
    inputMaskChange: any,
    caption?: string;
}

const Mask: React.FC<MaskProps> = ({mask, casas, inputMaskChange, ... rest}) => {
    async function handleChange(text: string) {
        if (mask === 'cep') {
            const value = maskCEP(text);
            inputMaskChange(value);
        }
        else if (mask === 'fone') {
            const value = maskPhone(text);
            inputMaskChange(value);
        }
        else if (mask === 'data') {
            const value = maskDate(text);
            inputMaskChange(value);
        }
        else if (mask === 'hora') {
            const value = maskTime(text);
            inputMaskChange(value);
        }
        else if (mask === 'inteiro') {
            const value = maskInteger(text);
            inputMaskChange(value);
        }
        else if (mask === 'moeda') {
            const value = maskCurrency(text);
            inputMaskChange(value);
        }
        else if (mask === 'cpf') {
            const value = maskCPF(text);
            inputMaskChange(value);
        }
        else if (mask === 'cnpj') {
            const value = maskCNPJ(text);
            inputMaskChange(value);
        }
        else if (mask === 'placa') {
            const value = maskPlaca(text);
            inputMaskChange(value);
        }
        else if (mask === 'quant') {
            const value = maskCurrency(text, casas);
            inputMaskChange(value);
        }
        else if (mask === 'valorUnit') {
            const value = maskCurrency(text, casas);
            inputMaskChange(value);
        }
    }
    
    return(
        <>
            <Input 
                onChangeText={(text) => handleChange(text)}
                {...rest}
            />
        </>
    )
}

export default Mask;
