import { Action, Reducer } from 'redux';
import { AppThunkAction } from "..";

export interface ConnectState {
  StrCont: string;
}

export interface SetConnect {
  type: 'SET_CONNECT_DATA',
  StrCont: string,
}
export interface RemoveConnect {
  type: 'REMOVE_CONNECT_DATA'
}

type KnownAction = SetConnect | RemoveConnect;

export const actionCreators = {
  setConnect: (_StrCont: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({ type: 'SET_CONNECT_DATA', StrCont:_StrCont });
  },
  removeConnect: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({ type: 'REMOVE_CONNECT_DATA' });
  }
};

const unloadedState: ConnectState = { StrCont: '' };

export const reducer: Reducer<ConnectState> = (state: ConnectState | undefined, incomingAction: Action): ConnectState => {
  if (state === undefined) {
    return unloadedState;
  }
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case 'SET_CONNECT_DATA':
      return {
        StrCont: action.StrCont,
      };
    case 'REMOVE_CONNECT_DATA':
    return {
      StrCont: '',
    };
    default:
      const exhaustiveCheck: never = action;
  }
  return state || unloadedState;
};
