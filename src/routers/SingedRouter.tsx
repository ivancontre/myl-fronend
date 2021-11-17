import { Button, Layout, Menu, notification, Popconfirm } from 'antd';
import React, { FC, useCallback, useContext, useEffect } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import {
    BlockOutlined,
    UserOutlined,
    PlayCircleOutlined,
    AppstoreOutlined,
    LogoutOutlined
} from '@ant-design/icons';

import Play from '../components/signed/user/Play';
//import MatchPage from '../pages/MatchPage';

import '../css/signed.css'
import Cards from '../components/signed/admin/Cards';
import { MenuContext } from '../context/MenuContext';
import NewCard from '../components/signed/admin/NewCard';
//import { useSelector } from 'react-redux';
//import { RootState } from '../store';
import Users from '../components/signed/admin/Users';
import { useHistory, useLocation } from 'react-router';
import '../css/signed.css'
import { useDispatch, useSelector } from 'react-redux';
import { startLogout } from '../store/auth/action';
import Decks from '../components/signed/user/Decks';
import NewDeck from '../components/signed/user/NewDeck';
import { SocketContext } from '../context/SocketContext';
import { matchSetMatchId, matchSetOpponentId, resetMatch } from '../store/match/action';
import { resetDeckUpdating } from '../store/deck/action';
import { resetCardUpdating } from '../store/card/action';
import { resetAllDescription } from '../store/description/action';
import MatchPage2 from '../pages/MatchPage2';
import { RootState } from '../store';
const { Content, Sider } = Layout;

export const SingedRouter: FC = () => {

    const { hiddenMenu, selectedOption } = useContext(MenuContext);
    const { socket } = useContext(SocketContext);
    const { matchId, opponentId } = useSelector((state: RootState) => state.match);

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    const dispatch = useDispatch();

    const history = useHistory();

    //const { role } = useSelector((state: RootState) => state.auth);
    
    const handleLogout = () => {
        dispatch(startLogout());
        dispatch(resetDeckUpdating());
        dispatch(resetCardUpdating());
        dispatch(resetMatch());
        dispatch(resetAllDescription())
    };   

    const confirm = () => {
        handleLogout();
    };

    const cancel = () => {

    };

    const close = () => {
        console.log('close notification')
    };

    const acceptInvitation = useCallback((key: string, opponentId: string) => {

        socket?.emit('create-match', {
            opponentId
        });

        notification.close(key);

    }, [socket]);

    const openNotification = useCallback( (key: string, username: string, id: string) => {
        
        const btn = (
            <Button type="primary" size="small" onClick={() => {
                acceptInvitation(key, id);            
            }}>
                Aceptar
            </Button>
        );

        notification.open({
            message: 'Nueva invitación',
            description:
              `El usuario ${username.toUpperCase()} te está invitando a jugar`,
            btn,
            key,
            onClose: close,
            duration: 10,
            className: 'centered',
        });

    }, [acceptInvitation]);
    
    useEffect(() => {

        socket?.on('send-notification', (payload: any) => {
            openNotification(payload.key, payload.from, payload.id);
        });

    }, [socket, openNotification]);

    useEffect(() => {

        socket?.on('cancele-notification', (payload: any) => {
            notification.close(payload.key);
        });

    }, [socket]);

    useEffect(() => {

        socket?.on('go-match', (payload: any) => {

            dispatch(matchSetOpponentId(payload.opponentId));
            dispatch(matchSetMatchId(payload.matchId));
            history.replace('/match');

        });

    }, [socket, openNotification, dispatch, history]);

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
                    <Menu className="menu-myl" theme="dark" mode="inline" selectedKeys={[ selectedOption ]}>

                        <Menu.Item key="play" icon={<PlayCircleOutlined />}>
                            <Link to="/play">
                                Jugar
                            </Link>
                        </Menu.Item>

                        <Menu.Item key="decks" icon={<BlockOutlined />}>
                            <Link to="/decks">
                                Mis Mazos
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

                        <Menu.Item className="btn-logout" key="logout" icon={<LogoutOutlined />}>

                            <Popconfirm
                                title="¿Salir?"
                                okText="Sí"
                                placement="right"
                                onConfirm={confirm}
                                onCancel={cancel}
                                cancelText="No"
                            >
                                Cerrar sesión
                            </Popconfirm>
                        </Menu.Item>

                    </Menu>
                    
                </Sider>
                
                <Layout className="site-layout" style={{ marginLeft: !hiddenMenu ? 200 : 0 }} >

                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }} >
                        <div className="site-layout-background" style={{ padding: path === 'match' ? 0 : 24 }} >
                            <Switch>

                                <Route exact path="/match" component={ MatchPage2 } />

                                <Route exact path="/play" component={ Play } />


                                <Route exact path="/cards" component={ Cards } />

                                <Route exact path="/cards/new" component={ NewCard } />

                                <Route exact path="/cards/:id/edit" component={ NewCard } />


                                <Route exact path="/decks" component={ Decks } />

                                <Route exact path="/decks/new" component={ NewDeck } />

                                <Route exact path="/decks/:id/edit" component={ NewDeck } />


                                <Route exact path="/users" component={ Users } />

                                <Redirect to="/play" />

                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </Layout>            
    )
};