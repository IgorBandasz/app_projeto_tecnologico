import apiInstance from './api';

class ModeloPneuService{

    async getAll(page: number, id: string, nome: string, idFabricante: string) {
        const result = await apiInstance.get(`api/modeloPneu`, {
            params: {
                pageSize: 200,
                page: page,
                id: id,
                nome: nome,
                idFabricante: idFabricante,
                //sortBy: sortingField,
                //orderBy: sortingOrder,
            }
        });

        return result;
    }
}

export default ModeloPneuService;