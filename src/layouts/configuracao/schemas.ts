import * as Yup from 'yup';

const configuracaoInsertSchema = Yup.object().shape({
    host: Yup
    .string()
    .required('Campo "Host/Porta" é obrigatório'),
})

export {
    configuracaoInsertSchema,
}