import * as ConnectData from './Connect/Data';
import * as CounterData from './Counter/Data';
import * as LoginData from './Login/Data';
import * as PermissionData from './Login/Permission';
import * as LangData from './Language/Data';
import * as VersionData from './Version/Data';

export interface ApplicationState {
  connectData: ConnectData.ConnectState | undefined;
  counterData: CounterData.CounterState | undefined;
  loginData: LoginData.LoginState | undefined;
  permissionData: PermissionData.PermissionState | undefined;
  langData: LangData.LangState | undefined;
  versionData: VersionData.VersionState | undefined;
}

export const reducers = {
  connectData: ConnectData.reducer,
  counterData: CounterData.reducer,
  loginData: LoginData.reducer,
  permissionData: PermissionData.reducer,
  langData: LangData.reducer,
  versionData: VersionData.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
