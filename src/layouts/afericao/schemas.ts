import * as Yup from 'yup';

const afericaoInsertSchema = Yup.object().shape({
    Pneu: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Pneu" é obrigatório')
            .required('Campo "Pneu" é obrigatório')
    }),  
    DataString: Yup
        .string()
        .min(10, 'Máximo 10 caracteres')
        .required('Campo "Data" é obrigatório'),     
    HoraString: Yup
        .string()
        .min(5, 'Máximo 5 caracteres')
        .required('Campo "Hora" é obrigatório'),         
    Sulco: Yup
        .number()
        .required('Campo "Sulco" é obrigatório'),
    Pressao: Yup
        .number()
        .required('Campo "Pressão" é obrigatório'),    
    Hr: Yup
        .number()
        .required('Campo "Hr Atual" é obrigatório'),
    Km: Yup
        .number()
        .required('Campo "Km Atual" é obrigatório'),    
     
})

const afericaoUpdateSchema = Yup.object().shape({
    Pneu: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Pneu" é obrigatório')
            .required('Campo "Pneu" é obrigatório')
    }),  
    DataString: Yup
        .string()
        .min(10, 'Máximo 10 caracteres')
        .required('Campo "Data" é obrigatório'),     
    HoraString: Yup
        .string()
        .min(5, 'Máximo 5 caracteres')
        .required('Campo "Hora" é obrigatório'),         
    Sulco: Yup
        .number()
        .required('Campo "Sulco" é obrigatório'),
    Pressao: Yup
        .number()
        .required('Campo "Pressão" é obrigatório'),    
    Hr: Yup
        .number()
        .required('Campo "Hr Atual" é obrigatório'),
    Km: Yup
        .number()
        .required('Campo "Km Atual" é obrigatório'), 
})

export {
    afericaoInsertSchema,
    afericaoUpdateSchema,
}