import { IPosicaoPneu } from "./posicao.model";

export interface IEixo{
    Id?: number;
    //Sigla: string;
    Step: boolean;
    PosicaoPneus: IPosicaoPneu[];
}

export interface IChassi{
    Id?: number;
    Nome: string;
    SiglaEixoA: string;
    SiglaEixoB: string;
    SiglaEixoC: string;
    SiglaEixoD: string;
    SiglaEixoE: string;
    SiglaEixoF: string;
    SiglaEixoG: string;
    SiglaEixoH: string;

    EixoAVisivel: number;
    EixoBVisivel: number;
    EixoCVisivel: number;
    EixoDVisivel: number;
    EixoEVisivel: number;
    EixoFVisivel: number;
    EixoGVisivel: number;
    EixoHVisivel: number;

    TracaoEixoA: number;
    TracaoEixoB: number;
    TracaoEixoC: number;
    TracaoEixoD: number;
    TracaoEixoE: number;
    TracaoEixoF: number;
    TracaoEixoG: number;
    TracaoEixoH: number;

    DianteiroEixoA: number;
    DianteiroEixoB: number;
    DianteiroEixoC: number;
    DianteiroEixoD: number;
    DianteiroEixoE: number;
    DianteiroEixoF: number;
    DianteiroEixoG: number;
    DianteiroEixoH: number;

    EixoA: string;
    EixoB: string;
    EixoC: string;
    EixoD: string;
    EixoE: string;
    EixoF: string;
    EixoG: string;
    EixoH: string;
    EixoZ: string;

    SiglaRodadoA: string;
    SiglaRodadoB: string;
    SiglaRodadoC: string;
    SiglaRodadoD: string;
    SiglaRodadoE: string;
    SiglaRodadoF: string;
}