import { Layout, Menu, Button } from 'antd';
import React, { FC } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import {
    BarChartOutlined,
    UserOutlined,
    PoweroffOutlined
} from '@ant-design/icons';

import Cards from '../components/signed/Cards';
import Play from '../components/signed/Play';

const { Content, Sider } = Layout;

export const SingedRouter: FC = () => {
    return (
        <Layout >
            <Sider
            
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                }}
            >
                
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[ '1' ]}>

                    <Menu.Item key="play" icon={<UserOutlined />}>
                        <Link to="/play">
                            Jugar
                        </Link>
                    </Menu.Item>

                    <Menu.Item key="cards" icon={<BarChartOutlined />}>
                        <Link to="/cards">
                            Mis Cartas
                        </Link>
                    </Menu.Item>
                    <div className="button-logout">
                        <Button type="primary" icon={<PoweroffOutlined />} size="small" >Cerrar sesión</Button>
                    </div>
                    

                </Menu>
                
            </Sider>
            
            <Layout className="site-layout" style={{ marginLeft: 200 }}>

                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <div className="site-layout-background" style={{ padding: 24 }}>
                        <Switch>

                            <Route exact path="/play" component={ Play } />

                            <Route exact path="/cards" component={ Cards } />

                            <Redirect to="/play" />

                        </Switch>
                    </div>
                </Content>
            </Layout>        

            


        </Layout>




            
    )
};