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

export type Question = {
  id: string,
  asked: number,
  timestamps: {
    started: string,
    stopped: string,
  }[],
  stats?: Stats[],
  questionText?: string,
  type: 'multiple-choice' | 'short-answer',
  numAnswers?: number,
  correctAnswer?: number | string,
  answerText?: string[],
};
