import { ICidade } from './cidade.model';
import { IUsuario } from './usuario-model';

export interface ICliente {
    Id?: number;
    Ativo: boolean,
    RazaoSocial: string;
    NomeFantasia: string;
    TipoFJ: number;
    CNPJCPF: string;
    Telefone1: string;
    Telefone2: string;
    Celular: string;
    Telefone1Whatsapp: boolean;
    Telefone2Whatsapp: boolean;
    CelularWhatsapp: boolean;
    Email: string;
    Endereco: string;
    Num: string;
    Comp: string;
    Bairro: string;
    CEP: string;
    Cidade: ICidade;
    Usuario?: IUsuario;
}