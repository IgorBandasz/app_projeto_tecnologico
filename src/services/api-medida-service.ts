import apiInstance from './api';

class MedidaService{

    async getAll(page: number, id: string, nome: string) {
        const result = await apiInstance.get(`api/medida`, {
            params: {
                pageSize: 200,
                page: page,
                id: id,
                nome: nome
                //sortBy: sortingField,
                //orderBy: sortingOrder,
            }
        });

        return result;
    }
}

export default MedidaService;