import apiInstance from './api';

class BemService{

    async getAll(page: number, id: string, descricao: string, frota: string, placa: string) {
        const result = await apiInstance.get(`api/bem`, {
            params: {
                pageSize: 200,
                page: page,
                id: id,
                descricao: descricao,
                placa: placa,
                frota: frota,
                centroAtivo: 1,
                //sortBy: sortingField,
                //orderBy: sortingOrder,
            }
        });
        
        return result;
    }

    async getOne(id: number) {
        const result = await apiInstance.get(`api/bem/${id}`);
        return result;
    }

    async getPosicaoLivre(id: number) {
        const result = await apiInstance.get(`api/bem/${id}/PosicaoPneuLivre`);
        return result;
    }

    async getChassi(id: number) {
        const result = await apiInstance.get(`api/bem/${id}/chassi`);
        return result;
    }

    async getPneu(id: number, afericao: boolean) {
        const result = await apiInstance.get(`api/bem/${id}/pneu`, {
            params: {
                afericao: afericao
            }
        });
        return result;
    }

    async getUltContadorPneu(id: number) {
        const result = await apiInstance.get(`api/bem/ultimolancamentocontador/${id}/pneu`);
        return result;
    }
}

export default BemService;