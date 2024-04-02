import * as RNComponent from './app-loading.component.rn';

export type TaskResult<T = any> = [string, T];
export type Task = () => Promise<TaskResult | null>;

export const AppLoading = RNComponent.AppLoading;
export const LoadFontsTask = RNComponent.LoadFontsTask;
