import { Student } from '../types/api';
import { Action } from '../types/store';

export const SET_STUDENT = 'SET_STUDENT';

export const setStudent = (student?: Student): Action => {
  return {type: SET_STUDENT, payload: student};
};
