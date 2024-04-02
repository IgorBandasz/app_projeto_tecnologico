import apiInstance from './api';
import { IMovimentacaoPneu } from '../model/movimentacao-pneu.model';

class MovEstoqueService{

    async getAll(page: number, numeroFogo: string) {
        
        const result = await apiInstance.get('api/movestoque', {
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
        const result = await apiInstance.get(`api/movestoque/${id}`);
        return result;
    }
    
    async add(model: IMovimentacaoPneu) {
        const result = await apiInstance.post('api/movestoque', model);
        return result;
    }

    async delete(id: number) {
        const result = await apiInstance.delete(`api/movestoque/${id}`);
        return result;
    }
}

export default MovEstoqueService;