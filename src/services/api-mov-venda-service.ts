import apiInstance from './api';
import { IMovimentacaoPneu } from '../model/movimentacao-pneu.model';

class MovVendaService{

    async getAll(page: number, numeroFogo: string) {
        
        const result = await apiInstance.get('api/movvenda', {
            params: {
                pageSize: 20,
                page: page,
                numeroFogo: numeroFogo,
                //sortBy: sortingField,
                //orderBy: sortingOrder,
            }
        });
        
        return result;
    }

    async getOne(id: number) {
        const result = await apiInstance.get(`api/movvenda/${id}`);
        return result;
    }
    
    async add(model: IMovimentacaoPneu) {
        const result = await apiInstance.post('api/movvenda', model);
        return result;
    }

    async delete(id: number) {
        const result = await apiInstance.delete(`api/movvenda/${id}`);
        return result;
    }
}

export default MovVendaService;