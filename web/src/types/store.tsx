import { Student } from './api';

export type Store = {
  student?: Student,
};

export type Action = {
  type: string,
  payload: any,
};
