import { Student, Instructor } from './api';

export type Store = {
  student?: Student,
  instructor?: Instructor
};

export type Action = {
  type: string,
  payload: any,
};
