import * as Yup from 'yup';

const lancContadorInsertSchema = Yup.object().shape({
    Bem: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Bem" é obrigatório')
            .required('Campo "Bem" é obrigatório')
    }),  
    Contador: Yup.object().shape({
        Id: Yup
            .number()
            .min(1, 'Campo "Motivo" é obrigatório')
            .required('Campo "Motivo" é obrigatório')
    }), 
    DataString: Yup
        .string()
        .min(10, 'Máximo 10 caracteres')
        .required('Campo "Data" é obrigatório'),     
    HoraString: Yup
        .string()
        .min(5, 'Máximo 5 caracteres')
        .required('Campo "Hora" é obrigatório'),         
    ContadorNovo: Yup
        .number()
        .required('Campo "Posição Atual" é obrigatório'),   
})

export {
    lancContadorInsertSchema,
}