import AsyncStorage from '@react-native-async-storage/async-storage';

import { Mapping, Theme } from './theme.service';
import { IConfiguracao } from '../model/configuracao.model';
import { ILogin } from '../model/login-model';
import { IFilial } from '../model/filial.model';
import { IUsuario } from '../model/usuario-model';
import { ICfgObrigatoriedade } from '../model/cfg-obrigatoriedade.model';
import { IConfiguracaoGeral } from '../model/configuracao-geral.model';

const MAPPING_KEY: string = 'mapping';
const THEME_KEY: string = 'theme';
const CONFIGURACAO_KEY: string = 'configuracao';
const LOGIN_KEY: string = 'login';
const USUARIO_KEY: string = 'usuario';
const FILIAL_KEY: string = 'filial';
const CONFIGURACAO_OBRIGATORIEDADE_KEY: string = 'obrigatoriedade';
const CONFIGURACAO_GERAL_KEY: string = 'configuracao-geral';

export class AppStorage {

  static getMapping = (fallback?: Mapping): Promise<Mapping> => {
    return AsyncStorage.getItem(MAPPING_KEY).then((mapping: Mapping) => {
      return mapping || fallback;
    });
  };

  static setMapping = (mapping: Mapping): Promise<void> => {
    return AsyncStorage.setItem(MAPPING_KEY, mapping);
  };

  static getTheme = (fallback?: Theme): Promise<Theme> => {
    return AsyncStorage.getItem(THEME_KEY).then((theme: Theme) => {
      return theme || fallback;
    });
  };

  static setTheme = (theme: Theme): Promise<void> => {
    return AsyncStorage.setItem(THEME_KEY, theme);
  };

  //********/

  static getConfiguracao = (fallback?: IConfiguracao): Promise<IConfiguracao> => {
    return AsyncStorage.getItem(CONFIGURACAO_KEY).then((cfg: string) => {
      return cfg ? JSON.parse(cfg) : { host: '' } as IConfiguracao || fallback;
    });
  };

  static setConfiguracao = (cfg: IConfiguracao): Promise<void> => {
    return AsyncStorage.setItem(CONFIGURACAO_KEY, JSON.stringify(cfg));
  };

  //********/

  static getLogin = (fallback?: ILogin): Promise<ILogin> => {
    return AsyncStorage.getItem(LOGIN_KEY).then((login: string) => {
      return login ? JSON.parse(login) : {} as ILogin || fallback;
    });
  };

  static setLogin = (login: ILogin): Promise<void> => {
    return AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(login));
  };

  //********/  

  static getUsuario = (fallback?: IUsuario): Promise<IUsuario> => {
    return AsyncStorage.getItem(USUARIO_KEY).then((usuario: string) => {
      return JSON.parse(usuario) as IUsuario || fallback;
    });
  };

  static setUsuario = (usuario: IUsuario): Promise<void> => {
    return AsyncStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  };

  //********/

  static getFilial = (fallback?: IFilial): Promise<IFilial> => {
    return AsyncStorage.getItem(FILIAL_KEY).then((filial: string) => {
      return JSON.parse(filial) as IFilial || fallback;
    });
  };

  static setFilial = (filial: IFilial): Promise<void> => {
    return AsyncStorage.setItem(FILIAL_KEY, JSON.stringify(filial));
  };

  //********/

  static getObrigatoriedade = (fallback?: ICfgObrigatoriedade): Promise<ICfgObrigatoriedade> => {
    return AsyncStorage.getItem(CONFIGURACAO_OBRIGATORIEDADE_KEY).then((obrig: string) => {
      return JSON.parse(obrig) as ICfgObrigatoriedade || fallback;
    });
  };

  static setObrigatoriedade = (obrig: ICfgObrigatoriedade): Promise<void> => {
    return AsyncStorage.setItem(CONFIGURACAO_OBRIGATORIEDADE_KEY, JSON.stringify(obrig));
  };

  //********/

  static getConfiguracaoGeral = (fallback?: IConfiguracaoGeral): Promise<IConfiguracaoGeral> => {
    return AsyncStorage.getItem(CONFIGURACAO_GERAL_KEY).then((cfg: string) => {
      return cfg ? JSON.parse(cfg) : { CaminhoImagem: '' } as IConfiguracaoGeral || fallback;
    });
  };

  static setConfiguracaoGeral = (cfg: IConfiguracaoGeral): Promise<void> => {
    return AsyncStorage.setItem(CONFIGURACAO_GERAL_KEY, JSON.stringify(cfg));
  };

  //********/

}
