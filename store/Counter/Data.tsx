import { Action, Reducer } from 'redux';
import { AppThunkAction } from "..";

export interface CounterState {
  idx: number;
  isLoading: boolean;
}

export interface SetCounter {
  type: 'SET_COUNTER_DATA',
  idx: number,
  isLoading: boolean,
}

type KnownAction = SetCounter;

export const actionCreators = {
  setCounter: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const curS = getState().counterData;
    const idxO = curS?.idx === undefined ? 0 : curS?.idx;
    dispatch({ type: 'SET_COUNTER_DATA', idx: idxO+1, isLoading: false });
  }
};

const unloadedState: CounterState = { idx: 0, isLoading: false };

export const reducer: Reducer<CounterState> = (state: CounterState | undefined, incomingAction: Action): CounterState => {
  if (state === undefined) {
    return unloadedState;
  }
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case 'SET_COUNTER_DATA':
      return {
        idx: action.idx,
        isLoading: action.isLoading,
      };
    default:
      const exhaustiveCheck: any = action; // any or never
  }
  return state || unloadedState;
};
