import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Space, Input, Form, Typography } from 'antd';
import { deleteInstructorById, putInstructorById } from '../../../api/instructors';
import { INSTRUCTORS_LOGIN_PATH } from '../../../utils/Paths';
import { useSelector, useDispatch } from 'react-redux';
import { Store } from '../../../types/store';
import { Instructor } from '../../../types/api';
import { setInstructor } from '../../../utils/Actions';

const { Title } = Typography;

const InstructorAccountSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const instructor = useSelector((state: Store) => state.instructor);
  const [updatingInstructor, setUpdatingInstructor] = useState(instructor);
  const dispatch = useDispatch();
  const history = useHistory();

  if (instructor === undefined) {
    return <>You're not logged in!</>;
  }

  const updateAccount = () => {
    setLoading(true);
    putInstructorById(instructor.id, (updatingInstructor as Instructor))
    .then(() => {
      setError(null);
      setSuccess('Successfully Updated Account!');
      dispatch(setInstructor(updatingInstructor));
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
    deleteInstructorById(instructor.id)
    .then(() => {
      setError(null);
      dispatch(setInstructor(undefined));
      history.push(INSTRUCTORS_LOGIN_PATH);
    })
    .catch(err => {
      console.log(err);
      setError(err?.message+'' || err?.msg+'' || err+'');
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  const u = (updatingInstructor as Instructor);
  return (
    <Space direction="vertical" size="large">
      <div>
        <Title level={2}>Update Account Info</Title>
        <span style={{color:'red'}}>{error}</span>
        <span style={{color:'black'}}>{success}</span>
        <Form onFinish={updateAccount}>
          <Form.Item label="Name" required>
            <Input placeholder="Name" value={u.name}
              onChange={e => setUpdatingInstructor({...u, name: e.target.value})} />
          </Form.Item>
          <Form.Item label="Email" required >
            <Input placeholder="Email" value={u.email} 
              onChange={e => setUpdatingInstructor({...u, email: e.target.value})} />
          </Form.Item>
          <Form.Item label="Institution" required>
            <Input placeholder="Institution" value={u.institution}
              onChange={e => setUpdatingInstructor({...u, institution: e.target.value})}/>
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

export default InstructorAccountSettings;
