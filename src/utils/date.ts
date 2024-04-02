import { format, parseISO } from 'date-fns';

export const formatDate = (d: Date | string) => {
  const fDate = parseISO(String(d));
  return format(fDate, 'dd/MM/yyyy') ;
}

export const strToDate = (str: string) => {
  if (str && str !== ''){
    const ano = parseInt(str.slice(6, 10));
    const mes = parseInt(str.slice(3, 5));
    const dia = parseInt(str.slice(0, 2));

    return new Date(ano, mes-1, dia);
  }else
    return null;
}

export const dateToStr = (date: Date) => {
  if (date !== null){
    const str = date.toISOString();
    
    if (str !== ''){
      const ano = str.slice(0, 4);
      const mes = str.slice(5, 7);
      const dia = str.slice(8, 10);
      
      return `${dia}/${mes}/${ ano? ano : ''}`;
    }else
      return '';
  }else
    return '';
}

export const dateDBToStr = (date: Date) => {
  if (date && date !== null){
    const str = date.toString();
    if (str !== ''){
      const ano = str.slice(0, 4);
      const mes = str.slice(5, 7);
      const dia = str.slice(8, 10);
      
      return `${dia}/${mes}/${ ano? ano : ''}`;
    }else
      return '';
  }else
    return '';
}

export const dataAtual = (): string => {
  const date = new Date();
  date.setHours(date.getHours() - 3);
  return dateToStr(date);
};