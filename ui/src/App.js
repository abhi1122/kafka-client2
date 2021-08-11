import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { io } from "socket.io-client";
import './App.css';
import Topic from './features/topics/Topic';
import Login from './features/login/Login';
import HeaderUi from './features/header/Header';
import { StateProvider, store } from './redux/store';
import Loading from './features/loading/Loading';

import { Layout } from 'antd';
const { Footer, Content } = Layout;

const socket = io("http://localhost:3012");
socket.on("connect", () => { });

// const newContext = React.createContext({ color: 'black' });
// const { Provider, Consumer } = newContext;

// const value = useContext(newContext);

function App() {

  return (
    <StateProvider>
      <Loading>
        <Router>
          <Layout>
            <HeaderUi />
            <Content>

              <Switch>
                <Route path="/" exact>
                  <div style={{ height: window.innerHeight - 113 }}><Login socket={socket} /></div>
                </Route>
                <Route path="/dashboard">
                  <div style={{ height: window.innerHeight - 113 }}><Topic socket={socket} /></div>
                </Route>
              </Switch>

            </Content>
            {/* <Footer style={{ height: 50, backgroundColor: '#001529' }}>Footer</Footer> */}
            <Footer style={{ height: 50, textAlign: 'center', backgroundColor: '#001529', color: 'white' }}>
              KAFKA BRIDGE ©2021 Created by Kafka Bridge
            </Footer>
          </Layout>
        </Router>
      </Loading>
    </StateProvider >
  );
}

export default App;
