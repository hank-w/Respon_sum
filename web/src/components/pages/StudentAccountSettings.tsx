import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Space, Input, Form, Typography } from 'antd';
import { deleteStudentById, putStudentById } from '../../api/students';
import { STUDENTS_LOGIN_PATH } from '../../utils/Paths';
import { useSelector, useDispatch } from 'react-redux';
import { Store } from '../../types/store';
import { Student } from '../../types/api';
import { setStudent } from '../../utils/Actions';

const { Title } = Typography;

const StudentAccountSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const student = useSelector((state: Store) => state.student);
  const [updatingStudent, setUpdatingStudent] = useState(student);
  const dispatch = useDispatch();
  const history = useHistory();

  if (student === undefined) {
    return <>You're not logged in!</>;
  }

  const updateAccount = () => {
    setLoading(true);
    putStudentById(student.id, (updatingStudent as Student))
    .then(() => {
      setError(null);
      setSuccess('Successfully Updated Account!');
      dispatch(setStudent(updatingStudent));
    })
    .catch(err => {
      console.log(err);
      setSuccess(null);
      setError(err?.message+'' || err?.msg+'' || err+'');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const deleteAccount = () => {
    setLoading(true);
    deleteStudentById(student.id)
    .then(() => {
      setError(null);
      dispatch(setStudent(undefined));
      history.push(STUDENTS_LOGIN_PATH);
    })
    .catch(err => {
      console.log(err);
      setError(err?.message+'' || err?.msg+'' || err+'');
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  const u = (updatingStudent as Student);
  return (
    <Space direction="vertical" size="large">
      <div>
        <Title level={2}>Update Account Info</Title>
        <span style={{color:'red'}}>{error}</span>
        <span style={{color:'black'}}>{success}</span>
        <Form onFinish={updateAccount}>
          <Form.Item label="Name" required>
            <Input placeholder="Name" value={u.name}
              onChange={e => setUpdatingStudent({...u, name: e.target.value})} />
          </Form.Item>
          <Form.Item label="Email" required >
            <Input placeholder="Email" value={u.email} 
              onChange={e => setUpdatingStudent({...u, email: e.target.value})} />
          </Form.Item>
          <Form.Item label="Student Number" required>
            <Input placeholder="Student Number" value={u.studentNumber}
              onChange={e => setUpdatingStudent({...u, studentNumber: e.target.value})} />
          </Form.Item> 
          <Form.Item label="Institution" required>
            <Input placeholder="Institution" value={u.institution}
              onChange={e => setUpdatingStudent({...u, institution: e.target.value})}/>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form>
      </div>
      <div>
        <Title level={2}>Danger Zone</Title>
        <Button danger loading={loading} onClick={deleteAccount}>Delete Account</Button>
      </div>
    </Space>
  );
};

export default StudentAccountSettings;
