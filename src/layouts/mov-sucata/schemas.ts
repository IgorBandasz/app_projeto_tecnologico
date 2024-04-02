import * as Yup from 'yup';

const movSucataInsertSchema = Yup.object().shape({
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
    CentroCusto: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Centro de Custo" é obrigatório')
            .required('Campo "Centro de Custo" é obrigatório')
    }), 
    DataString: Yup
        .string()
        .min(10, 'Máximo 10 caracteres')
        .required('Campo "Data" é obrigatório'),     
    HoraString: Yup
        .string()
        .min(5, 'Máximo 5 caracteres')
        .required('Campo "Hora" é obrigatório'),         
    SulcoAtual: Yup
        .number()
        .required('Campo "Sulco" é obrigatório'),   
    ValorVenda: Yup
        .number()
        .required('Campo "Valor Ação" é obrigatório'),
    DataVendaString: Yup
        .string()
        .min(10, '"Data Ação" deve ter no mínimo 10 caracteres')
        .required('Campo "Data Ação" é obrigatório'), 
    NFVenda: Yup
        .string()
        .required('Campo "NF/Laudo" é obrigatório'),
    EmpresaVenda: Yup
        .string()
        .required('Campo "Empresa" é obrigatório'), 
    Observacao: Yup
        .string()
        .required('Campo "Observação" é obrigatório'),
})

const movSucataUpdateSchema = Yup.object().shape({
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
    CentroCusto: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Centro de Custo" é obrigatório')
            .required('Campo "Centro de Custo" é obrigatório')
    }), 
    DataString: Yup
        .string()
        .min(10, 'Máximo 10 caracteres')
        .required('Campo "Data" é obrigatório'),     
    HoraString: Yup
        .string()
        .min(5, 'Máximo 5 caracteres')
        .required('Campo "Hora" é obrigatório'),         
    SulcoAtual: Yup
        .number()
        .required('Campo "Sulco" é obrigatório'),   
    ValorVenda: Yup
        .number()
        .required('Campo "Valor Ação" é obrigatório'),
    DataVendaString: Yup
        .string()
        .min(10, '"Data Ação" deve ter no mínimo 10 caracteres')
        .required('Campo "Data Ação" é obrigatório'), 
    NFVenda: Yup
        .string()
        .required('Campo "NF/Laudo" é obrigatório'),
    EmpresaVenda: Yup
        .string()
        .required('Campo "Empresa" é obrigatório'), 
    Observacao: Yup
        .string()
        .required('Campo "Observação" é obrigatório'), 
})

export {
    movSucataInsertSchema,
    movSucataUpdateSchema,
}