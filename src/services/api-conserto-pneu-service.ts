import apiInstance from './api';
import { IConsertoPneu, IConsertoPneuServico } from '../model/conserto-pneu.model';
import { Component } from 'react';
import { IPneuImagem } from '../model/pneu.model';
import RNFS from 'react-native-fs';

class ConsertoPneuService extends Component {

    onProgress?: (p: number) => void;

    constructor(props?) {
        super(props);
        this.onProgress = props;
    }

    async getAll(page: number, id: string) {
        
        const result = await apiInstance.get('api/consertopneu', {
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
        const result = await apiInstance.get(`api/consertopneu/${id}`);
        return result;
    }

    async getOneBasico(id: number) {
        const result = await apiInstance.get(`api/consertopneu/${id}/basico`);
        return result;
    }
    
    async add(model: IConsertoPneu) {
        const result = await apiInstance.post(`api/consertopneu`, model);
        return result;
    }
    
    async edit(id: number, model: IConsertoPneu) {
        const result = await apiInstance.patch(`api/consertopneu/${id}`, model);
        return result;
    }

    async delete(id: number) {
        const result = await apiInstance.delete(`api/consertopneu/${id}`);
        return result;
    }

    //--------------------------------------------------------------------------

    async getAllServico(idConserto: number) {
        const result = await apiInstance.get(`api/consertopneu/${idConserto}/servico`, {
            params: {
                idConserto: idConserto,
                //sortBy: sortingField,
                //orderBy: sortingOrder,
            }
        });
        return result;
    } 

    async getOneServico(idConserto: number, id: number) {
        const result = await apiInstance.get(`api/consertopneu/${idConserto}/servico/${id}`);
        return result;
    }

    async addServico(idConserto: number, model: IConsertoPneuServico) {
        const result = await apiInstance.post(`api/consertopneu/${idConserto}/servico`, model);
        return result;
    }

    async deleteServico(idConserto: number, id: number) {
        const result = await apiInstance.delete(`api/consertopneu/${idConserto}/servico/${id}`);
        return result;
    }

}

export default ConsertoPneuService;