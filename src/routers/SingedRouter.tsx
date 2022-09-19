import { Button, Layout, Menu, message, Modal, notification, Spin } from 'antd';
import React, { FC, useCallback, useContext, useEffect } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import {
    BlockOutlined,
    UserOutlined,
    PlayCircleOutlined,
    AppstoreOutlined,
    LogoutOutlined,
    TeamOutlined,
    ExclamationCircleOutlined
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
import { startLogout, startSetDetailAction } from '../store/auth/action';
import Decks from '../components/signed/user/Decks';
import NewDeck from '../components/signed/user/NewDeck';
import { SocketContext } from '../context/SocketContext';
import { changeMatch, changOpponenteMatch, matchSetMatchId, matchSetOpponentId, matchSetOpponentUsername, resetMatch } from '../store/match/action';
import { resetDeckUpdating, resetDeck } from '../store/deck/action';
import { resetCardUpdating } from '../store/card/action';
import { resetAllDescription } from '../store/description/action';
import MatchPage from '../pages/MatchPage';
import { RootState } from '../store';
import { addMessageAction, resetChatAction } from '../store/chat/action';
import { resetModal } from '../store/ui-modal/action';
import { playReset } from '../store/play/action';
import Account from '../components/signed/user/Account';
import { scrollToBottom } from '../helpers/scrollToBottom';

const { Content, Header, Footer } = Layout;
const { confirm } = Modal;

export const SingedRouter: FC = () => {

    const { hiddenMenu, selectedOption, loading, showLoading, hideLoading  } = useContext(MenuContext);
    const { socket } = useContext(SocketContext);

    const { matchId, opponentMatch, opponentId, match } = useSelector((state: RootState) => state.match);

    const dispatch = useDispatch();

    const history = useHistory();

    const { role, username, google, playing } = useSelector((state: RootState) => state.auth);

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useEffect(() => {
        document.body.classList.remove("body-auth");
        document.body.classList.add('body-signed');
    }, [])

    const finishMatch = useCallback(() => {
        dispatch(startSetDetailAction());
        Modal.destroyAll();
        dispatch(resetMatch());
        dispatch(resetChatAction());
        dispatch(resetModal());
        history.replace('/play');

        }, [history, dispatch],
    );

    const finishMutualMatchModal = useCallback(
        (text: string) => {

            confirm({
                title: text,
                icon: <ExclamationCircleOutlined />,
                cancelButtonProps: { hidden: true },
                okButtonProps: { hidden: true }
            });

        }, [],
    );

    useEffect(() => {

        if (!playing && path !== 'match' && matchId && Object.keys(opponentMatch).length > 0) {
            socket?.emit('i-missed-match', {
                opponentId,
                matchId
            });

            finishMutualMatchModal('Perdiste :(');

            setTimeout(() => {
                finishMatch();

                return () => {
                    socket?.off('i-missed-match');
                }

            }, 2000);
        }

    }, [path, matchId, opponentMatch, finishMatch, finishMutualMatchModal, opponentId, socket, playing]);

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

        dispatch(matchSetMatchId(payload.matchId));
        dispatch(matchSetOpponentId(payload.opponentId));
        dispatch(matchSetOpponentUsername(payload.opponentUsername)); 
        history.replace('/match');
            
    }, [dispatch, history]);

    useEffect(() => {

        socket?.on('recovery-after-reload', (payload) => {
            console.log("recovery-after-reload");

            showLoading();
                    
            console.log('matchId', payload.matchId)
            setTimeout(() => {   
                dispatch(matchSetMatchId(payload.matchId));
                dispatch(matchSetOpponentId(payload.opponentId));
                dispatch(matchSetOpponentUsername(payload.opponentUsername)); 
                dispatch(changeMatch(payload.match));
                dispatch(changOpponenteMatch(payload.opponentMatch));

                for(const message of payload.messages) {
                    dispatch(addMessageAction(message));
                }                
                hideLoading()
                history.replace('/match');
                scrollToBottom('messages');
            }, 500);
            
            
        });

        return () => {
            socket?.off('recovery-after-reload');
        }
        
    }, [socket, match, matchId, dispatch, history, showLoading, hideLoading]);

    useEffect(() => {
        socket?.on('go-match', (payload: any) => {
            showLoading();
            setTimeout(() => {
                initMatch(payload);
                hideLoading();
            }, 1000);
        });

        return () => {
            socket?.off('go-match');
        }

    }, [socket, initMatch, showLoading, hideLoading]);
    
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

    const onConfirm = () => {
        google ? signOut() : handleLogout();
    };

    const logoutModal = () => {
            confirm({
                title: '¿Cerrar sesión?',
                icon: <ExclamationCircleOutlined />,
                okText: 'OK',
                cancelText: 'Cancelar',
                onOk() {
                    onConfirm();                  
                    
                },
                onCancel() {
                    
                },
            });
        };

    return (
        <Spin spinning={ loading } tip="Espere por favor...">
            <Layout className={ path !== 'match' ? 'section-layout' : ''}>
                <Header
                    hidden={ hiddenMenu }
                    style={{ position: 'fixed', zIndex: 2, width: '100%' }}
                >
                    <Menu  theme="dark" mode="horizontal" selectedKeys={[ selectedOption ]}>

                        <Menu.Item icon={<LogoutOutlined />} key="profile" className="welcome" style={{ background: '#0F0F23', marginTop: 0, fontSize: 16}} onClick={ logoutModal }>
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

                        <Menu.Item key="account" icon={<UserOutlined />}>
                            <Link to="/account">
                                Mi Cuenta
                            </Link>
                        </Menu.Item>                        

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

                    </Menu>
                    
                </Header>
                
                <Content className={ path === 'match' ? "content-layout-match site-layout" : "content-layout site-layout"} >
                    <div className="site-layout-background" style={{ padding: path === 'match' ? 0 : '24px 10px 10px 10px', minHeight: 380 }} >
                        <Switch>

                            <Route exact strict path="/match" component={ MatchPage } />

                            <Route exact path="/play" component={ Play } />

                            <Route exact path="/decks" component={ Decks } />
                            
                            <Route exact path="/decks/new" component={ NewDeck } />

                            <Route exact path="/account" component={ Account } />

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
                <Footer style={{ textAlign: 'center' }}>Developed by <em>Iván Cristóbal Contreras Jara</em> ©2022</Footer>
            </Layout>   
        </Spin>         
    )
};