import apiInstance from './api';
import { IMovimentacaoPneu } from '../model/movimentacao-pneu.model';
import { IPneuImagem } from '../model/pneu.model';
import { Component } from 'react';
import RNFS from 'react-native-fs';

class MovSucataService extends Component {

    onProgress?: (p: number) => void;

    constructor(props?) {
        super(props);
        this.onProgress = props;
    }

    async getAll(page: number, numeroFogo: string) {
        
        const result = await apiInstance.get('api/movsucata', {
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
        const result = await apiInstance.get(`api/movsucata/${id}`);
        return result;
    }
    
    async add(model: IMovimentacaoPneu) {
        const result = await apiInstance.post('api/movsucata', model);
        return result;
    }

    async delete(id: number) {
        const result = await apiInstance.delete(`api/movsucata/${id}`);
        return result;
    }

    //--------------------------------------------------------------------------------------------------------

    async getAllArquivo(idConserto: number) {
        const result = await apiInstance.get(`api/conserto/${idConserto}/file`, {
            params: {
                idConserto: idConserto,
                //sortBy: sortingField,
                //orderBy: sortingOrder,
            }
        });
        return result;
    }

    async getArquivo(idConserto: number, idArquivo: number) {
        let config = {
            onDownloadProgress: data => {
                let percentCompleted = Math.floor((data.loaded * 100) / data.total);
                this.onProgress(percentCompleted);
            }
        }

        const result = await apiInstance.get(`api/conserto/${idConserto}/file/${idArquivo}`, config);
        return result;
    }

    async addArquivo(idConserto: number, model: IPneuImagem) {
        let config = {
            onUploadProgress: data => {
                let percentCompleted = Math.floor((data.loaded * 100) / data.total);
                this.onProgress(percentCompleted);
            }
        }
        await RNFS.readFile(model.Caminho, 'base64').then(async (res) => {
            model.Base64 = res;
        });
        
        const result = await apiInstance.post(`api/conserto/${idConserto}/file`, model, config);
        return result;
    }

    async deleteArquivo(idConserto: number, id: number) {
        const result = await apiInstance.delete(`api/conserto/${idConserto}/file/${id}`);
        return result;
    }
}

export default MovSucataService;