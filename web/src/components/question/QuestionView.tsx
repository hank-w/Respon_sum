import { Question, Response } from '../../types/api';
import { Typography } from 'antd';

import MultipleChoiceButtons from './MultipleChoiceButtons';
import ShortAnswerText from './ShortAnswerText';

const { Title } = Typography;

export default ({
  question,
  onSubmit,
}: {
  question: Question,
  onSubmit: (response: Response) => void,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {question.questionText ? (
        <Title>
          {question.questionText}
        </Title>
      ) : null}
      {question.type === 'multiple-choice' ? (
        <MultipleChoiceButtons question={question} onSelect={(i: number) => onSubmit({answerNumber: i})} />
      ) : null}
      {question.type === 'short-answer' ? (
        <ShortAnswerText question={question} onSubmit={(s: string) => onSubmit({answerText: s})} /> 
      ) : null}
    </div>
  );
};
