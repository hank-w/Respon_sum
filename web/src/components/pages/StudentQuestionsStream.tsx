import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Store } from '../../types/store';
import { Question, Response } from '../../types/api';
import { streamQuestions } from '../../api/websocket/client';
import { createResponseToQuestion } from '../../api/classes';
import { QUESTION_WEBSOCKET_URL } from '../../api/api';
import QuestionView from '../question/QuestionView';

export default () => {
  const [loading, setLoading] = useState(false);
  const student = useSelector((state: Store) => state.student);
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { classId } = useParams<any>();

  if (student === undefined) {
    return <>You're not logged in!</>;
  }

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

  const sendResponse = (response: Response) => {
    if (question === null) {
      return;
    }

    setLoading(true);
    createResponseToQuestion(student.id, classId, question, response)
    .then(res => {
      setError(null);
    })
    .catch(err => {
      setError(err?.message+'' || err?.msg+'' || err+'');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  if (student === undefined) {
    return <>You're not logged in!</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {question !== null ? (
        <QuestionView question={question} onSubmit={sendResponse} />
      ) : (
        'Sorry! No questions for now :('
      )}
      <span style={{ color: 'red' }}>{error}</span>
      {loading ? 'Submitting...' : null}
    </div>
  );
};
