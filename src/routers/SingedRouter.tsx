import { Layout, Menu,  } from 'antd';
import React, { FC, useContext } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import {
    BarChartOutlined,
    UserOutlined,
    //PoweroffOutlined
} from '@ant-design/icons';

import Cards from '../components/signed/Cards';
//import Play from '../components/signed/Play';
import MatchPage from '../pages/MatchPage';

import '../css/signed.css'
import AdminCards from '../components/signed/AdminCards';
import { MenuContext } from '../context/MenuContext';
import NewCard from '../components/signed/NewCard';

const { Content, Sider } = Layout;

export const SingedRouter: FC = () => {

    const { hiddenMenu, selectedOption } = useContext(MenuContext);

    console.log(selectedOption)
    
    return (
        // <SocketProvider>
        //<MenuProvider> 
            <Layout  style={{ height: '100vh' }}>
                <Sider
                    hidden={ hiddenMenu }
                    collapsedWidth="0" 
                    breakpoint="md"
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                    }}
                >
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" selectedKeys={[ selectedOption ]}>

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
                        <Menu.Item key="cards-created" icon={<BarChartOutlined />}>
                            <Link to="/cards-created">
                                Cartas creadas
                            </Link>
                        </Menu.Item>
                        {/* <Menu.Item key="users-created" icon={<BarChartOutlined />}>
                            <Link to="/users-created">
                                Usuarios creados
                            </Link>
                        </Menu.Item> */}

                    </Menu>
                    
                </Sider>
                
                <Layout className="site-layout" style={{ marginLeft: !hiddenMenu ? 200 : 0 }} >

                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }} >
                        <div className="site-layout-background" style={{ padding: 24 }} >
                            <Switch>

                                <Route exact path="/play" component={ MatchPage } />

                                <Route exact path="/cards" component={ Cards } />                               

                                <Route exact path="/cards-created" component={ AdminCards } />

                                <Route exact path="/cards-created/new" component={ NewCard } />

                                <Redirect to="/play" />

                            </Switch>
                        </div>
                    </Content>
                </Layout>        

                


            </Layout>
        //</MenuProvider>




            
    )
};