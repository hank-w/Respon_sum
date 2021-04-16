import { BrowserRouter, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Layout, Menu } from 'antd';
import store from './store';
 
import 'antd/dist/antd.css';
import './App.css';

import Logo from './resources/logo.png';
import Routes from './Routes';
import { BASE_PATH } from './utils/Paths';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout className="layout">
          <Header style={{ display: 'flex', flexDirection: 'row' }}>
            <Menu style={{ flexGrow: 1 }} theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">student</Menu.Item>
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
    </Provider>
  );
}

export default App;
