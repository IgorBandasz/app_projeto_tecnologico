import apiInstance from './api';
import { IRecapagemPneu, IRecapagemPneuServico } from '../model/recapagem-pneu.model';
import { Component } from 'react';

class RecapagemPneuService extends Component {

    onProgress?: (p: number) => void;

    constructor(props?) {
        super(props);
        this.onProgress = props;
    }

    async getAll(page: number, id: string) {
        
        const result = await apiInstance.get('api/recapagempneu', {
            params: {
                pageSize: 20,
                page: page,
                id: id,
                //sortBy: sortingField,
                //orderBy: sortingOrder,
            }
        });
        
        return result;
    }

    async getOne(id: number) {
        const result = await apiInstance.get(`api/recapagempneu/${id}`);
        return result;
    }

    async getOneBasico(id: number) {
        const result = await apiInstance.get(`api/recapagempneu/${id}/basico`);
        return result;
    }
    
    async add(model: IRecapagemPneu) {
        const result = await apiInstance.post('api/recapagempneu', model);
        return result;
    }

    async edit(id: number, model: IRecapagemPneu) {
        const result = await apiInstance.patch(`api/recapagempneu/${id}`, model);
        return result;
    }

    async delete(id: number) {
        const result = await apiInstance.delete(`api/recapagempneu/${id}`);
        return result;
    }

    //--------------------------------------------------------------------------

    async getAllServico(idRecapagem: number) {
        const result = await apiInstance.get(`api/recapagempneu/${idRecapagem}/servico`, {
            params: {
                idRecapagem: idRecapagem,
                //sortBy: sortingField,
                //orderBy: sortingOrder,
            }
        });
        return result;
    } 

    async getOneServico(idRecapagem: number, id: number) {
        const result = await apiInstance.get(`api/recapagempneu/${idRecapagem}/servico/${id}`);
        return result;
    }

    async addServico(idRecapagem: number, model: IRecapagemPneuServico) {
        const result = await apiInstance.post(`api/recapagempneu/${idRecapagem}/servico`, model);
        return result;
    }

    async editServico(idRecapagem: number, model: IRecapagemPneuServico, id: number) {
        const result = await apiInstance.put(`api/recapagempneu/${idRecapagem}/servico/${id}`, model);
        return result;
    }

    async deleteServico(idRecapagem: number, id: number) {
        const result = await apiInstance.delete(`api/recapagempneu/${idRecapagem}/servico/${id}`);
        return result;
    }
}

export default RecapagemPneuService;