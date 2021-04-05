import { Button, Space, Input, Form, Typography } from 'antd';
import { connectStudent, StudentContextType } from '../../Contexts';

const { Title } = Typography;

const StudentAccountSettings = ({student, setStudent}: StudentContextType) => {

  
  
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
        <Button danger>Delete Account</Button>
      </div>
    </Space>
  );
};

export default connectStudent(StudentAccountSettings);
