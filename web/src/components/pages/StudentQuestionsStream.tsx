import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Store } from '../../types/store';
import { Question } from '../../types/api';

import  QuestionView  from '../question/QuestionView';

export default () => {
  const student = useSelector((state: Store) => state.student);  
  const { classId } = useParams<any>();

  if (student === undefined) {
    return <>You're not logged in!</>;
  }

  const question: Question = {
    id: '608769775c67673520670998',
    asked: 0,
    timestamps: [],
    type: 'short-answer',
    questionText: 'What is the meaning of life?',
    // numAnswers: 4,
    // answerText: ['42', '24', '420', 'not 42'],
    correctAnswer: 'foo',
  };

  return (
    <QuestionView question={question} />
  );
};
