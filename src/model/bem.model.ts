import { ICentroCusto } from "./centro-custo.model";
import { IStatus } from "./status.model";

export interface IBem{
    Id?: number;
    Placa: string;
    Frota: string;
    Descricao: string;
    Status: IStatus;
    CentroCusto: ICentroCusto;
}