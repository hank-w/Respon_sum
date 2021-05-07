import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Store } from '../../types/store';
import { Question } from '../../types/api';
import { streamQuestions } from '../../api/websocket/client';
import { QUESTION_WEBSOCKET_URL } from '../../api/api';
import QuestionView from '../question/QuestionView';

export default () => {
  const student = useSelector((state: Store) => state.student);
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { classId } = useParams<any>();

  useEffect(() => streamQuestions({
    url: QUESTION_WEBSOCKET_URL + '?classId=' + classId,
    onReceive: (question: Question) => {
      setQuestion(question);
      setError(null);
    },
    onError: () => {
      setError('Network error!');
    },
    onClose: () => {
      setQuestion(null);
      setError(null);
    },
  }), []);

  if (student === undefined) {
    return <>You're not logged in!</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {question !== null ? (
        <QuestionView question={question} />
      ) : (
        'Sorry! No questions for now :('
      )}
      <span style={{ color: 'red' }}>{error}</span>
    </div>
  );
};
