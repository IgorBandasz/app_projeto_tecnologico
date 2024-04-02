import apiInstance from './api';

class UsuarioService {
    
    async login(usuario: string, senha: string) {
        const result = await apiInstance.get(`api/usuario/validarlogin?login=${usuario}&senha=${senha}`);
        return result;
    }

    async getHistorico(id: number) {
        const result = await apiInstance.get(`api/usuario/${id}/historico`);
        return result;
    }
}

export default UsuarioService;
