import apiInstance from './api';

class FabricantePneuService{

    async getAll(page: number, id: string, nome: string) {
        const result = await apiInstance.get(`api/fabricantePneu`, {
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

export default FabricantePneuService;