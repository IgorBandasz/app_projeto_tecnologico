import axios from 'axios';
import { AppStorage } from './app-storage.service';

axios.defaults.baseURL = '';

const apiInstance = axios.create({
    timeout: 120 * 1000, // 2min
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

apiInstance.interceptors.request.use(async (config) => {
    const token = (await AppStorage.getLogin()).token;
    if (token && config.headers) 
        config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});

apiInstance.interceptors.request.use(
    async config => {
        const value = await AppStorage.getConfiguracao();
        config.baseURL = value.host;
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

apiInstance.interceptors.response.use(
    async response => {
        return response;
    },
    async error => {
        if (error.response?.status === 401) {
            return Promise.reject(error);
        } else if (error.response) {
            error.response.Code = 401;
            error.response.Message = 'Ocorreu um erro ao tentar acessar as informações';
            return error.response;
        } else {
            return error;
        }
    },
);

export default apiInstance;
