import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Col, Popover, Modal, Row, Button, Divider } from 'antd';

import { CloseCircleOutlined } from '@ant-design/icons';


import CardComponent from '../components/match/CardComponent';
import { ZONE_NAMES } from "../constants";
import { SocketContext } from '../context/SocketContext';
import useHideMenu from '../hooks/useHideMenu';
import { RootState } from '../store';
import { Card } from '../store/card/types';
import { changeMatch, changOpponenteMatch, matchSetMatchId, resetMatch, setAmountCardsViewAction, setPlayOpenHandAction } from '../store/match/action';
import Zone from '../components/match/Zone';
import { Dictionary } from '../store/match/types';

import '../css/match.css';
import ThrowXcardsModal from '../components/modals/ThrowXcardsModal';
import ViewCardsModal from '../components/modals/ViewCardsModal';
import SelectXcardsModal from '../components/modals/SelectXcardsModal';
import { openModalOpponentDiscard, openModalViewCastleOpponent, openModalViewHandOpponent, openModalViewXCastleOpponent, resetModal } from '../store/ui-modal/action';
import TakeControlOpponentCardModal from '../components/modals/TakeControlOpponentCardModal';
import AssingWeaponModal from '../components/modals/AssingWeaponModal';

import { ExclamationCircleOutlined, CheckCircleOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { isTouchDevice } from '../helpers/touch';
import Chat from '../components/chat/Chat';
import { resetChatAction } from '../store/chat/action';
import { startSetDetailAction } from '../store/auth/action';
import Phases from '../components/phases/Phases';
import OpponentDiscard from '../components/modals/OpponentDiscard';
import DestinyCastleOptionsModal from '../components/modals/DestinyCastleOptionsModal';
import { User } from '../store/auth/types';
import { MenuContext } from '../context/MenuContext';
import useIsMobile from '../hooks/useIsMobile';
import useOrientation from '../hooks/useOrientation';

const { confirm } = Modal;

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE, GOLDS_PAID_ZONE, UNPAID_GOLD_ZONE, AUXILIARY_ZONE } = ZONE_NAMES;

const MatchPage: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(true, path);

    const isMobile = useIsMobile();
    const orientation = useOrientation();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const dispatch = useDispatch();

    const { showLoading, hideLoading  } = useContext(MenuContext);
    const { match, emmitChange, matchId, opponentMatch, opponentId, opponentUsername, amountCardsView, takeControlOpponentCardIndex, takeControlOpponentCardZone } = useSelector((state: RootState) => state.match);
    const { deckDefault } = useSelector((state: RootState) => state.decks);
    const { activeUsersForPlay } = useSelector((state: RootState) => state.play);
    const history = useHistory();
   
    const [visiblePopover, setVisiblePopover] = useState(false);

    const { socket } = useContext(SocketContext);

    const onContextMenu = (e: MouseEvent) => {
        e.preventDefault()
    };

    useEffect(() => {
        window.addEventListener('contextmenu', onContextMenu);

        return () => {
            window.removeEventListener("contextmenu", onContextMenu);
        };

    }, []);
    
    const { 
            modalOpenThrowXcards, 
            modalOpenViewCastle, 
            modalOpenViewXcards, 
            modalOpenSelectXcards, 
            modalOpenViewCastleToOpponent,
            modalOpenXViewCastleToOpponent,
            modalOpenViewCementery, 
            modalOpenViewExile, 
            modalOpenViewRemoval,
            modalOpenViewAuxiliary,
            modalOpenViewCementeryOpponent, 
            modalOpenViewExileOpponent, 
            modalOpenViewRemovalOpponent,
            modalOpenViewAuxiliaryOpponent,
            modalOpenViewHandOpponent,
            modalOpenTakeControlOpponentCard,
            modalOpenAssignWeapon,
            modalOpenSelectXcardsOpponent,
            modalOpenDiscardOpponent,
            modalDestinyCastleOptions
    } = useSelector((state: RootState) => state.uiModal);


    const finishMatch = useCallback(() => {

        async function getDetailFromAPI() {
            await dispatch(startSetDetailAction());
        }

        getDetailFromAPI();
        Modal.destroyAll();        
        dispatch(resetChatAction());
        dispatch(resetMatch());
        dispatch(resetModal());
        }, [dispatch],
    );

    const openLeaveMatchModal = () => {
        confirm({
            title: '¿Seguro que quieres abandonar la partida?',
            icon: <ExclamationCircleOutlined />,
            content: activeUsersForPlay?.find((user: User) => user.id === opponentId)?.online ? 'Si abandonas la partida perderás y tu oponente será el ganador' : 'Tu oponente está desconectado, si abandonas la partida serás el ganador de igual forma',
            okText: 'Sí',
            cancelText: 'No',
            onOk() {
                showLoading();
                socket?.emit('close-match', {
                    matchId,
                    opponentId
                }, () => {
                    setTimeout(() => {
                        finishMatch();
                        hideLoading();
                        
                    }, 1500);
                    
                });
                
            },
            onCancel() {
                setVisiblePopover(false); 
            },
        });
    };    

    const leaveMutualMatchModal = useCallback(
        () => {
            confirm({
                title: 'Tu oponente solicita abandono mutuo',
                icon: <ExclamationCircleOutlined />,
                content: 'Tu oponente te está solicitando que abandonen mutuamente la partida. Ambos, no sumarán victorias ni derrotas. ',
                okText: 'Aprobar',
                cancelText: 'Rechazar',
                onOk() {
                    showLoading();
                    socket?.emit('approve-request-leave-mutual-match', {
                        matchId,
                        opponentId
                    }, () => {
                        finishMatch();
                        hideLoading();
                    });                    
                    
                },
                onCancel() {
                    socket?.emit('reject-request-leave-mutual-match', {
                        matchId,
                        opponentId
                    }); 
                },
            });
        }, [matchId, opponentId, socket, finishMatch, showLoading, hideLoading],
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

    const leaveMutualMatch = () => {
        socket?.emit('request-leave-mutual-match', {
            matchId
        });

        setVisiblePopover(false);
    };

    const youWinModal = useCallback(
        (text: string) => {
            confirm({
                title: text,
                icon: <CheckCircleOutlined />,
                content: 'Has ganado la partida, felicitaciones!',
                cancelButtonProps: { hidden: true },
                okButtonProps: { hidden: true }
                
            });
        }, [],
    );

    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number, zoneName: string) => {},
        [],
    );

    const returnItemsForZone = (zoneName: string, withPopover: boolean, isPrivate: boolean, isOpponent: boolean) => {
        return (!isOpponent ? match[zoneName] : opponentMatch[zoneName])
            .map((card: Card, index: number) => (
                <CardComponent
                    key={ index }
                    index={ index }
                    moveCard={(dragIndex: number, hoverIndex: number, zoneName: string) => moveCard(dragIndex, hoverIndex, zoneName)}
                    zone={ zoneName }
                    card={ card }
                    withPopover={ withPopover }
                    isPrivate={ isPrivate }
                    isOpponent={ isOpponent }
                />
            ));
    };

    const content = (
        <div>
            <Button type="link" onClick={ openLeaveMatchModal }>Abandonar</Button><br/>
            <Button type="link" onClick={ leaveMutualMatch }>Abandono mutuo</Button>
        </div>        
    );

    const handleVisibleChangePopever = (visible: boolean) => {
        setVisiblePopover(visible); 
    };

    useEffect(() => {

        if (!matchId) {
            history.replace('/play');
        }

    }, [matchId, history]);

    useEffect(() => {

        if (Object.keys(match).length === 0 && deckDefault?.cards.length) {
            console.log('changeMatch');
            const myCards: Dictionary<Card[] | []> = {};
            myCards[CASTLE_ZONE] = deckDefault?.cards as Card[];
            myCards[HAND_ZONE] = [];
            myCards[ATTACK_ZONE] = [];
            myCards[CEMETERY_ZONE] = [];
            myCards[EXILE_ZONE] = [];
            myCards[DEFENSE_ZONE] = [];
            myCards[REMOVAL_ZONE] = [];    
            myCards[SUPPORT_ZONE] = [];
            myCards[GOLDS_PAID_ZONE] = [];
            myCards[UNPAID_GOLD_ZONE] = [];
            myCards[AUXILIARY_ZONE] = [];    

            dispatch(changeMatch(myCards));  
        }

    }, [dispatch, deckDefault?.cards, match]);

    useEffect(() => {
        
        if (match && emmitChange && matchId) {
            if (
                (match[CASTLE_ZONE] && match[CASTLE_ZONE].length) ||
                (match[DEFENSE_ZONE] && match[DEFENSE_ZONE].length) ||
                (match[ATTACK_ZONE] && match[ATTACK_ZONE].length) ||
                (match[SUPPORT_ZONE] && match[SUPPORT_ZONE].length) ||
                (match[CEMETERY_ZONE] && match[CEMETERY_ZONE].length) ||
                (match[EXILE_ZONE] && match[EXILE_ZONE].length) ||
                (match[REMOVAL_ZONE] && match[REMOVAL_ZONE].length) ||
                (match[GOLDS_PAID_ZONE] && match[GOLDS_PAID_ZONE].length) ||
                (match[UNPAID_GOLD_ZONE] && match[UNPAID_GOLD_ZONE].length) ||
                (match[AUXILIARY_ZONE] && match[AUXILIARY_ZONE].length)
            ) {
                console.log('changing...');
                socket?.emit('changing', {
                    match,
                    matchId
                });
            }
        }        

    }, [socket, match, matchId, emmitChange]);

    useEffect(() => {
        
        socket?.on('playing-open-hand', (data) => {
            dispatch(setPlayOpenHandAction(data.playOpenHand))
        });

        return () => {
            socket?.off('playing-open-hand');
        }
        
    }, [socket, dispatch]);

    useEffect(() => {
        
        socket?.on('showing-discard-opponent', (data) => {
            dispatch(openModalOpponentDiscard())
        });

        return () => {
            socket?.off('showing-discard-opponent');
        }
        
    }, [socket, dispatch]);

    useEffect(() => {
        
        socket?.on('discarding-to-opponent', (data) => {
            
            const newMatch = { ...match }
            newMatch[CEMETERY_ZONE] = [...newMatch[CEMETERY_ZONE], ...data.toDiscard];
            const toDiscardIds = data.toDiscard.map((c: Card) => c.idx);
            newMatch[HAND_ZONE] = newMatch[HAND_ZONE].filter(card => !toDiscardIds.includes(card.idx));
            dispatch(changeMatch(newMatch));

        });

        return () => {
            socket?.off('discarding-to-opponent');
        }
        
    }, [socket, dispatch, match]);

    useEffect(() => {
        
        socket?.on('changing-opponent', (data) => {
            dispatch(changOpponenteMatch(data));
        });

        return () => {
            socket?.off('changing-opponent');
        }
        
    }, [socket, dispatch]);

    useEffect(() => {
        
        socket?.on('updating-match-opponent', (data) => {
            console.log('updating-match-opponent');
            dispatch(changeMatch(data));
        });

        return () => {
            socket?.off('updating-match-opponent');
        }
        
    }, [socket, dispatch]);

    useEffect(() => {

        socket?.on('showing-clastle-to-opponent', () => {
            dispatch(openModalViewCastleOpponent());
        });

        return () => {
            socket?.off('showing-clastle-to-opponent');
        }

    }, [socket, dispatch]);

    useEffect(() => {

        socket?.on('showing-x-clastle-to-opponent', (data) => {
            dispatch(setAmountCardsViewAction(data.amountCardsView));
            dispatch(openModalViewXCastleOpponent());
        });

        return () => {
            socket?.off('showing-clastle-to-opponent');
        }

    }, [socket, dispatch]);

    useEffect(() => {

        socket?.on('showing-hand-to-opponent', () => {
            dispatch(openModalViewHandOpponent());
        });

        return () => {
            socket?.off('showing-hand-to-opponent');
        }

    }, [socket, dispatch]);

    useEffect(() => {

        socket?.on('opponent-leave-match', () => {                  
            youWinModal('Tu oponente abandonó la partida');
            setTimeout(() => {
                finishMatch();
            }, 1500);
        });

        return () => {
            socket?.off('opponent-leave-match');
        }

    }, [socket, youWinModal, dispatch, history, finishMatch]);

    useEffect(() => {

        socket?.on('request-opponent-leave-mutual-match', () => {                  
            leaveMutualMatchModal();
        });

        return () => {
            socket?.off('request-opponent-leave-mutual-match');
        }

    }, [socket, leaveMutualMatchModal]);

    useEffect(() => {

        socket?.on('finish-approve-leave-mutual-match', () => {   
            
            finishMutualMatchModal('Tu oponente aprobó el abandono mutuo. Saliendo...');
            showLoading();
            setTimeout(() => {
                finishMatch();
                hideLoading();
            }, 1500);            
            
        });

        return () => {
            socket?.off('finish-approve-leave-mutual-match');
        }

    }, [socket, finishMutualMatchModal, finishMatch, showLoading, hideLoading]);

    useEffect(() => {

        socket?.on('finish-reject-leave-mutual-match', () => {                  
            finishMutualMatchModal('Tu oponente rechazó el abandono mutuo');

            setTimeout(() => {
                Modal.destroyAll();
            }, 1500);

        });

        return () => {
            socket?.off('finish-reject-leave-mutual-match');
        }

    }, [socket, finishMutualMatchModal]);

    useEffect(() => {
        if (match && match[CASTLE_ZONE] && match[CASTLE_ZONE].length === 0) {

            socket?.emit('i-missed-match', {
                opponentId,
                matchId
            });

            finishMutualMatchModal('Perdiste :(');

            showLoading();
            setTimeout(() => {
                finishMatch();
                hideLoading();
            }, 1500);
        }
    }, [match, socket, matchId, opponentId, finishMutualMatchModal, finishMatch, showLoading, hideLoading]);

    useEffect(() => {

        socket?.on('you-win-match', () => {
            youWinModal('Ganaste :)');

            showLoading();
            setTimeout(() => {
                finishMatch();
                hideLoading();
            }, 1500);

        });

        return () => {
            socket?.off('you-win-match');
        }

    }, [socket, finishMutualMatchModal, youWinModal, finishMatch, showLoading, hideLoading]);

    useEffect(() => {

        socket?.on('get-opponent-match-not-charged', () => {
            socket?.emit('changing', {
                match,
                matchId
            });
        });

        return () => {
            socket?.off('get-opponent-match-not-charged');
        }
        
    }, [socket, match, matchId]);

    useEffect(() => {

        socket?.on('recovery-after-reload-opponent', (payload) => {
            console.log("recovery-after-reload-opponent");
            console.log('matchId', payload.matchId)
            dispatch(matchSetMatchId(payload.matchId));
        });

        return () => {
            socket?.off('recovery-after-reload-opponent');
        }
        
    }, [socket, matchId, dispatch]);

    return (
        <>

            { modalOpenThrowXcards && <ThrowXcardsModal /> }
            { modalOpenViewCastle && <ViewCardsModal origin={ match } zone={ CASTLE_ZONE } /> }

            { modalOpenSelectXcards && <SelectXcardsModal /> }
            { modalOpenSelectXcardsOpponent && <SelectXcardsModal toOpponent />}
            { modalOpenViewXcards && <ViewCardsModal origin={ match } zone={ CASTLE_ZONE } amount={ amountCardsView }/> }
            { modalOpenXViewCastleToOpponent && <ViewCardsModal origin={ opponentMatch } zone={ CASTLE_ZONE } amount={ amountCardsView } onlyRead />}

            { modalOpenViewCastleToOpponent && <ViewCardsModal origin={ opponentMatch } zone={ CASTLE_ZONE } onlyRead /> }
            
            { modalOpenViewCementery && <ViewCardsModal origin={ match } zone={ CEMETERY_ZONE } /> }
            { modalOpenViewExile && <ViewCardsModal origin={ match } zone={ EXILE_ZONE } /> }
            { modalOpenViewRemoval && <ViewCardsModal origin={ match } zone={ REMOVAL_ZONE } /> }
            { modalOpenViewAuxiliary && <ViewCardsModal origin={ match } zone={ AUXILIARY_ZONE } /> }

            { modalOpenViewCementeryOpponent && <ViewCardsModal origin={ opponentMatch } zone={ CEMETERY_ZONE } onlyRead /> }
            { modalOpenViewExileOpponent && <ViewCardsModal origin={ opponentMatch } zone={ EXILE_ZONE } onlyRead /> }
            { modalOpenViewRemovalOpponent && <ViewCardsModal origin={ opponentMatch } zone={ REMOVAL_ZONE } onlyRead /> }
            { modalOpenViewAuxiliaryOpponent && <ViewCardsModal origin={ opponentMatch } zone={ AUXILIARY_ZONE } onlyRead /> }
            

            { modalOpenViewHandOpponent && <ViewCardsModal origin={ opponentMatch } zone={ HAND_ZONE } onlyRead />}

            { modalOpenTakeControlOpponentCard && <TakeControlOpponentCardModal zone={ takeControlOpponentCardZone } index={ takeControlOpponentCardIndex } /> }

            { modalOpenAssignWeapon && <AssingWeaponModal /> }

            { modalOpenDiscardOpponent && <OpponentDiscard />}

            { modalDestinyCastleOptions && <DestinyCastleOptionsModal />}

            {orientation === 'portrait' ? 
                <Row>
                    <Col span={ 24 }>
                        <div style={{ background: "red", color: "white", padding: "10px", textAlign: "center" }}>
                            📱 Gira tu dispositivo para mejor experiencia en horizontal 🖥️
                        </div>
                    </Col>
                </Row>
                
                
            :
            <div className="content-match">
            <DndProvider backend={ isTouchDevice() ? TouchBackend : HTML5Backend } options={{ enableMouseEvents: true }}>
                <Row style={{ position: "relative"}} gutter={[3, 3]}>
                    <Col style={{ position: "relative"}} span={ 24 }>
                        <div className='image-match'>
                            
                            <Button type="primary" size='small' className="menu-button" onClick={() => setIsOpen(!isOpen)} icon={!isOpen ? <RightOutlined /> : <LeftOutlined /> } >
                                {!isOpen ? "Cerrar" : "Abrir"} Menú
                            </Button>
                            <Row gutter={[3, 3]}>

                                <Col span={10}> 
                                    <Zone title={ UNPAID_GOLD_ZONE } className='zone-flex' isOpponent withCount >
                                        { opponentMatch[UNPAID_GOLD_ZONE] && returnItemsForZone(UNPAID_GOLD_ZONE, true, false, true) }
                                    </Zone>
                                </Col>

                                
                                <Col xs={3} sm={3} md={3} lg={2} xl={2}>
                                    <Zone title={ AUXILIARY_ZONE } className='stack' isOpponent >
                                        { opponentMatch[AUXILIARY_ZONE] && returnItemsForZone(AUXILIARY_ZONE, true, false, true) }
                                    </Zone>
                                </Col>
                                <Col xs={11} sm={11} md={11} lg={12} xl={12}>
                                    <Zone title={ HAND_ZONE } className='zone-flex' isOpponent withCount >
                                        { opponentMatch[HAND_ZONE] && returnItemsForZone(HAND_ZONE, false, true, true) }
                                    </Zone>
                                </Col>
                            </Row> 

                            

                            

                            <Row gutter={[3, 3]}>
                                
                                <Col span={ 10 }> 
                                    <Zone title={ GOLDS_PAID_ZONE } className='zone-flex' isOpponent withCount >
                                        { opponentMatch[GOLDS_PAID_ZONE] && returnItemsForZone(GOLDS_PAID_ZONE, true, false, true) }
                                    </Zone>
                                </Col>

                                <Col span={ 14 }> 
                                    <Zone title={ SUPPORT_ZONE } className='zone-flex' isOpponent >
                                        { opponentMatch[SUPPORT_ZONE] && returnItemsForZone(SUPPORT_ZONE, true, false, true) }
                                    </Zone>
                                </Col>
                            </Row>  

                            <Row gutter={[3, 3]}>
                                <Col xs={3} sm={3} md={3} lg={2} xl={2}>
                                    <Zone title={ REMOVAL_ZONE } className='stack' isOpponent withCount>
                                        { opponentMatch[REMOVAL_ZONE] && returnItemsForZone(REMOVAL_ZONE, true, false, true) }
                                    </Zone>
                                </Col>

                                <Col xs={3} sm={3} md={3} lg={2} xl={2}>                                    
                                    <Zone title={ CASTLE_ZONE } className='stack' isOpponent withCount >
                                        { opponentMatch[CASTLE_ZONE] && returnItemsForZone(CASTLE_ZONE, false, true, true) }
                                    </Zone>
                                </Col>

                                <Col xs={18} sm={18} md={18} lg={20} xl={20}> 
                                    <Zone title={ DEFENSE_ZONE } className='zone-flex' isOpponent >
                                        { opponentMatch[DEFENSE_ZONE] && returnItemsForZone(DEFENSE_ZONE, true, false, true) }
                                    </Zone>
                                </Col>
                            </Row>

                            <Row gutter={[3, 3]}>
                                <Col xs={3} sm={3} md={3} lg={2} xl={2}>
                                    <Zone title={ EXILE_ZONE } className='stack' isOpponent withCount>
                                        { opponentMatch[EXILE_ZONE] && returnItemsForZone(EXILE_ZONE, true, false, true) }
                                    </Zone>
                                </Col>

                                <Col xs={3} sm={3} md={3} lg={2} xl={2}>
                                    <Zone title={ CEMETERY_ZONE } className='stack' isOpponent withCount>
                                        { opponentMatch[CEMETERY_ZONE] && returnItemsForZone(CEMETERY_ZONE, true, false, true) }
                                    </Zone>
                                </Col>

                                <Col xs={18} sm={18} md={18} lg={20} xl={20}> 
                                    <Zone title={ ATTACK_ZONE } className='zone-flex' isOpponent >
                                        { opponentMatch[ATTACK_ZONE] && returnItemsForZone(ATTACK_ZONE, true, false, true) }
                                    </Zone> 
                                </Col>
                            </Row>
                            </div>
                            
                            <Phases />

                            <div className='image-match'>
                                { orientation === 'landscape' ? 
                                    <>
                                            <Row gutter={[3, 3]}>
                                                <Col span={3}>
                                                    <Zone title={ EXILE_ZONE } className='stack' withCount >
                                                        { match[EXILE_ZONE] && returnItemsForZone(EXILE_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col>

                                                <Col span={3}>
                                                    <Zone title={ CEMETERY_ZONE } className='stack cementery-zone' withCount >
                                                        { match[CEMETERY_ZONE] && returnItemsForZone(CEMETERY_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col>

                                                <Col span={18}> 
                                                    <Zone title={ ATTACK_ZONE } className='zone-flex attack-zone' >
                                                        { match[ATTACK_ZONE] && returnItemsForZone(ATTACK_ZONE, true, false, false) }
                                                    </Zone> 
                                                </Col>

                                            </Row>

                                            <Row gutter={[3, 3]}>

                                                <Col span={3}>
                                                    <Zone title={ REMOVAL_ZONE } className='stack' withCount>
                                                        { match[REMOVAL_ZONE] && returnItemsForZone(REMOVAL_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col>

                                                <Col span={3}>                                    
                                                    <Zone title={ CASTLE_ZONE } className='stack' withCount >
                                                        { match[CASTLE_ZONE] && returnItemsForZone(CASTLE_ZONE, true, true, false) }
                                                    </Zone>
                                                </Col>

                                                <Col span={18}> 
                                                    <Zone title={ DEFENSE_ZONE } className='zone-flex defense-zone'>
                                                        { match[DEFENSE_ZONE] && returnItemsForZone(DEFENSE_ZONE, true, false, false) }
                                                    </Zone>
                                            </Col>

                                            </Row>

                                            <Row gutter={[3, 3]}>

                                                <Col span={ 10 }> 
                                                    <Zone title={ GOLDS_PAID_ZONE } className='zone-flex paid-gold-zone' withCount>
                                                        { match[GOLDS_PAID_ZONE] && returnItemsForZone(GOLDS_PAID_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col>


                                                <Col span={ 14 }> 
                                                    <Zone title={ SUPPORT_ZONE } className='zone-flex support-zone'>
                                                        { match[SUPPORT_ZONE] && returnItemsForZone(SUPPORT_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col>

                                            </Row>  

                                            <Row gutter={[3, 3]}>

                                                <Col span={9}> 
                                                    <Zone title={ UNPAID_GOLD_ZONE } className='zone-flex unpaid-gold-zone' withCount >
                                                        { match[UNPAID_GOLD_ZONE] && returnItemsForZone(UNPAID_GOLD_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col>

                                                <Col span={3}>
                                                    <Zone title={ AUXILIARY_ZONE } className='stack'>
                                                        { match[AUXILIARY_ZONE] && returnItemsForZone(AUXILIARY_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col>
                                                <Col span={12}>
                                                    <Zone title={ HAND_ZONE } className='zone-flex' withCount >
                                                        { match[HAND_ZONE] && returnItemsForZone(HAND_ZONE, false, true, false) }
                                                    </Zone>
                                                </Col>
                                            </Row>
                                    </> : 
                                    <>
                                        <Row gutter={[3, 3]}>
                                            <Col span={4}>
                                                <Zone title={ EXILE_ZONE } className='stack' withCount >
                                                    { match[EXILE_ZONE] && returnItemsForZone(EXILE_ZONE, true, false, false) }
                                                </Zone>
                                            </Col>

                                            <Col span={4}>
                                                <Zone title={ CEMETERY_ZONE } className='stack cementery-zone' withCount >
                                                    { match[CEMETERY_ZONE] && returnItemsForZone(CEMETERY_ZONE, true, false, false) }
                                                </Zone>
                                            </Col>

                                            <Col span={4}>
                                                <Zone title={ REMOVAL_ZONE } className='stack' withCount>
                                                    { match[REMOVAL_ZONE] && returnItemsForZone(REMOVAL_ZONE, true, false, false) }
                                                </Zone>
                                            </Col>

                                                <Col span={4}>                                
                                                    <Zone title={ CASTLE_ZONE } className='stack' withCount >
                                                        { match[CASTLE_ZONE] && returnItemsForZone(CASTLE_ZONE, true, true, false) }
                                                    </Zone>
                                                </Col>

                                            </Row>

                                            <Row gutter={[3, 3]}>
                                                <Col span={24}>
                                                    <Zone title={ ATTACK_ZONE } className='zone-flex attack-zone' >
                                                        { match[ATTACK_ZONE] && returnItemsForZone(ATTACK_ZONE, true, false, false) }
                                                    </Zone> 
                                                </Col>
                                            </Row>

                                            <Row gutter={[3, 3]}>
                                                <Col span={24}>
                                                    <Zone title={ DEFENSE_ZONE } className='zone-flex defense-zone'>
                                                        { match[DEFENSE_ZONE] && returnItemsForZone(DEFENSE_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col>
                                            </Row>

                                            <Row gutter={[3, 3]}>
                                                <Col span={ 24 }> 
                                                    <Zone title={ SUPPORT_ZONE } className='zone-flex support-zone'>
                                                        { match[SUPPORT_ZONE] && returnItemsForZone(SUPPORT_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col>
                                            </Row>

                                            <Row gutter={[3, 3]}>
                                                <Col span={ 24 }> 
                                                    <Zone title={ GOLDS_PAID_ZONE } className='zone-flex paid-gold-zone' withCount>
                                                        { match[GOLDS_PAID_ZONE] && returnItemsForZone(GOLDS_PAID_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col> 
                                            </Row> 

                                            <Row gutter={[3, 3]}>
                                                <Col span={ 24 }> 
                                                    <Zone title={ UNPAID_GOLD_ZONE } className='zone-flex unpaid-gold-zone' withCount >
                                                        { match[UNPAID_GOLD_ZONE] && returnItemsForZone(UNPAID_GOLD_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col>
                                            </Row>

                                            <Row gutter={[3, 3]}>
                                                <Col span={ 4 }>
                                                    <Zone title={ AUXILIARY_ZONE } className='stack'>
                                                        { match[AUXILIARY_ZONE] && returnItemsForZone(AUXILIARY_ZONE, true, false, false) }
                                                    </Zone>
                                                </Col>
                                                <Col span={ 20 }>
                                                    <Zone title={ HAND_ZONE } className='zone-flex' withCount >
                                                        { match[HAND_ZONE] && returnItemsForZone(HAND_ZONE, false, true, false) }
                                                    </Zone>
                                                </Col>
                                            </Row>
                                    </>}
                            </div>
                    </Col>

                    <div style={{display: isOpen ? 'none' : 'block'}}>
                        <Col span={isMobile ?  8 : 5} 
                            className={isMobile ? orientation === 'landscape' ? "content-actions content-actions-mobile-landscape" : "content-actions" : "content-actions"}
                            >

                                <Row gutter={[16, 16]} style={{paddingTop: 5}}>
                                    <Col style={{width: '100%'}}>
                                        <Popover
                                            placement="leftTop" 
                                            trigger="click"
                                            content={ content }
                                            visible={ visiblePopover }
                                            onVisibleChange={ handleVisibleChangePopever }
                                        >
                                            <Button style={{backgroundColor: '#780F0F'}} block icon={<CloseCircleOutlined />} >Salir</Button>
                                        </Popover>
                                    </Col> 
                                </Row>     

                                <Divider className="divider-vs">
                                    {`vs ${opponentUsername}`} 
                                    <p style={{margin: 0, fontSize: 13}}>
                                        {
                                            activeUsersForPlay?.find((user: User) => user.id === opponentId)?.online ? '(conectado)' : '(desconectado)'
                                        }
                                    </p>
                                </Divider>

                                <Row justify="space-around" align="middle">
                                    <Col span={24}>
                                        <Chat />
                                    </Col>
                                </Row>
                                

                            </Col>
                        </div>
                    
                </Row>
            </DndProvider>
        </div>
          }

            
            
        </>
    )
}

export default MatchPage;