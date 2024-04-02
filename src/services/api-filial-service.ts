import apiInstance from './api';

class FilialService{

    async getAll() {
        const result = await apiInstance.get('api/filial', {
            params: {
                pageSize: 20,
                page: 1,
                //sortBy: sortingField,
                //orderBy: sortingOrder,
            }
        });
        return result;
    }

    async getOne(id: number) {
        const result = await apiInstance.get(`api/filial/${id}`);
        return result;
    }
}

export default FilialService;