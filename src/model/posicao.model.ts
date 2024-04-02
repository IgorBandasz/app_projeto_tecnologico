import { IBem } from "./bem.model";
import { IPneu } from "./pneu.model";

export interface IPosicaoPneu{
    Pneu?: IPneu;
    Bem?: IBem;
    Posicao: string;
    Eixo: string;
    Rodado: string;
    Tracao?: boolean;

    DataInstalacao?: Date;
    HoraInstalacao?: Date;
}

export interface ITrocaPneu{
    PosicaoOrigem: IPosicaoPneu;
    PosicaoDestino: IPosicaoPneu;
}