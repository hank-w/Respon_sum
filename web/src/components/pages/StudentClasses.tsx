import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Space, Typography, Button } from 'antd';
import { getClassesByStudentId } from '../../api/students';
import { addStudentToClass, removeStudentFromClass, getAllClasses } from '../../api/classes';
import { Class } from '../../types/api';
import { Store } from '../../types/store';

import ClassView from '../ClassView';

const { Title } = Typography;

export default () => {
  const [yourClasses, setYourClasses] = useState<Class[]>([]);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [loadingYourClasses, setLoadingYourClasses] = useState(false);
  const [loadingAllClasses, setLoadingAllClasses] = useState(false);
  const [loadingJoinClass, setLoadingJoinClass] = useState(false);
  const [loadingLeaveClass, setLoadingLeaveClass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const student = useSelector((state: Store) => state.student);

  if (student === undefined) {
    return <>You're not logged in!</>;
  }

  const refreshClasses = useCallback(() => {
    setLoadingYourClasses(true);
    getClassesByStudentId(student.id)
    .then(res => {
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
      setAllClasses(res.data);
      setError(null);
    })
    .catch(err => {
      setError(err+'');
    })
    .finally(() => {
      setLoadingAllClasses(false);
    });
  }, [student]);

  useEffect(refreshClasses, []);

  const joinClass = (clazz: Class) => {
    setLoadingJoinClass(true);
    addStudentToClass(student.id, clazz)
    .then(() => {
      refreshClasses();
    })
    .catch(err => {
      setError(err+'');
    })
    .finally(() => {
      setLoadingJoinClass(false);
    });
  };

  const leaveClass = (clazz: Class) => {
    setLoadingLeaveClass(false);
    removeStudentFromClass(student.id, clazz)
    .then(() => {
      refreshClasses();
    })
    .catch(err => {
      setError(err+'');
    })
    .finally(() => {
      setLoadingLeaveClass(false);
    });
  };

  const alreadyJoined = (clazz: Class) => yourClasses.some(c => c.id == clazz.id);
  const canJoinClass = (clazz: Class) => clazz.active && !alreadyJoined(clazz);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>Your Classes</Title>
        {loadingYourClasses ? 'Loading...' : null}
        {yourClasses.map(clazz => (
          <ClassView clazz={clazz} key={clazz.id}>
            <Button type="primary" size="large"
                onClick={() => leaveClass(clazz)} loading={loadingLeaveClass}>
              Leave class
            </Button>
          </ClassView>
        ))}
      </div>
      <div>
        <Title level={2}>All Classes</Title>
        {loadingAllClasses ? 'Loading...' : null}
        {allClasses.map(clazz => (
          <ClassView clazz={clazz} key={clazz.id}>
            <Button type="primary" size="large" disabled={!canJoinClass(clazz)}
                onClick={() => joinClass(clazz)} loading={loadingJoinClass}>
              {
                canJoinClass(clazz) ? 'Enroll in class' : (
                  alreadyJoined(clazz) ? 'Already joined' : 'Not active'
                )
              }
            </Button>
          </ClassView>
        ))}
      </div>
      <span style={{color:'red'}}>{error}</span>
    </Space>
  );
};
