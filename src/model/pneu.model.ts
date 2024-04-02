import { IBem } from "./bem.model";
import { ICentroCusto } from "./centro-custo.model";
import { IDesenho } from "./desenho.model";
import { IFabricantePneu } from "./fabricante-pneu.model";
import { IFornecedor } from "./fornecedor.model";
import { IMedida } from "./medida.model";
import { IModeloPneu } from "./modelo-pneu.model";

export interface IPneuImagem {
    Id?: number,
    Descricao: string,
    Caminho: string;
    Origem?: string;
    Usuario?: string,
    //Tipo?: string,
    Tipo?: number;
    IdAfericao?: number;
    IdConserto?: number;
    IdRecapagem?: number;
    IdSucata?: number;
    IdVenda?: number;
    IdEstoque?: number;
    Uri?: string,
    Base64: string,
    Ext?: string,
    Tamanho?: number,
    //UsuarioId?: number,
        
}

export interface IPneu {
    Id?: number;
    Status: number;
    Disponibilidade: number;
    NumeroFogo: string;
    NumeroSerie: string;
    ModeloPneu: IModeloPneu;
    FabricantePneu: IFabricantePneu;
    Fornecedor: IFornecedor;
    Bem: IBem;
    DataInstalacao: Date;
    DataInstalacaoString: string;
    CentroCusto: ICentroCusto;
    Observacao: string;
    DataAquisicao: Date;
    DataAquisicaoString: string;
    ValorAquisicao: number;
    DataGarantia: Date;
    DataGarantiaString: string;
    Medida: IMedida;
    Desenho: IDesenho;
    IndiceCarga: number;
    IndiceVelocidade: number;
    CapacidadeLona: number;
    SulcoMin: number;
    SulcoMax: number;
    SulcoAtual: number;
    PressaoMin: number;
    PressaoMax: number;
    PressaoAtual: number;
    VidaUtilEsperadaHr: number;
    VidaUtilEsperadaKm: number;
    HrAtual: number;
    HrAcumulado: number;
    KmAtual: number;
    KmAcumulado: number;
    Construcao: number;
    DOT: string;
    Eixo: string;
    Rodado: string;
    Posicao: string;
    IdUsuario: number;
    AferiuHoje: boolean;

    Imagens: IPneuImagem[];
}