import { createContext } from 'react';
import type { Student } from './types/api';

export type StudentContextType = {
  student: Student | undefined,
  setStudent: (student: Student) => void,
};

export const StudentContext = createContext<StudentContextType>({
  student: undefined,
  setStudent: (_: Student) => {},
});

export const connectStudent = (Component: React.ElementType<StudentContextType>) => () => (
  <StudentContext.Consumer>
    {ctx => <Component {...ctx} />}
  </StudentContext.Consumer>
);
