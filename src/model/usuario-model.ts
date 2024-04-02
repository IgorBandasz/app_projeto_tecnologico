import { IConfiguracaoGeral } from "./configuracao-geral.model";

export interface IUsuario {
    Id: number;
    Nome: string;
    ConfiguracaoGeral?: IConfiguracaoGeral;
    Permissao: IPermissao;
}

export interface IPermissao {
    Contador: boolean;
    AfericaoPneu: boolean;
    MovimentacaoPneu: boolean;
    EstoquePneu: boolean;
    RecapagemPneu: boolean;
    SucataPneu: boolean;
    VendaPneu: boolean;
    ConsertoPneu: boolean;
    CadastroCompletoPneu: boolean;

    AcessarPneu: boolean;
    NovoPneu: boolean;
    AlterarPneu: boolean;
    VisualizarPneu: boolean;
    ExcluirPneu: boolean;
}