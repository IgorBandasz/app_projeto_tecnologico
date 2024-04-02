import { maskCurrency } from "../components/mask.format";

export const formatMoeda = (num: number = 0) => {
  return `${maskCurrency(num.toFixed(2))}`;
}

export const formatPercentual = (num: number = 0) => {
  return `${maskCurrency(num.toFixed(4), 4)}`;
}

export const formatQuant = (num: number = 0, casas: number = 2) => {
  return `${maskCurrency(num.toFixed(casas),casas)}`;
}

export const formatValorUnit = (num: number = 0, casas: number = 2) => {
  return `${maskCurrency(num.toFixed(casas), casas)}`;
}

export const strToFloat = (value: string) => {
  return parseFloat(value.replace(/\./g, "").replace(/\,/g, "."));
}
