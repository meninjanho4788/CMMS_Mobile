import { Action, Reducer } from 'redux';
import { AppThunkAction } from "..";

export interface PermissionState {
  Infor: Array<InforPermission>;
}

export interface SetPermission {
  type: 'SET_PERMISSION_DATA',
  Infor: Array<InforPermission>
}
export interface RemovePermission {
  type: 'REMOVE_PERMISSION_DATA'
}

type KnownAction = SetPermission | RemovePermission;

export const actionCreators = {
  setPermission: (_Infor: Array<InforPermission>): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({ type: 'SET_PERMISSION_DATA', Infor:_Infor });
  },
  removePermission: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({ type: 'REMOVE_PERMISSION_DATA' });
  }
};

const unloadedState: PermissionState = { Infor: [] };

export const reducer: Reducer<PermissionState> = (state: PermissionState | undefined, incomingAction: Action): PermissionState => {
  if (state === undefined) {
    return unloadedState;
  }
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case 'SET_PERMISSION_DATA':
      return {
        Infor: action.Infor,
      };
    case 'REMOVE_PERMISSION_DATA':
    return {
      Infor: [],
    };
    default:
      const exhaustiveCheck: never = action;
  }
  return state || unloadedState;
};

interface InforPermission {
  ObjectName: string;
  IsVisible: number;
  IsReadonly: number;
  IsInsert: number;
  IsUpdate: number;
  IsDelete: number;
  IsPrint: number;
}

