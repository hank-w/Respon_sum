import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Space, Typography, Button } from 'antd';
import { getClassesByStudentId } from '../../api/students';
import { addStudentToClass, getAllClasses } from '../../api/classes';
import { Class } from '../../types/api';
import { Store } from '../../types/store';

import ClassView from '../ClassView';

const { Title } = Typography;

export default () => {
  const [yourClasses, setYourClasses] = useState<Class[]>([]);
  const [loadingYourClasses, setLoadingYourClasses] = useState(false);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [loadingAllClasses, setLoadingAllClasses] = useState(false);
  const [loadingJoinClass, setLoadingJoinClass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const student = useSelector((state: Store) => state.student);

  if (student === undefined) {
    return <>You're not logged in!</>;
  }

  useEffect(() => {
    setLoadingYourClasses(true);
    getClassesByStudentId(student.id)
    .then(res => {
      console.log(res);
      setYourClasses(res.data);
      setError(null);
    })
    .catch(err => {
      setError(err+'');
    })
    .finally(() => {
      setLoadingYourClasses(false);
    });

    setLoadingAllClasses(true);
    getAllClasses()
    .then(res => {
      console.log(res);
      setAllClasses(res.data);
      setError(null);
    })
    .catch(err => {
      setError(err+'');
    })
    .finally(() => {
      setLoadingAllClasses(false);
    });
  }, []);

  const joinClass = (clazz: Class) => {
    alert(clazz+'');
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>Your Classes</Title>
        {loadingYourClasses ? 'Loading...' : null}
        {yourClasses.map(clazz => <ClassView clazz={clazz} key={clazz.id} />)}
      </div>
      <div>
        <Title level={2}>All Classes</Title>
        {loadingAllClasses ? 'Loading...' : null}
        {allClasses.map(clazz => (
          <ClassView clazz={clazz} key={clazz.id}>
            <Button type="primary" size="large" disabled={!clazz.active}
                onClick={() => joinClass(clazz)} loading={loadingJoinClass}>
              Enroll in Class
            </Button>
          </ClassView>
        ))}
      </div>
    </Space>
  );
};
