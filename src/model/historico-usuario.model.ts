export interface IItemHistoricoUsuario{
    Data: Date;
    Quant: number;
}

export interface IHistoricoUsuario{
    IdUsuario?: number;
    AfericoesHoje: number;
    Afericoes7Dias: number;
    Afericoes30Dias: number;
    MovimentacoesHoje: number;
    Movimentacoes7Dias: number;
    Movimentacoes30Dias: number;
    Datas: Date[];
    Afericoes: IItemHistoricoUsuario[];
    Movimentacoes: IItemHistoricoUsuario[];
}

