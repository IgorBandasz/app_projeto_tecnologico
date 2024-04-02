import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
    login: Yup
        .string()
        .required('Campo "Login" é obrigatório'),
    senha: Yup
        .string()
        .required('Campo "Senha" é obrigatório'),
})

export {
    loginSchema,
}