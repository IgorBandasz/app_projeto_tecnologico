import * as Yup from 'yup';

const consertoPneuInsertSchema = Yup.object().shape({
    Pneu: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Pneu" é obrigatório')
            .required('Campo "Pneu" é obrigatório')
    }),  
    Motivo: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Motivo" é obrigatório')
            .required('Campo "Motivo" é obrigatório')
    }), 
    Fornecedor: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Fornecedor" é obrigatório')
            .required('Campo "Fornecedor" é obrigatório')
    }), 
    DataString: Yup
        .string()
        .min(10, 'Máximo 10 caracteres')
        .required('Campo "Data" é obrigatório'),     
    HoraString: Yup
        .string()
        .min(5, 'Máximo 5 caracteres')
        .required('Campo "Hora" é obrigatório'),         
    SulcoSaida: Yup
        .number()
        .required('Campo "Sulco Saída" é obrigatório'),   
    DataEnvioString: Yup
        .string()
        .min(10, '"Data Envio" deve ter no mínimo 10 caracteres')
        .required('Campo "Data Envio" é obrigatório'), 
    DataPrevEntregaString: Yup
        .string()
        .min(10, '"Data Previsão Entrega" deve ter no mínimo 10 caracteres')
        .required('Campo "Data Previsão Entrega" é obrigatório'),     
    Observacao: Yup
        .string()
        .required('Campo "Observação" é obrigatório'), 
})

const consertoPneuUpdateSchema = Yup.object().shape({
    Pneu: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Pneu" é obrigatório')
            .required('Campo "Pneu" é obrigatório')
    }),  
    Motivo: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Motivo" é obrigatório')
            .required('Campo "Motivo" é obrigatório')
    }), 
    Fornecedor: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Fornecedor" é obrigatório')
            .required('Campo "Fornecedor" é obrigatório')
    }), 
    DataString: Yup
        .string()
        .min(10, 'Máximo 10 caracteres')
        .required('Campo "Data" é obrigatório'),     
    HoraString: Yup
        .string()
        .min(5, 'Máximo 5 caracteres')
        .required('Campo "Hora" é obrigatório'),         
    SulcoSaida: Yup
        .number()
        .required('Campo "Sulco Saída" é obrigatório'),   
    DataEnvioString: Yup
        .string()
        .min(10, '"Data Envio" deve ter no mínimo 10 caracteres')
        .required('Campo "Data Envio" é obrigatório'), 
    DataPrevEntregaString: Yup
        .string()
        .min(10, '"Data Previsão Entrega" deve ter no mínimo 10 caracteres')
        .required('Campo "Data Previsão Entrega" é obrigatório'),     
    Observacao: Yup
        .string()
        .required('Campo "Observação" é obrigatório'),
})

const consertoPneuServicoInsertSchema = Yup.object().shape({
    TipoConserto: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Tipo Conserto" é obrigatório')
            .required('Campo "Tipo Conserto" é obrigatório'),
    }), 
    Quant: Yup
        .number()
        .required('Campo "Quantidade" é obrigatório'),
    ValorUnit: Yup
        .number()
        .required('Campo "Valor Unitário" é obrigatório'),    
    ValorTotal: Yup
        .number()
        .required('Campo "Valor Total" é obrigatório'),         
})

const consertoPneuServicoUpdateSchema = Yup.object().shape({
    TipoConserto: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Tipo Conserto" é obrigatório')
            .required('Campo "Tipo Conserto" é obrigatório'),
    }), 
    Quant: Yup
        .number()
        .required('Campo "Quantidade" é obrigatório'),
    ValorUnit: Yup
        .number()
        .required('Campo "Valor Unitário" é obrigatório'),    
    ValorTotal: Yup
        .number()
        .required('Campo "Valor Total" é obrigatório'),          
})

export {
    consertoPneuInsertSchema,
    consertoPneuUpdateSchema,
    consertoPneuServicoInsertSchema,
    consertoPneuServicoUpdateSchema,
}