import { IDesenho } from "./desenho.model";
import { IFornecedor } from "./fornecedor.model";
import { IMotivo } from "./motivo.model";
import { IPneu, IPneuImagem } from "./pneu.model";
import { ITipoConserto } from "./tipo-conserto.model";

export interface IRecapagemPneuServico {
    Id?: number;    
    Pneu: IPneu;
    TipoConserto: ITipoConserto;
    Quant: number;
    ValorUnit: number;
    ValorTotal: number;
}

export interface IRecapagemPneu{ 
    Id?: number;
    Status: number;
    Pneu: IPneu;
    Recapadora: IFornecedor;
    Motivo: IMotivo;
    NumeroColeta: string;
    DataEnvio: Date;
    DataEnvioString: string;
    DataPrevEntrega: Date;
    DataPrevEntregaString: string;
    DataRetorno: Date;
    DataRetornoString: string;
    DataRecusa: Date;
    DataRecusaString: string;
    Data: Date;
    DataString: string;
    Hora: Date;
    HoraString: string;
    SulcoSaida: number;
    SulcoRetorno: number;
    HrSaida: number;
    KmSaida: number;
    Desenho: IDesenho;
    DesenhoSugestao: IDesenho;
    Valor: number;
    ValorConserto: number;
    VidaUtilEsperadaHr: number;
    VidaUtilEsperadaKm: number;
    Observacao: string;

    Servicos: IRecapagemPneuServico[];
    Imagens: IPneuImagem[];
}