import { useState } from 'react';
import { Question } from '../../types/api';
import { Input } from 'antd';

const { TextArea } = Input;

export default ({
  question,
  onSubmit,
}: {
  question: Question,
  onSubmit: (answer: string) => void,
}) => {
  const [answer, setAnswer] = useState('');

  if (question.type !== 'short-answer') {
    return null;
  }

  return (
    <Input placeholder="Basic usage" onPressEnter={() => onSubmit(answer)}
      onChange={e => setAnswer(e.target.value)} />
  );
};
