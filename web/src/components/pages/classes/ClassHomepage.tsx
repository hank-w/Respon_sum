import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, QuestionCircleOutlined, BookOutlined } from '@ant-design/icons';

import ClassCreate from './ClassCreate';
import ClassAll from './ClassAll';
import ClassEnroll from './ClassEnroll';

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
          <Menu.Item key="1" icon={<QuestionCircleOutlined />} onClick={() => setPage('create')}>
            Create
          </Menu.Item>
          <Menu.Item key="2" icon={<BookOutlined />} onClick={() => setPage('classes')}>
            Classes
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />} onClick={() => setPage('enroll')}>
            Enroll
          </Menu.Item>
        </Menu>
      </Sider>
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {page === 'create' ? <ClassCreate /> : null}
          {page === 'classes' ? <ClassAll /> : null}
          {page === 'enroll' ? <ClassEnroll /> : null}
        </div>
      </Content>
    </Layout>
  );
};
