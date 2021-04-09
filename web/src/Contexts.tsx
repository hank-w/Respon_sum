import { createContext } from 'react';
import type { Student } from './types/api';

export type StudentContextType = {
  student: Student | undefined,
  setStudent: (student: Student | undefined) => void,
};

export const StudentContext = createContext<StudentContextType>({
  student: undefined,
  setStudent: (_: Student | undefined) => {},
});