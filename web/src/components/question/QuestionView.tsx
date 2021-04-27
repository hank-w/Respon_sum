import { Question } from '../../types/api';
import { Typography } from 'antd';

import MultipleChoiceButtons from './MultipleChoiceButtons';
import ShortAnswerText from './ShortAnswerText';

const { Title } = Typography;

export default ({
  question,
}: {
  question: Question,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {question.questionText ? (
        <Title>
          {question.questionText}
        </Title>
      ) : null}
      {question.type === 'multiple-choice' ? (
        <MultipleChoiceButtons question={question} onSelect={(i: number) => alert(`You selected ${i}`)} />
      ) : null}
      {question.type === 'short-answer' ? (
        <ShortAnswerText question={question} onSubmit={(s: string) => alert(`You wrote ${s}`)} /> 
      ) : null}
    </div>
  );
};
