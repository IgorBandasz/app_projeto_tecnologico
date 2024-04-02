import apiInstance from './api';
import { IMovimentacaoPneu } from '../model/movimentacao-pneu.model';

class MovimentacaoPneuService{

    async getAll(page: number, numeroFogo: string) {
        
        const result = await apiInstance.get('api/afericao', {
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
        const result = await apiInstance.get(`api/afericao/${id}`);
        return result;
    }
    
    async add(model: IMovimentacaoPneu) {
        const result = await apiInstance.post('api/afericao', model);
        return result;
    }

    async delete(id: number) {
        const result = await apiInstance.delete(`api/afericao/${id}`);
        return result;
    }
}

export default MovimentacaoPneuService;