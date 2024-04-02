export const maskPlaca = (value: string) => {
  value = value.replace(/[^a-zA-Z0-9]/g, ''); //deixa somente numeros e letras
  value = value.substr(0, 3).replace(/[^a-zA-Z]/g, '') + '-'
    + value.substr(3, 1).replace(/\D/g, "")
    + value.substr(4, 1).replace(/[^a-zA-Z0-9]/g, '')
    + value.substr(5, 2).replace(/\D/g, "")
  return value.toLocaleUpperCase()
}

export const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2");
}

// (11)1111-1111
export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1)$2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
}

// 11/11/1111
export const maskDate = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "$1/$2")
    .replace(/^(\d{2}\/\d{2})(\d)/g, "$1/$2");
}

// 11:11
export const maskTime = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "$1:$2");
}

export const maskInteger = (value: string) => {
  if(value == '')
    value= '0';
    
  return value
    .replace(/\D/g, "");
}

export const maskCurrency = (value: string, casas: number = 2) => {
  if(value == '')
    value= '0';

  var regex = new RegExp("(\\d)(\\d{" + casas + "})$");
  return value
    .replace(/\D/g, "")
    .replace(regex, "$1,$2")
    //.replace(/(?=(\d{3})+(\D))\B/g, ".");
}

export const maskFloat = (value: string, casas: number = 2) => {
  const inteiro = new RegExp("^[0-9]*$");

  if(value == '')
    value= '0';

  if(inteiro.test(value))
    return value;

    
  
  var regex = new RegExp("(\\d)(\\d{" + casas + "})$");
  return value
    .replace(/\D/g, "")
    .replace(regex, "$1,$2")
    //.replace(/(?=(\d{3})+(\D))\B/g, ".");
}

export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
}