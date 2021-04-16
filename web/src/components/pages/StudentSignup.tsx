import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Space, Input, Form, Typography } from 'antd';
import { createStudent } from '../../api/students';
import { STUDENTS_PATH } from '../../utils/Paths';
import { useDispatch } from 'react-redux';
import { Student } from '../../types/api';
import { setStudent } from '../../utils/Actions';

const { Title } = Typography;

const DEFAULT_STUDENT: Student = {
  id: '',
  name: '',
  email: '',
  studentNumber: '',
  institution: '',
};

const StudentSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingStudent, setCreatingStudent] = useState(DEFAULT_STUDENT);
  const dispatch = useDispatch();
  const history = useHistory();

  const createAccount = () => {
    setLoading(true);
    createStudent(creatingStudent as Student)
    .then(res => {
      setError(null);
      const id = res.data.id + '';
      alert(`Your UUID is "${id}". Don't lose it! Put it somewhere safe!`);
      const newStudent = { ...creatingStudent, id };
      dispatch(setStudent(newStudent));
      history.push(STUDENTS_PATH);
    })
    .catch(err => {
      console.log(err);
      setError(err?.message+'' || err?.msg+'' || err+'');
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  const s = (creatingStudent as Student);
  return (
    <Space direction="vertical" size="large" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <div>
        <Title level={2}>Sign up</Title>
        <span style={{color:'red'}}>{error}</span>
        <Form onFinish={createAccount}>
          <Form.Item label="Name" required>
            <Input placeholder="John Smith" value={s.name}
              onChange={e => setCreatingStudent({...s, name: e.target.value})} />
          </Form.Item>
          <Form.Item label="Email" required >
            <Input placeholder="jsmith@awesome.edu" value={s.email} 
              onChange={e => setCreatingStudent({...s, email: e.target.value})} />
          </Form.Item>
          <Form.Item label="Student Number" required>
            <Input placeholder="13377331" value={s.studentNumber}
              onChange={e => setCreatingStudent({...s, studentNumber: e.target.value})} />
          </Form.Item> 
          <Form.Item label="Institution" required>
            <Input placeholder="University of Awesome" value={s.institution}
              onChange={e => setCreatingStudent({...s, institution: e.target.value})}/>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Create Account
          </Button>
        </Form>
      </div>
    </Space>
  );
};

export default StudentSignup;
