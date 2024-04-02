import * as Yup from 'yup';

const pneuInsertSchema = Yup.object().shape({
    NumeroFogo: Yup
        .string()
        .min(1, 'Campo "Número de Fogo" é obrigatório')
        .max(50, 'Máximo 50 caracteres')
        .required('Campo "Número de Fogo" é obrigatório'),
    NumeroSerie: Yup
        .string()
        .max(50, 'Máximo 50 caracteres'),
    ModeloPneu: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Modelo de Pneu" é obrigatório')
            .required('Campo "Modelo de Pneu" é obrigatório')
    }),  
    CentroCusto: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Centro de Custo" é obrigatório')
            .required('Campo "Centro de Custo" é obrigatório')
    }),     
    DataAquisicaoString: Yup
        .string()
        .min(10, 'Formato dd/mm/aaaa')
        .required('Campo "Data de Aquisição" é obrigatório'),      
})

const pneuUpdateSchema = Yup.object().shape({
    NumeroFogo: Yup
        .string()
        .min(1, 'Campo "Número de Fogo" é obrigatório')
        .max(50, 'Máximo 50 caracteres')
        .required('Campo "Número de Fogo" é obrigatório'),
    NumeroSerie: Yup
        .string()
        .max(50, 'Máximo 50 caracteres'),
    ModeloPneu: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Modelo de Pneu" é obrigatório')
            .required('Campo "Modelo de Pneu" é obrigatório')
    }),  
    CentroCusto: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Centro de Custo" é obrigatório')
            .required('Campo "Centro de Custo" é obrigatório')
    }),     
    DataAquisicaoString: Yup
        .string()
        .min(10, 'Formato dd/mm/aaaa')
        .required('Campo "Data de Aquisição" é obrigatório'),
})

export {
    pneuInsertSchema,
    pneuUpdateSchema,
}