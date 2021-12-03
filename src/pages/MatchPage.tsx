import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Col, Popover, Modal, Row, Button, Divider } from 'antd';

import { MenuOutlined } from '@ant-design/icons';


import CardComponent from '../components/match/CardComponent';
import { ZONE_NAMES } from "../constants";
import { SocketContext } from '../context/SocketContext';
import useHideMenu from '../hooks/useHideMenu';
import { RootState } from '../store';
import { Card } from '../store/card/types';
import { changeMatch, changOpponenteMatch, resetMatch } from '../store/match/action';
import Zone from '../components/match/Zone';
import { Dictionary } from '../store/match/types';

import '../css/match.css';
import ThrowXcardsModal from '../components/modals/ThrowXcardsModal';
import ViewCardsModal from '../components/modals/ViewCardsModal';
import SelectXcardsModal from '../components/modals/SelectXcardsModal';
import { openModalViewCastleOpponent, openModalViewHandOpponent } from '../store/ui-modal/action';
import TakeControlOpponentCardModal from '../components/modals/TakeControlOpponentCardModal';
import AssingWeaponModal from '../components/modals/AssingWeaponModal';

import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { isTouchDevice } from '../helpers/touch';
import Chat from '../components/chat/Chat';
import { resetChatAction } from '../store/chat/action';

const { confirm } = Modal;

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE, GOLDS_PAID_ZONE, UNPAID_GOLD_ZONE, AUXILIARY_ZONE } = ZONE_NAMES;

const MatchPage: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(true, path);

    const dispatch = useDispatch();

    const { match, emmitChange, matchId, opponentMatch, opponentId, opponentUsername, amountCardsView, takeControlOpponentCardIndex, takeControlOpponentCardZone } = useSelector((state: RootState) => state.match);
    const { deckDefault } = useSelector((state: RootState) => state.decks);
    const history = useHistory();
   
    const [visiblePopover, setVisiblePopover] = useState(false);
    
    useEffect(() => {

        if (!matchId) {
            history.replace('/play');
        }

    }, [matchId, history]);

    const { 
            modalOpenThrowXcards, 
            modalOpenViewCastle, 
            modalOpenViewXcards, 
            modalOpenSelectXcards, 
            modalOpenViewCastleToOpponent, 
            modalOpenViewCementery, 
            modalOpenViewExile, 
            modalOpenViewRemoval,
            modalOpenViewCementeryOpponent, 
            modalOpenViewExileOpponent, 
            modalOpenViewRemovalOpponent,
            modalOpenViewHandOpponent,
            modalOpenTakeControlOpponentCard,
            modalOpenAssignWeapon
    } = useSelector((state: RootState) => state.uiModal);

    const { socket } = useContext(SocketContext);

    const finishMatch = useCallback(() => {

        Modal.destroyAll();
        dispatch(resetMatch());
        dispatch(resetChatAction());
        history.replace('/play');

        }, [history, dispatch],
    );

    const openLeaveMatchModal = () => {
        confirm({
            title: '¿Seguro que quieres abandonar la partida?',
            icon: <ExclamationCircleOutlined />,
            content: 'Si abandonas la partida perderás y tu oponente será el ganador',
            okText: 'Sí',
            cancelText: 'No',
            onOk() {
                socket?.emit('close-match', {
                    matchId,
                    opponentId
                });
                finishMatch();
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
                    socket?.emit('approve-request-leave-mutual-match', {
                        matchId,
                        opponentId
                    });
                    finishMatch();
                    
                },
                onCancel() {
                    socket?.emit('reject-request-leave-mutual-match', {
                        matchId,
                        opponentId
                    }); 
                },
            });
        }, [matchId, opponentId, socket, finishMatch],
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

    const opponentCards: Dictionary<Card[] | []> = {};
    opponentCards[CASTLE_ZONE] = [];
    opponentCards[HAND_ZONE] = [];
    opponentCards[ATTACK_ZONE] = [];
    opponentCards[CEMETERY_ZONE] = [];
    opponentCards[EXILE_ZONE] = [];
    opponentCards[DEFENSE_ZONE] = [];
    opponentCards[REMOVAL_ZONE] = [];    
    opponentCards[SUPPORT_ZONE] = [];
    opponentCards[GOLDS_PAID_ZONE] = [];
    opponentCards[UNPAID_GOLD_ZONE] = [];

    //const isMobile = window.innerWidth < 600;

    useEffect(() => {

        if (deckDefault?.cards.length) {
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

    }, [dispatch, deckDefault?.cards]);

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
            }, 2000);
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

            setTimeout(() => {
                finishMatch();
            }, 2000);            
            
        });

        return () => {
            socket?.off('finish-approve-leave-mutual-match');
        }

    }, [socket, finishMutualMatchModal, finishMatch]);

    useEffect(() => {

        socket?.on('finish-reject-leave-mutual-match', () => {                  
            finishMutualMatchModal('Tu oponente rechazó el abandono mutuo');

            setTimeout(() => {
                Modal.destroyAll();
            }, 2000);

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

            setTimeout(() => {
                finishMatch();
            }, 2000);
        }
    }, [match, socket, matchId, opponentId, finishMutualMatchModal, finishMatch]);

    useEffect(() => {

        socket?.on('you-win-match', () => {
            youWinModal('Ganaste :)');

            setTimeout(() => {
                finishMatch();
            }, 2000);

        });

        return () => {
            socket?.off('you-win-match');
        }

    }, [socket, finishMutualMatchModal, youWinModal, finishMatch]);


    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number, zoneName: string) => {
            return; // para evitar que ordene
            // const dragCard = match[zoneName][dragIndex];

            // if (!match[zoneName][dragIndex]) { // Significa que quiere ordenar cards de distintas zonas
            //     return;
            // }

            // let newCards = {...match};

            // newCards[zoneName] = update(match[zoneName], {
            //     $splice: [
            //         [dragIndex, 1],
            //         [hoverIndex, 0, dragCard],
            //     ],
            // });

            // dispatch(changeMatch(newCards));
        },
        [],
    );

    const returnItemsForZone = (zoneName: string) => {
        return match[zoneName]
            .map((card: Card, index: number) => (
                <CardComponent
                    key={ index }
                    index={ index }
                    moveCard={(dragIndex: number, hoverIndex: number, zoneName: string) => moveCard(dragIndex, hoverIndex, zoneName)}
                    zone={ zoneName }
                    card={ card }
                />
            ));
    };

    const returnItemsForZoneOpponent = (zoneName: string) => {
        return opponentMatch[zoneName]
            .map((card: Card, index: number) => (
                <CardComponent
                    key={ index }
                    isOpponent={ true }
                    index={ index }
                    moveCard={(dragIndex: number, hoverIndex: number, zoneName: string) => moveCard(dragIndex, hoverIndex, zoneName)}
                    zone={ zoneName }
                    card={ card }
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

    return (
        <>

            { modalOpenThrowXcards && <ThrowXcardsModal /> }
            { modalOpenViewCastle && <ViewCardsModal origin={ match } zone={ CASTLE_ZONE } /> }

            { modalOpenSelectXcards && <SelectXcardsModal /> }
            { modalOpenViewXcards && <ViewCardsModal origin={ match } zone={ CASTLE_ZONE } amount={ amountCardsView }/> }

            { modalOpenViewCastleToOpponent && <ViewCardsModal origin={ opponentMatch } zone={ CASTLE_ZONE } onlyRead /> }
            
            { modalOpenViewCementery && <ViewCardsModal origin={ match } zone={ CEMETERY_ZONE } /> }
            { modalOpenViewExile && <ViewCardsModal origin={ match } zone={ EXILE_ZONE } /> }
            { modalOpenViewRemoval && <ViewCardsModal origin={ match } zone={ REMOVAL_ZONE } /> }

            { modalOpenViewCementeryOpponent && <ViewCardsModal origin={ opponentMatch } zone={ CEMETERY_ZONE } onlyRead /> }
            { modalOpenViewExileOpponent && <ViewCardsModal origin={ opponentMatch } zone={ EXILE_ZONE } onlyRead /> }
            { modalOpenViewRemovalOpponent && <ViewCardsModal origin={ opponentMatch } zone={ REMOVAL_ZONE } onlyRead /> }

            { modalOpenViewHandOpponent && <ViewCardsModal origin={ opponentMatch } zone={ HAND_ZONE } onlyRead />}

            { modalOpenTakeControlOpponentCard && <TakeControlOpponentCardModal zone={ takeControlOpponentCardZone } index={ takeControlOpponentCardIndex } /> }

            { modalOpenAssignWeapon && <AssingWeaponModal /> }

            <div className="content-match">
                <DndProvider backend={ isTouchDevice() ? TouchBackend : HTML5Backend } options={{ enableMouseEvents: true }}>
                    <Row gutter={[8, 8]}>
                        <Col span={ 20 }>
                                <Row gutter={[8, 8]}>
                                    <Col span={ 10 }> 
                                        <Zone title={ GOLDS_PAID_ZONE + ': ' + (opponentMatch[GOLDS_PAID_ZONE] ? opponentMatch[GOLDS_PAID_ZONE].length : '0') } className='zone-flex' isOpponent>
                                            { opponentMatch[GOLDS_PAID_ZONE] && returnItemsForZoneOpponent(GOLDS_PAID_ZONE) }
                                        </Zone>
                                    </Col>
                                    <Col span={ 2 }>
                                        <Zone title={ AUXILIARY_ZONE } className='zone-flex' isOpponent >
                                            { opponentMatch[AUXILIARY_ZONE] && returnItemsForZoneOpponent(AUXILIARY_ZONE) }
                                        </Zone>
                                    </Col>
                                    <Col span={ 12 }>
                                        <Zone title={ HAND_ZONE } className='zone-flex' isOpponent >
                                            { opponentMatch[HAND_ZONE] && returnItemsForZoneOpponent(HAND_ZONE) }
                                        </Zone>
                                    </Col>
                                </Row> 

                                <Row gutter={[8, 8]}>
                                    <Col span={ 10 }> 
                                        <Zone title={ UNPAID_GOLD_ZONE + ': ' + (opponentMatch[UNPAID_GOLD_ZONE] ? opponentMatch[UNPAID_GOLD_ZONE].length : '0') } className='zone-flex ' isOpponent>
                                            { opponentMatch[UNPAID_GOLD_ZONE] && returnItemsForZoneOpponent(UNPAID_GOLD_ZONE) }
                                        </Zone>
                                    </Col>

                                    <Col span={ 14 }> 
                                        <Zone title={ SUPPORT_ZONE } className='zone-flex' isOpponent >
                                            { opponentMatch[SUPPORT_ZONE] && returnItemsForZoneOpponent(SUPPORT_ZONE) }
                                        </Zone>
                                    </Col>
                                </Row>  

                                <Row gutter={[8, 8]}>
                                    <Col span={ 2 }>
                                        <Zone title={ REMOVAL_ZONE } className='stack' isOpponent >
                                            { opponentMatch[REMOVAL_ZONE] && returnItemsForZoneOpponent(REMOVAL_ZONE) }
                                        </Zone>
                                    </Col>

                                    <Col span={ 2 }>                                    
                                        <Zone title={ CASTLE_ZONE + ': ' + (opponentMatch[CASTLE_ZONE] ? opponentMatch[CASTLE_ZONE].length : '0') } className='stack' isOpponent >
                                            { opponentMatch[CASTLE_ZONE] && returnItemsForZoneOpponent(CASTLE_ZONE) }
                                        </Zone>
                                    </Col>

                                    <Col span={ 20 }> 
                                        <Zone title={ DEFENSE_ZONE } className='zone-flex' isOpponent >
                                            { opponentMatch[DEFENSE_ZONE] && returnItemsForZoneOpponent(DEFENSE_ZONE) }
                                        </Zone>
                                    </Col>
                                </Row>

                                <Row gutter={[8, 8]}>
                                    <Col span={ 2 }>
                                        <Zone title={ EXILE_ZONE } className='stack' isOpponent >
                                            { opponentMatch[EXILE_ZONE] && returnItemsForZoneOpponent(EXILE_ZONE) }
                                        </Zone>
                                    </Col>

                                    <Col span={ 2 }>
                                        <Zone title={ CEMETERY_ZONE } className='stack' isOpponent >
                                            { opponentMatch[CEMETERY_ZONE] && returnItemsForZoneOpponent(CEMETERY_ZONE) }
                                        </Zone>
                                    </Col>

                                    <Col span={ 20 }> 
                                        <Zone title={ ATTACK_ZONE } className='zone-flex' isOpponent >
                                            { opponentMatch[ATTACK_ZONE] && returnItemsForZoneOpponent(ATTACK_ZONE) }
                                        </Zone> 
                                    </Col>
                                </Row>

                                {/* <Row gutter={[8, 8]} style={{padding: 10}}>
                                    <Col span={ 22 } style={{backgroundColor: '#330000', padding: 20, borderRadius: 5}}>
                                        <Steps current={current} size="small">
                                            {steps.map(item => (
                                                <Step key={item.title} title={item.title} />
                                            ))}
                                        </Steps>
                                    </Col>
                                    <Col span={ 2 } style={{padding: 15}}>
                                        <Button type="primary" size="large" onClick={() => next()}>
                                            Next
                                        </Button>
                                    </Col>
                                </Row> */}

                                <Row gutter={[8, 8]}>

                                    <Col span={ 2 }>
                                        <Zone title={ EXILE_ZONE } className='stack' >
                                            { match[EXILE_ZONE] && returnItemsForZone(EXILE_ZONE) }
                                        </Zone>
                                    </Col>

                                    <Col span={ 2 }>
                                        <Zone title={ CEMETERY_ZONE } className='stack'>
                                            { match[CEMETERY_ZONE] && returnItemsForZone(CEMETERY_ZONE) }
                                        </Zone>
                                    </Col>

                                    <Col span={ 20 }> 
                                        <Zone title={ ATTACK_ZONE } className='zone-flex'>
                                            { match[ATTACK_ZONE] && returnItemsForZone(ATTACK_ZONE) }
                                        </Zone> 
                                    </Col>

                                </Row>

                                <Row gutter={[8, 8]}>

                                    <Col span={ 2 }>
                                        <Zone title={ REMOVAL_ZONE } className='stack'>
                                            { match[REMOVAL_ZONE] && returnItemsForZone(REMOVAL_ZONE) }
                                        </Zone>
                                    </Col>

                                    <Col span={ 2 }>                                    
                                        <Zone title={ CASTLE_ZONE + ': ' + (match[CASTLE_ZONE] ? match[CASTLE_ZONE].length : '0') } className='stack'>
                                            { match[CASTLE_ZONE] && returnItemsForZone(CASTLE_ZONE) }
                                        </Zone>
                                    </Col>

                                    <Col span={ 20 }> 
                                        <Zone title={ DEFENSE_ZONE } className='zone-flex'>
                                            { match[DEFENSE_ZONE] && returnItemsForZone(DEFENSE_ZONE) }
                                        </Zone>
                                    </Col>

                                </Row>

                                <Row gutter={[8, 8]}>

                                    <Col span={ 10 }> 
                                        <Zone title={ UNPAID_GOLD_ZONE + ': ' + (match[UNPAID_GOLD_ZONE] ? match[UNPAID_GOLD_ZONE].length : '0') } className='zone-flex' >
                                            { match[UNPAID_GOLD_ZONE] && returnItemsForZone(UNPAID_GOLD_ZONE) }
                                        </Zone>
                                    </Col>
                                    <Col span={ 14 }> 
                                        <Zone title={ SUPPORT_ZONE } className='zone-flex'>
                                            { match[SUPPORT_ZONE] && returnItemsForZone(SUPPORT_ZONE) }
                                        </Zone>
                                    </Col>

                                </Row>  

                                <Row gutter={[8, 8]}>
                                    <Col span={ 10 }> 
                                        <Zone title={ GOLDS_PAID_ZONE + ': ' + (match[GOLDS_PAID_ZONE] ? match[GOLDS_PAID_ZONE].length : '0') } className='zone-flex' >
                                            { match[GOLDS_PAID_ZONE] && returnItemsForZone(GOLDS_PAID_ZONE) }
                                        </Zone>
                                    </Col>
                                    <Col span={ 2 }>
                                        <Zone title={ AUXILIARY_ZONE } className='stack'>
                                            { match[AUXILIARY_ZONE] && returnItemsForZone(AUXILIARY_ZONE) }
                                        </Zone>
                                    </Col>
                                    <Col span={ 12 }>
                                        <Zone title={ HAND_ZONE } className='zone-flex' withPopover >
                                            { match[HAND_ZONE] && returnItemsForZone(HAND_ZONE) }
                                        </Zone>
                                    </Col>
                                </Row>
                            
                        </Col>
                        <Col span={4} className="content-actions">
                            <Row gutter={[16, 8]} justify="end">
                                <Col>
                                    <Popover
                                        placement="leftTop" 
                                        trigger="click"
                                        content={ content }
                                        visible={ visiblePopover }
                                        onVisibleChange={ handleVisibleChangePopever }
                                    >
                                        <Button  style={{backgroundColor: 'black'}} icon={<MenuOutlined />} >{`vs ${opponentUsername}`}</Button>
                                    </Popover>
                                </Col> 
                            </Row>

                            <Divider/>

                            <Row gutter={[8, 8]} justify="end" align="bottom">
                                <Col>
                                    Stop, Lanzar dado
                                </Col>
                            </Row>
                            
                            <Divider/>
                            
                            <Row gutter={[8, 8]}>
                                <Col span={24} style={{width: '100%'}} >
                                    <Chat />
                                </Col>
                            </Row>

                            
                            
                        </Col>
                    </Row>
                </DndProvider>
            </div>
            
        </>
    )
}

export default MatchPage;