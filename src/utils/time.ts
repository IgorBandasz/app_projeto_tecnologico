import { format, parseISO } from 'date-fns';

export const formatTime = (d: Date | string) => {
  const fTime = parseISO(String(d));
  return format(fTime, 'HH:mm');
}

export const strToTime = (str: string) => {
  if (str !== ''){
    const hora = parseInt(str.slice(0, 2));
    const minuto = parseInt(str.slice(3, 5));

    return new Date(null, null, null, hora-2, minuto);
  }else
    return null;
}

export const timeToStr = (date: Date) => {
  if (date !== null){
    const str = date.toISOString();
    if (str !== ''){
      const hora = str.slice(11, 13);
      const minuto = str.slice(14, 16);

      return `${hora}:${minuto}`;
    }else
      return '';
  }else 
    return '';
}

export const timeDBToStr = (date: Date) => {
  if (date !== null){
    const str = date.toString();
    if (str !== ''){
      const hora = str.slice(11, 13);
      const minuto = str.slice(14, 16);

      return `${hora}:${minuto}`;
    }else
      return '';
  }else 
    return '';
}

export const horaAtual = (): string => {
  const date = new Date();
  date.setHours(date.getHours() - 3);
  return timeToStr(date);
};

export const minToHourString = (min: number): string => {
  if(min > 0){
    const hora = Math.trunc(min / 60);
    const minuto = min - (hora * 60);

    
    return `${hora}`.padStart(2,'0') + `:` + `${minuto}`.padStart(2,'0')
  }else 
    return '';
};