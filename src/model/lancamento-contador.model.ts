import { IBem } from "./bem.model";

export interface IValidacaoContador{
    IdContador?: number;
    NomeContador: string;
    ContadorSugerido: string;
    TipoInconsistencia: number;
    Inconsistente: boolean;       
}

export interface IContador{
    Id?: number;
    NomeContador: string;
    TipoContador: number;
    ContadorAtual: number;
    ContadorAtualStr: string;       
}

export interface ILancamentoContador{
    Id?: number;
    Contador: IContador;
    Bem: IBem;
    ContadorNovo: number;
    ContadorNovoStr: string;
    Data: Date;
    DataString: string;
    Hora: Date;
    HoraString: string;
    Observacao: string;
    IdOperador: number;
}