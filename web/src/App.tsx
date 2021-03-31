import { useState } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';

import './App.css';
import { Student, ID } from './types/api';
import { getStudentId, createStudent } from './api/students';
import Routes from './Routes';
// import { Header } from './components/Header';
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import Logo from './resources/logo.png';
import { BASE_PATH } from './utils/Paths';
const { Header, Content, Footer } = Layout;

function App() {
  const [studentId, setStudentId] = useState<ID>('');
  const [student, setStudent] = useState<Student>();

  const [postStudent, setPostStudent] = useState<string>('');
  const [postResult, setPostResult] = useState<string>('');

  const onButtonPress = async () => {
    setStudent((await getStudentId(studentId)).data);
  };

  const onPostButtonPress = async () => {
    console.log(postStudent);
    console.log(JSON.parse(postStudent));
    const response = await createStudent(JSON.parse(postStudent));
    console.log(response);
    setPostResult(JSON.stringify(response.data));
  };

  return (
    <BrowserRouter>
      <Layout className="layout">
        <Header style={{ display: 'flex', flexDirection: 'row' }}>
          <Menu style={{ flexGrow: 1 }} theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
          <div>
            <Link to={BASE_PATH}>
              <img src={Logo} style={{ height: '70%', marginRight: 20, filter: 'brightness(100)' }} />
              <span style={{ color: 'white', fontFamily: 'Helvetica', fontSize: '1.5em' }}>Responsum</span>
            </Link> 
          </div>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Routes />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Responsum ©2021 Created by Ryan and Hank</Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
