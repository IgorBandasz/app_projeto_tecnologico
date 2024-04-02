import * as Yup from 'yup';

const movEstoqueInsertSchema = Yup.object().shape({
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
})

const movEstoqueUpdateSchema = Yup.object().shape({
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
})

export {
    movEstoqueInsertSchema,
    movEstoqueUpdateSchema,
}