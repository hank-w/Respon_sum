import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography, Button } from 'antd';
import { getClassesByStudentId } from '../../api/students';
import { Class } from '../../types/api';
import { Store } from '../../types/store';
import ClassView from '../ClassView';
import { STUDENTS_QUESTIONS_PATH } from '../../utils/Paths';

const { Title } = Typography;

export default () => {
  const student = useSelector((state: Store) => state.student);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  if (student === undefined) {
    return <>You're not logged in!</>;
  }

  useEffect(() => {
    setLoadingClasses(true);
    getClassesByStudentId(student.id)
    .then(res => {
      setClasses(res.data);
      setError(null);
    })
    .catch(err => {
      setError(err+'');
    })
    .finally(() => {
      setLoadingClasses(false);
    });
  }, []);

  const goToQuestion = (clazz: Class) => {
    history.push(STUDENTS_QUESTIONS_PATH.replace(':classId', clazz.id));
  };

  return (
    <>
      <Title level={2}>Classes</Title>
      {loadingClasses ? 'Loading...' : null}
      {classes.map(clazz => (
        <ClassView clazz={clazz} key={clazz.id}>
          <Button type="primary" size="large" loading={loadingClasses} onClick={() => goToQuestion(clazz)}>
            Go to questions
          </Button>
        </ClassView>
      ))}
      <span style={{color:'red'}}>{error}</span>
    </>
  );
};
