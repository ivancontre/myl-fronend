import React, { FC, useCallback, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Button, Col, Row, Steps } from 'antd';


import CardComponent from '../components/match/CardComponent';
import { ZONE_NAMES } from "../constants";
import { SocketContext } from '../context/SocketContext';
import useHideMenu from '../hooks/useHideMenu';
import { RootState } from '../store';
import { Card } from '../store/card/types';
import { changeMatch, changOpponenteMatch } from '../store/match/action';
import Zone from '../components/match/Zone';
import { Dictionary } from '../store/match/types';

import '../css/match.css';
import ThrowXcardsModal from '../components/modals/ThrowXcardsModal';
import ViewCardsModal from '../components/modals/ViewCardsModal';
import SelectXcardsModal from '../components/modals/SelectXcardsModal';
import { openModalViewCastleOpponent, openModalViewHandOpponent } from '../store/ui-modal/action';
import TakeControlOpponentCardModal from '../components/modals/TakeControlOpponentCardModal';

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE, GOLDS_PAID_ZONE, UNPAID_GOLD_ZONE } = ZONE_NAMES;

const { Step } = Steps;

const MatchPage2: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(true, path);

    const dispatch = useDispatch();

    const { match, matchId, opponentMatch, opponentId, amountCardsView, takeControlOpponentCardIndex, takeControlOpponentCardZone } = useSelector((state: RootState) => state.match);
    const { deckDefault } = useSelector((state: RootState) => state.decks);
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
            modalOpenTakeControlOpponentCard
    } = useSelector((state: RootState) => state.uiModal);

    const { online, socket } = useContext(SocketContext);

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

    const steps = [
        {
          title: 'Agrupación',
          content: 'First-content',
        },
        {
          title: 'Vigilia',
          content: 'Second-content',
        },
        {
          title: 'Batalla Mitológica',
          content: 'Last-content',
        },
        {
          title: 'Ataque',
          content: 'Last-content',
        },
        {
          title: 'Fase Final',
          content: 'Last-content',
        },
        {
          title: 'Fin del Turno',
          content: 'Last-content',
        },
    ];

    const [current, setCurrent] = React.useState(0);

    const isMobile = window.innerWidth < 600;

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    useEffect(() => {
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
        dispatch(changeMatch(myCards));        
    }, [dispatch, deckDefault?.cards]);

    useEffect(() => {
        
        if (match) {
            if (
                (match[CASTLE_ZONE] && match[CASTLE_ZONE].length) ||
                (match[DEFENSE_ZONE] && match[DEFENSE_ZONE].length) ||
                (match[ATTACK_ZONE] && match[ATTACK_ZONE].length) ||
                (match[SUPPORT_ZONE] && match[SUPPORT_ZONE].length) ||
                (match[CEMETERY_ZONE] && match[CEMETERY_ZONE].length) ||
                (match[EXILE_ZONE] && match[EXILE_ZONE].length) ||
                (match[REMOVAL_ZONE] && match[REMOVAL_ZONE].length) ||
                (match[GOLDS_PAID_ZONE] && match[GOLDS_PAID_ZONE].length) ||
                (match[UNPAID_GOLD_ZONE] && match[UNPAID_GOLD_ZONE].length)
            ) {
                console.log('changing');
                socket?.emit('changing', {
                    match,
                    opponentId
                });
            }
        }        

    }, [socket, match, matchId, opponentId]);

    useEffect(() => {
        
        socket?.on('changing-opponent', (data) => {
            console.log('changing-opponent');
            dispatch(changOpponenteMatch(data));
        });
        
    }, [socket, dispatch]);

    useEffect(() => {
        
        socket?.on('updating-match-opponent', (data) => {
            console.log('updating-match-opponent');
            dispatch(changeMatch(data));
        });
        
    }, [socket, dispatch]);
    

    useEffect(() => {

        socket?.on('showing-clastle-to-opponent', () => {
            dispatch(openModalViewCastleOpponent());
        });

    }, [socket, dispatch]);

    useEffect(() => {

        socket?.on('showing-hand-to-opponent', () => {
            dispatch(openModalViewHandOpponent());
        });

    }, [socket, dispatch]);    

    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number, zoneName: string) => {
            return; // para evitar que ordene
            const dragCard = match[zoneName][dragIndex];

            if (!match[zoneName][dragIndex]) { // Significa que quiere ordenar cards de distintas zonas
                return;
            }

            let newCards = {...match};

            newCards[zoneName] = update(match[zoneName], {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            });

            dispatch(changeMatch(newCards));
        },
        [match, dispatch],
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

            { modalOpenViewHandOpponent && <ViewCardsModal origin={ opponentMatch } zone={ HAND_ZONE } />}

            { modalOpenTakeControlOpponentCard && <TakeControlOpponentCardModal zone={ takeControlOpponentCardZone } index={ takeControlOpponentCardIndex } /> }

            <div className="content-match">
                <DndProvider backend={ isMobile ? TouchBackend : HTML5Backend } >
                    <Row gutter={[8, 8]}>
                        <Col span={ 20 }>
                                <Row gutter={[8, 8]}>
                                    <Col span={ 8 }> 
                                        <Zone title={ GOLDS_PAID_ZONE + ': ' + (opponentMatch[GOLDS_PAID_ZONE] ? opponentMatch[GOLDS_PAID_ZONE].length : '0') } className='zone-flex' isOpponent>
                                            { opponentMatch[GOLDS_PAID_ZONE] && returnItemsForZoneOpponent(GOLDS_PAID_ZONE) }
                                        </Zone>
                                    </Col>
                                    <Col span={ 16 }>
                                        <Zone title={ HAND_ZONE } className='zone-flex' isOpponent >
                                            { opponentMatch[HAND_ZONE] && returnItemsForZoneOpponent(HAND_ZONE) }
                                        </Zone>
                                    </Col>
                                </Row> 

                                <Row gutter={[8, 8]}>
                                    <Col span={ 8 }> 
                                        <Zone title={ UNPAID_GOLD_ZONE + ': ' + (opponentMatch[UNPAID_GOLD_ZONE] ? opponentMatch[UNPAID_GOLD_ZONE].length : '0') } className='zone-flex ' isOpponent>
                                            { opponentMatch[UNPAID_GOLD_ZONE] && returnItemsForZoneOpponent(UNPAID_GOLD_ZONE) }
                                        </Zone>
                                    </Col>

                                    <Col span={ 16 }> 
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
                                        <Zone title={ UNPAID_GOLD_ZONE + ': ' + (match[UNPAID_GOLD_ZONE] ? match[UNPAID_GOLD_ZONE].length : '0') } className='zone-flex' withPopover>
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
                                        <Zone title={ GOLDS_PAID_ZONE + ': ' + (match[GOLDS_PAID_ZONE] ? match[GOLDS_PAID_ZONE].length : '0') } className='zone-flex' withPopover>
                                            { match[GOLDS_PAID_ZONE] && returnItemsForZone(GOLDS_PAID_ZONE) }
                                        </Zone>
                                    </Col>
                                    <Col span={ 14 }>
                                        <Zone title={ HAND_ZONE } className='zone-flex' withPopover >
                                            { match[HAND_ZONE] && returnItemsForZone(HAND_ZONE) }
                                        </Zone>
                                    </Col>
                                </Row>
                            
                        </Col>
                        <Col span={4}>

                        </Col>
                    </Row>
                </DndProvider>
            </div>
            
        </>
    )
}

export default MatchPage2;