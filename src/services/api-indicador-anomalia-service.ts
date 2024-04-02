import apiInstance from './api';

class IndicadorAnomaliaService{

    async getAll(page: number, id: string, nome: string, avaria: number, causa: number, acao: number, precaucao: number) {
        const result = await apiInstance.get(`api/indicadoranomalia`, {
            params: {
                pageSize: 200,
                page: page,
                id: id,
                nome: nome,
                avaria: avaria,
                causa: causa,
                acao: acao,
                precaucao: precaucao
                //sortBy: sortingField,
                //orderBy: sortingOrder,
            }
        });

        return result;
    }
}

export default IndicadorAnomaliaService;