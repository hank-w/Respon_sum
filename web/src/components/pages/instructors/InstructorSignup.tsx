import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Space, Input, Form, Typography } from 'antd';
import { createInstructor } from '../../../api/instructors';
import { INSTRUCTORS_PATH } from '../../../utils/Paths';
import { useDispatch } from 'react-redux';
import { Instructor } from '../../../types/api';
import { setInstructor } from '../../../utils/Actions';

const { Title } = Typography;

const DEFAULT_STUDENT: Instructor = {
  id: '',
  name: '',
  email: '',
  institution: '',
};

const InstructorSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingInstructor, setCreatingInstructor] = useState(DEFAULT_STUDENT);
  const dispatch = useDispatch();
  const history = useHistory();

  const createAccount = () => {
    setLoading(true);
    createInstructor(creatingInstructor as Instructor)
    .then(res => {
      setError(null);
      const id = res.data.id + '';
      alert(`Your UUID is "${id}". Don't lose it! Put it somewhere safe!`);
      const newInstructor = { ...creatingInstructor, id };
      dispatch(setInstructor(newInstructor));
      history.push(INSTRUCTORS_PATH);
    })
    .catch(err => {
      console.log(err);
      setError(err?.message+'' || err?.msg+'' || err+'');
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  const s = (creatingInstructor as Instructor);
  return (
    <Space direction="vertical" size="large" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <div>
        <Title level={2}>Sign up</Title>
        <span style={{color:'red'}}>{error}</span>
        <Form onFinish={createAccount}>
          <Form.Item label="Name" required>
            <Input placeholder="John Smith" value={s.name}
              onChange={e => setCreatingInstructor({...s, name: e.target.value})} />
          </Form.Item>
          <Form.Item label="Email" required >
            <Input placeholder="jsmith@awesome.edu" value={s.email} 
              onChange={e => setCreatingInstructor({...s, email: e.target.value})} />
          </Form.Item>
          <Form.Item label="Institution" required>
            <Input placeholder="University of Awesome" value={s.institution}
              onChange={e => setCreatingInstructor({...s, institution: e.target.value})}/>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Create Account
          </Button>
        </Form>
      </div>
    </Space>
  );
};

export default InstructorSignup;
