import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, QuestionCircleOutlined, BookOutlined } from '@ant-design/icons';

import StudentQuestions from './StudentQuestions';
import StudentAccountSettings from './StudentAccountSettings';
import StudentClasses from './StudentClasses';

const { Content, Sider } = Layout;

export default () => {
  const [ page, setPage ] = useState('questions');

  return (
    <Layout style={{ padding: '24px 0' }}>
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
        >
          <Menu.Item key="1" icon={<QuestionCircleOutlined />} onClick={() => setPage('questions')}>
            Questions
          </Menu.Item>
          <Menu.Item key="2" icon={<BookOutlined />} onClick={() => setPage('classes')}>
            Classes
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />} onClick={() => setPage('account')}>
            Account Settings
          </Menu.Item>
        </Menu>
      </Sider>
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        {page === 'questions' ? <StudentQuestions /> : null}
        {page === 'classes' ? <StudentClasses /> : null}
        {page === 'account' ? <StudentAccountSettings /> : null}
      </Content>
    </Layout>
  );
};
