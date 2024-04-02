import { ICentroCusto } from "./centro-custo.model";
import { IMotivo } from "./motivo.model";
import { IPneu, IPneuImagem } from "./pneu.model";

export interface IMovimentacaoPneu{ //Estoque, venda e sucata
    Id?: number;
    Pneu: IPneu;
    Data: Date;
    DataString: string;
    Hora: Date;
    HoraString: string;
    Motivo: IMotivo;
    TipoMov: number;
    SulcoAtual: number;
    Observacao: string;
    SucataLocal: number;
    ValorVenda: number;
    DataVenda: Date;
    DataVendaString: string;
    EmpresaVenda: string;
    CentroCusto: ICentroCusto;
    NFVenda: string;

    Imagens: IPneuImagem[];
}