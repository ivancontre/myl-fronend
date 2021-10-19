import { Layout, Menu,  } from 'antd';
import React, { FC, useContext } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import {
    BlockOutlined,
    UserOutlined,
    PlayCircleOutlined,
    AppstoreOutlined
} from '@ant-design/icons';

import MyCards from '../components/signed/Cards';
import Play from '../components/signed/Play';
//import MatchPage from '../pages/MatchPage';

import '../css/signed.css'
import Cards from '../components/signed/admin/Cards';
import { MenuContext } from '../context/MenuContext';
import NewCard from '../components/signed/admin/NewCard';
//import { useSelector } from 'react-redux';
//import { RootState } from '../store';
import Users from '../components/signed/admin/Users';

const { Content, Sider } = Layout;

export const SingedRouter: FC = () => {

    const { hiddenMenu, selectedOption } = useContext(MenuContext);

    //const { role } = useSelector((state: RootState) => state.auth);
    
    return (
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

                        <Menu.Item key="play" icon={<PlayCircleOutlined />}>
                            <Link to="/play">
                                Jugar
                            </Link>
                        </Menu.Item>

                        <Menu.Item key="my-cards" icon={<BlockOutlined />}>
                            <Link to="/my-cards">
                                Mis Cartas
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="cards" icon={<AppstoreOutlined />}>
                            <Link to="/cards">
                                Cartas
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="users" icon={<UserOutlined />}>
                            <Link to="/users">
                                Usuarios
                            </Link>
                        </Menu.Item>

                    </Menu>
                    
                </Sider>
                
                <Layout className="site-layout" style={{ marginLeft: !hiddenMenu ? 200 : 0 }} >

                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }} >
                        <div className="site-layout-background" style={{ padding: 24 }} >
                            <Switch>

                                <Route exact path="/play" component={ Play } />

                                <Route exact path="/my-cards" component={ MyCards } />                               

                                <Route exact path="/cards" component={ Cards } />

                                <Route exact path="/cards/new" component={ NewCard } />

                                <Route exact path="/cards/:id/edit" component={ NewCard } />

                                <Route exact path="/users" component={ Users } />

                                <Redirect to="/play" />

                            </Switch>
                        </div>
                    </Content>
                </Layout>        

                


            </Layout>            
    )
};