export interface IItemHistoricoPneu{
    Id: number;
    Nome: string;
    CalculaTotal: boolean;
    R0: string;
    R1: string;
    R2: string;
    R3: string;
    R4: string;
    R5: string;
    Total: number;
}

export interface IHistoricoPneu{
    IdPneu?: number;
    Indicadores: IItemHistoricoPneu[];
}