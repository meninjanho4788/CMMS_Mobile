import { Action, Reducer } from 'redux';
import { AppThunkAction } from "..";

export interface LoginState {
  Infor: InforLogin;
}

export interface SetLogin {
  type: 'SET_LOGIN_DATA',
  Infor: InforLogin,
}
export interface RemoveLogin {
  type: 'REMOVE_LOGIN_DATA'
}

type KnownAction = SetLogin | RemoveLogin;

export const actionCreators = {
  setLogin: (_Infor: InforLogin): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({ type: 'SET_LOGIN_DATA', Infor:_Infor });
  },
  removeLogin: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({ type: 'REMOVE_LOGIN_DATA' });
  }
};

const unloadedState: LoginState = { Infor: {Result:'',UserName:'',EmployeeNo:'',GroupUser:'',DefaultLanguage:'', Role: '', Picture: '', Token: '', FullName: '' } };

export const reducer: Reducer<LoginState> = (state: LoginState | undefined, incomingAction: Action): LoginState => {
  if (state === undefined) {
    return unloadedState;
  }
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case 'SET_LOGIN_DATA':
      return {
        Infor: action.Infor,
      };
    case 'REMOVE_LOGIN_DATA':
    return {
      Infor: { Result: '',UserName: '',EmployeeNo:'',GroupUser:'',DefaultLanguage:'', Role: '', Picture: '', Token: '', FullName: '' },
    };
    default:
      const exhaustiveCheck: never = action;
  }
  return state || unloadedState;
};

interface InforLogin {
  Result: string;
  UserName: string;
  EmployeeNo: string;
  GroupUser: string;
  DefaultLanguage: string;
  Role: string;
  Picture: string;
  Token: string;
  FullName: string;
}
