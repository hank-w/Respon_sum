import { Question } from '../../types/api';
import { Button, Space } from 'antd';

export default ({
  question,
  onSelect,
}: {
  question: Question,
  onSelect: (selected: number) => void,
}) => {
  if (question.type !== 'multiple-choice') {
    return null;
  }

  const makeButton = (num: number, onClick: () => void, text?: string,) => {
    let buttonText = String.fromCharCode(num + 'A'.charCodeAt(0));
    if (text != null) {
      buttonText += `. ${text}`;
    }
    return (
      <Button type = "primary" size="large" onClick={onClick}>
        {buttonText}
      </Button>
    );
  };

  const buttons: JSX.Element[] = [];
  for (let i = 0; i < (question.numAnswers || 0); i++) {
    buttons.push(makeButton(i, () => onSelect(i), (question.answerText || [])[i]));
  }
  return (
    <Space direction="horizontal" size="large" style={{
      width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center',
    }}>
      {buttons}
    </Space>
  );
};
