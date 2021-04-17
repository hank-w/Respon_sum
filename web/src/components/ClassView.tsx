import { Class } from '../types/api';
import { ClassViewWrapper, ClassInformation } from './style/ClassView';
import { BookOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Text } = Typography;

const ClassView = ({
  clazz,
  onClick,
  children,
}: {
  clazz: Class,
  onClick?: (event: React.MouseEvent) => void,
  children?: React.ReactNode
}) => {
  const titleProps = { onClick };
  return (
    <ClassViewWrapper active={clazz.active}>
      <BookOutlined style={{ fontSize: '30px' }} />
      <ClassInformation>
        <Text {...titleProps} strong style={{ fontSize: '1.2em' }}>{clazz.name}</Text>
        <Text>{clazz.institution}</Text>
      </ClassInformation>
      {children}
    </ClassViewWrapper>
  );
};

export default ClassView;
