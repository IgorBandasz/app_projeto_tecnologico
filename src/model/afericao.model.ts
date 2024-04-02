import { IDesenho } from "./desenho.model";
import { IIndicadorAnomalia } from "./indicador-anomalia.model";
import { IPneu, IPneuImagem } from "./pneu.model";

export interface IAfericao {
    Id?: number;
    Status: number;
    Pneu: IPneu;
    Data: Date;
    DataString: string;
    Hora: Date;
    HoraString: string;
    Sulco: number;
    Pressao: number;
    Hr: number;
    Km: number;
    Observacao: string;

    Desenho: IDesenho;
    Avaria: IIndicadorAnomalia;
    Causa: IIndicadorAnomalia;
    Acao: IIndicadorAnomalia;
    Precaucao: IIndicadorAnomalia;
    Imagens: IPneuImagem[];
}