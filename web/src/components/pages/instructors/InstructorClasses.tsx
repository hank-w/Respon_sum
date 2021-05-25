import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Space, Input, Form, Typography } from 'antd';
import { getClassesByInstructorId } from '../../../api/instructors';
import { addInstructorToClass, removeInstructorFromClass, getAllClasses, createClass } from '../../../api/classes';
import { Class } from '../../../types/api';
import { Store } from '../../../types/store';

import ClassView from '../../ClassView';
import { INSTRUCTORS_PATH } from '../../../utils/Paths';

const { Title } = Typography;

const DEFAULT_CLASS: Class = {
  id: '',
  name: '',
  active: true,
  institution: '',
  instructorIds: ["6094bae1f1bc341ba082e60f"]
};

export default () => {
  const [yourClasses, setYourClasses] = useState<Class[]>([]);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [loadingYourClasses, setLoadingYourClasses] = useState(false);
  const [loadingAllClasses, setLoadingAllClasses] = useState(false);
  const [loadingJoinClass, setLoadingJoinClass] = useState(false);
  const [loadingDeleteClass, setLoadingDeleteClass] = useState(false);
  const [loadingCreateClass, setLoadingCreateClass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingClass, setCreatingClass] = useState(DEFAULT_CLASS);

  const instructor = useSelector((state: Store) => state.instructor);
  const history = useHistory();

  if (instructor === undefined) {
    return <>You're not logged in!</>;
  }

  const refreshClasses = useCallback(() => {
    setLoadingYourClasses(true);
    getClassesByInstructorId(instructor.id)
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
  }, [instructor]);

  useEffect(refreshClasses, []);

  const joinClass = (clazz: Class) => {
    setLoadingJoinClass(true);
    addInstructorToClass(instructor.id, clazz)
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
    setLoadingDeleteClass(false);
    removeInstructorFromClass(instructor.id, clazz)
    .then(() => {
      refreshClasses();
    })
    .catch(err => {
      setError(err+'');
    })
    .finally(() => {
      setLoadingDeleteClass(false);
    });
  };

  const addClass = () => {
    setLoadingCreateClass(true);
    createClass(creatingClass as Class)
    .then(res => {
      setError(null);
      const id = res.data.id +'';
      const newClass = {...creatingClass, id};
      history.push(INSTRUCTORS_PATH);
    })
    .catch(err => {
      console.log(err);
      setError(err?.message+'' || err?.msg+'' || err+'')
    })
    .finally(() => {
      setLoadingCreateClass(false);
    })
  };

  const alreadyJoined = (clazz: Class) => yourClasses.some(c => c.id == clazz.id);
  const canJoinClass = (clazz: Class) => clazz.active && !alreadyJoined(clazz);

  const s = (creatingClass as Class);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>Your Classes</Title>
        {loadingYourClasses ? 'Loading...' : null}
        {yourClasses.map(clazz => (
          <ClassView clazz={clazz} key={clazz.id}>
            <Button type="primary" size="large" danger
                onClick={() => leaveClass(clazz)} loading={loadingDeleteClass}>
              Delete class
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

      <Space direction="vertical" size="large" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <div>
        <Title level={2}>Create a Class</Title>
        <span style={{color:'red'}}>{error}</span>
        <Form onFinish={createClass}>
          <Form.Item label="Name" required>
            <Input placeholder="Memes 123" value={s.name}
              onChange={e => setCreatingClass({...s, name: e.target.value})} />
          </Form.Item>
          <Form.Item label="Active" required >
            <Input placeholder="true" 
              onChange={e => setCreatingClass({...s, active: true})} />
          </Form.Item>
          <Form.Item label="Institution" required>
            <Input placeholder="University of Awesome" value={s.institution}
              onChange={e => setCreatingClass({...s, institution: e.target.value})}/>
          </Form.Item>
          <Form.Item label="Instructors" required>
            <Input placeholder={instructor.id+''} value={[s.instructorIds+'']}
              onChange={e => setCreatingClass({...s, instructorIds: [instructor.id+'']})} />
          </Form.Item> 
          <Button type="primary" htmlType="submit">
            Create Class
          </Button>
        </Form>
      </div>
    </Space>

    </Space>
      
  );
};
