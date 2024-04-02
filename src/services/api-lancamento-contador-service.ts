import apiInstance from './api';
import { ILancamentoContador } from '../model/lancamento-contador.model';

class LancContadorService{
    
    async add(model: ILancamentoContador) {
        const result = await apiInstance.post('api/contador/lancamento', model);
        return result;
    }

    async validar(model: ILancamentoContador[]) {
        const result = await apiInstance.post('api/contador/validacontador', model);
        return result;
    }

}

export default LancContadorService;