import apiInstance from './api';
import { IPneu, IPneuImagem } from '../model/pneu.model';
import { Component } from 'react';
import RNFS from 'react-native-fs';
import { IPosicaoPneu, ITrocaPneu } from '../model/posicao.model';
import { AppStorage } from './app-storage.service';

class PneuService extends Component {

    onProgress?: (p: number) => void;

    constructor(props?) {
        super(props);
        this.onProgress = props;
    }

    async getAll(page: number, idFilial: string, disponibilidade: string, centroAtivo: string, numeroFogo: string, id: string, frota: string, placa: string, afericao: boolean) {
        
        const result = await apiInstance.get('api/pneu', {
            params: {
                pageSize: 20,
                page: page,
                idFilial: idFilial,
                disponibilidade: disponibilidade,
                centroAtivo: centroAtivo,
                numeroFogo: numeroFogo,
                id: id,
                frota: frota,
                placa: placa,
                afericao: afericao,
            }
        });
        
        return result;
    }

    async getOne(id: number) {
        const result = await apiInstance.get(`api/pneu/${id}`);
        return result;
    }
    
    async add(model: IPneu) {
        const result = await apiInstance.post('api/pneu', model);
        return result;
    }

    async edit(model: IPneu, id: number) {
        const result = await apiInstance.patch(`api/pneu/${id}`, model);
        return result;
    }

    async delete(id: number) {
        const result = await apiInstance.delete(`api/pneu/${id}`);
        return result;
    }

    async movimentarPneu(model: IPosicaoPneu) {
        const result = await apiInstance.post('api/pneu/movimentarPneu', model);
        return result;
    }

    async trocarPneu(model: ITrocaPneu) {
        const result = await apiInstance.post('api/pneu/trocarPneu', model);
        return result;
    }

    async getHistorico(id: number) {
        const result = await apiInstance.get(`api/pneu/${id}/historico`);
        return result;
    }

    async getMovimentacoes(id: number) {
        const result = await apiInstance.get(`api/pneu/${id}/movimentacoes`);
        return result;
    }

    //*********************************************************************

    async getAllImagem(idPneu: number, id: string, idAfericao: string, idConserto: string, idRecapagem: string, idSucata: string, idVenda: string, idEstoque: string) {
        const result = await apiInstance.get(`api/pneu/${idPneu}/imagem`, {
            params: {
                id: id,
                idAfericao: idAfericao,
                idConserto: idConserto,
                idRecapagem: idRecapagem,
                idSucata: idSucata,
                idVenda: idVenda,
                idEstoque: idEstoque
            }
        });
        return result;
    }

    async getImagem(idPneu: number, id: number) {
        let config = {
            onDownloadProgress: data => {
                let percentCompleted = Math.floor((data.loaded * 100) / data.total);
                this.onProgress(percentCompleted);
            }
        }

        const result = await apiInstance.get(`api/pneu/${idPneu}/imagem/${id}`, config);
        return result;
    }

    async addImagem(idPneu: number, model: IPneuImagem) {
        let config = {
            onUploadProgress: data => {
                let percentCompleted = Math.floor((data.loaded * 100) / data.total);
                this.onProgress(percentCompleted);
            }
        }

        await RNFS.readFile(model.Caminho, 'base64').then(async (res) => {
            model.Base64 = res;
        });

        const result = await apiInstance.post(`api/pneu/${idPneu}/imagem`, model, config);
        return result;
    }

    async deleteImagem(idPneu: number, id: number) {
        const result = await apiInstance.delete(`api/pneu/${idPneu}/imagem/${id}`);
        return result;
    }
}

export default PneuService;