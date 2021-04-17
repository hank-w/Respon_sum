export type ID = string;

export type Stats = {
  numCorrect?: number,
  numIncorrect?: number,
  numUnresponded?: number,
};

export type Student = {
  id: ID,
  name: string,
  email: string,
  studentNumber: string,
  institution: string,
  performance?: Stats,
};

export type Class = {
  id: ID,
  name: string,
  active: boolean,
  institution: string,
  instructorIds?: string[],
};
