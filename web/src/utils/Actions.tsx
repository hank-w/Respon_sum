import { Student } from '../types/api';
import { Instructor } from '../types/api';
import { Action } from '../types/store';

export const SET_STUDENT = 'SET_STUDENT';
export const SET_INSTRUCTOR = 'SET_INSTRUCTOR';

export const setStudent = (student?: Student): Action => {
  return {type: SET_STUDENT, payload: student};
};

export const setInstructor = (instructor?: Instructor): Action => {
  return {type: SET_INSTRUCTOR, payload: instructor};
};
