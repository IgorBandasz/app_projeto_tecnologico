import apiInstance from './api';

class ObrigatoriedadeService{

    async getOne() {
        const result = await apiInstance.get(`api/configuracao/obrigatoriedade`);
        return result;
    }
}

export default ObrigatoriedadeService;