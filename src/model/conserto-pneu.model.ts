import { IFornecedor } from "./fornecedor.model";
import { IMotivo } from "./motivo.model";
import { IPneu, IPneuImagem } from "./pneu.model";
import { ITipoConserto } from "./tipo-conserto.model";

export interface IConsertoPneuServico {
    Id?: number;    
    Pneu: IPneu;
    TipoConserto: ITipoConserto;
    Quant: number;
    ValorUnit: number;
    ValorTotal: number;
}

export interface IConsertoPneu{ 
    Id?: number;
    Status: number;
    Pneu: IPneu;
    Fornecedor: IFornecedor;
    Motivo: IMotivo;
    Data: Date;
    DataString: string;
    Hora: Date;
    HoraString: string;
    DataEnvio: Date;
    DataEnvioString: string;
    DataPrevEntrega: Date;
    DataPrevEntregaString: string;
    SulcoSaida: number;
    SulcoRetorno: number;
    DataRetorno: Date;
    DataRetornoString: string;
    Valor: number;
    ValorConserto: number;
    Observacao: string;

    Servicos: IConsertoPneuServico[];
    Imagens: IPneuImagem[];
}