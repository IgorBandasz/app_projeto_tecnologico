import apiInstance from './api';
import { IAfericao } from '../model/afericao.model';

class AfericaoService{

    async getAll(page: number, numeroFogo: string, idPneu: string) {
        
        const result = await apiInstance.get('api/afericao', {
            params: {
                pageSize: 20,
                page: page,
                numeroFogo: numeroFogo,
                idPneu: idPneu,
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
    
    async add(model: IAfericao) {
        const result = await apiInstance.post('api/afericao', model);
        return result;
    }

    async delete(id: number) {
        const result = await apiInstance.delete(`api/afericao/${id}`);
        return result;
    }
}

export default AfericaoService;