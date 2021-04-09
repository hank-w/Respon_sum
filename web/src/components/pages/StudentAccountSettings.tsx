import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Space, Input, Form, Typography } from 'antd';
import { StudentContext } from '../../Contexts';
import { deleteStudentById, putStudentById } from '../../api/students';
import { STUDENTS_LOGIN_PATH } from '../../utils/Paths';

const { Title } = Typography;

const StudentAccountSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {student, setStudent} = useContext(StudentContext);
  const history = useHistory();

  if (student === undefined) {
    return <div>{student+''}</div>;
  }

  const deleteAccount = () => {
    setLoading(true);
    deleteStudentById(student.id)
    .then(() => {
      setError(null);
      setStudent(undefined);
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
  
  return (
    <Space direction="vertical" size="large">
      <div>
        <Title level={2}>Update Account Info</Title>
        <Form>
          <Form.Item label="Name" required>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" required>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Student Number" required>
            <Input placeholder="Student Number" />
          </Form.Item> 
          <Form.Item label="Institution" required>
            <Input placeholder="Institution" />
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
