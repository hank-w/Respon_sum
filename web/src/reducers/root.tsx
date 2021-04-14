import { Store, Action } from '../types/store';
import { SET_STUDENT } from '../utils/Actions';

const INITIAL_STATE: Store = {};

export const rootReducer = (state: Store = INITIAL_STATE, action: Action): Store => {
  switch (action.type) {
    case SET_STUDENT:
      return {
        ...state,
        student: action.payload,
      };
    default:
      return state;
  }
};
