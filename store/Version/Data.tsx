import { Action, Reducer } from 'redux';
import { AppThunkAction } from "..";

export interface VersionState {
  StrVer: string;
}

export interface SetVersion {
  type: 'SET_VERSION_DATA',
  StrVer: string,
}
export interface RemoveVersion {
  type: 'REMOVE_VERSION_DATA'
}

type KnownAction = SetVersion | RemoveVersion;

export const actionCreators = {
  setVersion: (_StrVer: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({ type: 'SET_VERSION_DATA', StrVer:_StrVer });
  },
  removeVersion: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({ type: 'REMOVE_VERSION_DATA' });
  }
};

const unloadedState: VersionState = { StrVer: '1.0.0' };

export const reducer: Reducer<VersionState> = (state: VersionState | undefined, incomingAction: Action): VersionState => {
  if (state === undefined) {
    return unloadedState;
  }
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case 'SET_VERSION_DATA':
      return {
        StrVer: action.StrVer,
      };
    case 'REMOVE_VERSION_DATA':
    return {
      StrVer: '',
    };
    default:
      const exhaustiveCheck: never = action;
  }
  return state || unloadedState;
};
