import { Button, Layout, Menu, message, notification, Popconfirm } from 'antd';
import React, { FC, useCallback, useContext, useEffect } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import {
    BlockOutlined,
    UserOutlined,
    PlayCircleOutlined,
    AppstoreOutlined,
    LogoutOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { useGoogleLogout } from 'react-google-login';

import Play from '../components/signed/user/Play';

import '../css/signed.css'
import Cards from '../components/signed/admin/Cards';
import { MenuContext } from '../context/MenuContext';
import NewCard from '../components/signed/admin/NewCard';
import Users from '../components/signed/admin/Users';
import { useHistory, useLocation } from 'react-router';
import '../css/signed.css'
import { useDispatch, useSelector } from 'react-redux';
import { startLogout } from '../store/auth/action';
import Decks from '../components/signed/user/Decks';
import NewDeck from '../components/signed/user/NewDeck';
import { SocketContext } from '../context/SocketContext';
import { matchSetMatchId, matchSetOpponentId, matchSetOpponentUsername, resetMatch } from '../store/match/action';
import { resetDeckUpdating, resetDeck } from '../store/deck/action';
import { resetCardUpdating } from '../store/card/action';
import { resetAllDescription } from '../store/description/action';
import MatchPage from '../pages/MatchPage';
import { RootState } from '../store';
import { resetChatAction } from '../store/chat/action';
import { resetModal } from '../store/ui-modal/action';
import { playReset } from '../store/play/action';
import Account from '../components/signed/user/Account';

const { Content, Sider } = Layout;

export const SingedRouter: FC = () => {

    const { hiddenMenu, selectedOption, collapsedOn, collapsedOff, collapsedMenu } = useContext(MenuContext);
    const { socket } = useContext(SocketContext);

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    const dispatch = useDispatch();

    const history = useHistory();

    const { role, username, google } = useSelector((state: RootState) => state.auth);

    const onLogoutGoogleSuccess = () => {
        handleLogout();
    };

    const onFailureGoogle = () => {
        message.error('Hubo un problema al cerrar sesión con Google');
    };

    const { signOut } = useGoogleLogout({
        onFailure: onFailureGoogle,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID as string,
        onLogoutSuccess: onLogoutGoogleSuccess
    });
    
    const handleLogout = () => {
        dispatch(startLogout());
        dispatch(resetDeckUpdating());
        dispatch(resetCardUpdating());
        dispatch(resetMatch());
        dispatch(resetAllDescription());
        dispatch(resetChatAction());
        dispatch(resetDeck());
        dispatch(resetModal());
        dispatch(playReset());
    };   

    const confirm = () => {
        google ? signOut() : handleLogout();
    };

    const cancel = () => {

    };

    const close = () => {
        console.log('close notification');
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
              `El usuario "${username}" te está invitando a jugar`,
            btn,
            key,
            onClose: close,
            duration: 15,
            className: 'centered',
        });

    }, [acceptInvitation]);

    const initMatch = useCallback( (payload: any) => {

            dispatch(matchSetOpponentId(payload.opponentId));
            dispatch(matchSetOpponentUsername(payload.opponentUsername));
            dispatch(matchSetMatchId(payload.matchId));
            history.replace('/match');
            
    }, [dispatch, history]);

    useEffect(() => {
        socket?.on('go-match', (payload: any) => {
            initMatch(payload);
        });

        return () => {
            socket?.off('go-match');
        }

    }, [socket, initMatch]);
    
    useEffect(() => {

        socket?.on('send-notification', (payload: any) => {
            openNotification(payload.key, payload.from, payload.id);
        });

        return () => {
            socket?.off('send-notification');
        }

    }, [socket, openNotification]);

    useEffect(() => {

        socket?.on('cancele-notification', (payload: any) => {
            notification.close(payload.key);
        });

        return () => {
            socket?.off('cancele-notification');
        }

    }, [socket]);

    const onCollapse = (collapsed: boolean) => {
        collapsed ? collapsedOn(): collapsedOff();
    };

    const getWidthContent = () => {

        if (hiddenMenu) return 0;

        if (collapsedMenu) return 85;

        return 200;
    };

    return (
            <Layout>
                <Sider
                    hidden={ hiddenMenu }
                    collapsible
                    collapsed={ collapsedMenu }
                    onCollapse={ onCollapse }
                    breakpoint="xs"
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                    }}
                >

                    <Menu className="menu-myl" theme="dark" mode="inline" selectedKeys={[ selectedOption ]}>

                        <Menu.Item key="profile" className="welcome" style={{ background: '#0F0F23', marginTop: 0, fontSize: 16}}>
                            { `Bienvenido ${username}`}
                        </Menu.Item>

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

                        {
                            !google && (
                                <Menu.Item key="account" icon={<UserOutlined />}>
                                    <Link to="/account">
                                        Mi Cuenta
                                    </Link>
                                </Menu.Item>
                            )
                        }
                        

                        {
                            role === 'ADMIN_ROLE' && (
                                <Menu.Item key="cards" icon={<AppstoreOutlined />}>
                                    <Link to="/cards">
                                        Cartas
                                    </Link>
                                </Menu.Item>
                            )
                        }

                        {
                            role === 'ADMIN_ROLE' && (
                                <Menu.Item key="users" icon={<TeamOutlined />}>
                                    <Link to="/users">
                                        Usuarios
                                    </Link>
                                </Menu.Item>
                            )
                        }
                        

                        <Menu.Item className="btn-logout" key="logout" icon={<LogoutOutlined />} title="">

                            <Popconfirm
                                title="¿Salir?"
                                okText="Sí"
                                placement="right"
                                onConfirm={ confirm }
                                onCancel={ cancel }
                                cancelText="No"
                            >
                                Cerrar sesión
                            </Popconfirm>
                            
                        </Menu.Item>

                    </Menu>
                    
                </Sider>
                
                <Layout className="site-layout" style={{ marginLeft: getWidthContent() }} >

                    <Content style={{ margin: '20px', overflow: 'initial' }} >
                        <div className="site-layout-background" style={{ padding: path === 'match' ? 0 : 20 }} >
                            <Switch>

                                <Route exact strict path="/match" component={ MatchPage } />

                                <Route exact path="/play" component={ Play } />

                                <Route exact path="/decks" component={ Decks } />
                                
                                <Route exact path="/decks/new" component={ NewDeck } />

                                {
                                    !google && (
                                        <Route exact path="/account" component={ Account } />
                                    )
                                }

                                <Route exact path="/decks/:id/edit" component={ NewDeck } />

                                {
                                    role === 'ADMIN_ROLE' && (
                                        <Route exact path="/cards" component={ Cards } />
                                        
                                    )
                                }

                                {
                                    role === 'ADMIN_ROLE' && (
                                        <Route exact path="/cards/new" component={ NewCard } />
                                        
                                    )
                                }

                                {
                                    role === 'ADMIN_ROLE' && (
                                        <Route exact path="/cards/:id/edit" component={ NewCard } />
                                        
                                    )
                                }

                                {
                                    role === 'ADMIN_ROLE' && (
                                        <Route exact path="/users" component={ Users } />
                                    )
                                }

                                <Redirect to="/play" />

                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </Layout>            
    )
};