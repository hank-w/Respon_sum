export type ID = string;

export type Stats = {
  numCorrect?: number,
  numIncorrect?: number,
  numUnresponded?: number,
};

export type Student = {
  id: ID,
  name?: string,
  email?: string,
  studentNumber?: string,
  institution?: string,
  performance?: Stats,
};
