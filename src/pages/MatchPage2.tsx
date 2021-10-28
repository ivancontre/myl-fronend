import React, { FC, useCallback, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Col, Divider, Row, Tag } from 'antd';


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
import ViewCastleModal from '../components/modals/ViewCastleModal';

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE } = ZONE_NAMES;

const MatchPage2: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(true, path);

    const dispatch = useDispatch();

    const { match, matchId, opponentMatch, opponentId } = useSelector((state: RootState) => state.match);
    const { deckDefault } = useSelector((state: RootState) => state.decks);
    const { modalOpenThrowXcards, modalOpenViewCastle } = useSelector((state: RootState) => state.uiModal);

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

    const isMobile = window.innerWidth < 600;

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
                (match[REMOVAL_ZONE] && match[REMOVAL_ZONE].length)
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
        
        socket?.on('changing-oponent', (data) => {
            console.log('changing-oponent');
            dispatch(changOpponenteMatch(data));
        });
        
    }, [socket, dispatch]);

    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number, zoneName: string) => {

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
                    isOpponent={true}
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
            { modalOpenViewCastle && <ViewCastleModal /> }


            <DndProvider backend={ isMobile ? TouchBackend : HTML5Backend } >
                <Row gutter={[8, 8]}>
                    <Col span={ 21 }>

                            <Row gutter={[8, 8]}>
                                <Col offset={ 6 }>
                                    <Zone title={ HAND_ZONE } className='zone'>
                                        { opponentMatch[HAND_ZONE] && returnItemsForZoneOpponent(HAND_ZONE) }
                                    </Zone>
                                </Col>
                            </Row> 

                            <Row gutter={[8, 8]}>
                                <Col span={ 3 }> 
                                    Oros sin pagar
                                </Col>

                                <Col span={ 3 }> 
                                    Oros pagados
                                </Col>

                                <Col span={ 18 }> 
                                    <Zone title={ SUPPORT_ZONE } className='zone'>
                                        { opponentMatch[SUPPORT_ZONE] && returnItemsForZoneOpponent(SUPPORT_ZONE) }
                                    </Zone>
                                </Col>
                            </Row>  

                            <Row gutter={[8, 8]}>
                                <Col span={ 3 }> 
                                    <div className="actions">
                                        <Tag color="green">{ opponentMatch[REMOVAL_ZONE] && opponentMatch[REMOVAL_ZONE].length }</Tag>
                                    </div>
                                    <Zone title={ REMOVAL_ZONE } className='zone stack'>
                                        { opponentMatch[REMOVAL_ZONE] && returnItemsForZoneOpponent(REMOVAL_ZONE) }
                                    </Zone>
                                </Col>

                                <Col span={ 3 }> 
                                    <div className="actions">
                                        <Tag color="green">{ opponentMatch[CASTLE_ZONE] && opponentMatch[CASTLE_ZONE].length }</Tag>
                                    </div>
                                    <Zone title={ CASTLE_ZONE } className='zone stack'>
                                        { opponentMatch[CASTLE_ZONE] && returnItemsForZoneOpponent(CASTLE_ZONE) }
                                    </Zone>
                                </Col>

                                <Col span={ 18 }> 
                                    <Zone title={ DEFENSE_ZONE } className='zone'>
                                        { opponentMatch[DEFENSE_ZONE] && returnItemsForZoneOpponent(DEFENSE_ZONE) }
                                    </Zone>
                                </Col>
                            </Row>

                            <Row gutter={[8, 8]}>
                                <Col span={ 3 }> 
                                    <div className="actions">
                                        <Tag color="green">{ opponentMatch[EXILE_ZONE] && opponentMatch[EXILE_ZONE].length }</Tag>
                                    </div>
                                    <Zone title={ EXILE_ZONE } className='zone stack'>
                                        { opponentMatch[EXILE_ZONE] && returnItemsForZoneOpponent(EXILE_ZONE) }
                                    </Zone>
                                </Col>

                                <Col span={ 3 }>
                                    <div className="actions">
                                        <Tag color="green">{ opponentMatch[CEMETERY_ZONE] && opponentMatch[CEMETERY_ZONE].length }</Tag>
                                    </div>
                                    <Zone title={ CEMETERY_ZONE } className='zone stack'>
                                        { opponentMatch[CEMETERY_ZONE] && returnItemsForZoneOpponent(CEMETERY_ZONE) }
                                    </Zone>
                                </Col>

                                <Col span={ 18 }> 
                                    <Zone title={ ATTACK_ZONE } className='zone'>
                                        { opponentMatch[ATTACK_ZONE] && returnItemsForZoneOpponent(ATTACK_ZONE) }
                                    </Zone> 
                                </Col>
                            </Row>
                        
                    </Col>
                </Row>

                <Divider>{ online ? 'Online' : 'Offline' }</Divider>

                <Row gutter={[8, 8]}>
                    <Col span={ 21 }>
                        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                            <Row gutter={[8, 8]}>

                                <Col span={ 3 }> 
                                    <div className="actions">
                                        <Tag color="green">{ match[EXILE_ZONE] && match[EXILE_ZONE].length }</Tag>
                                    </div>
                                    <Zone title={ EXILE_ZONE } className='zone stack'>
                                        { match[EXILE_ZONE] && returnItemsForZone(EXILE_ZONE) }
                                    </Zone>
                                </Col>

                                <Col span={ 3 }>
                                    <div className="actions">
                                        <Tag color="green">{ match[CEMETERY_ZONE] && match[CEMETERY_ZONE].length }</Tag>
                                    </div>
                                    <Zone title={ CEMETERY_ZONE } className='zone stack'>
                                        { match[CEMETERY_ZONE] && returnItemsForZone(CEMETERY_ZONE) }
                                    </Zone>
                                </Col>

                                <Col span={ 18 }> 
                                    <Zone title={ ATTACK_ZONE } className='zone'>
                                        { match[ATTACK_ZONE] && returnItemsForZone(ATTACK_ZONE) }
                                    </Zone> 
                                </Col>

                            </Row>

                            <Row gutter={[8, 8]}>

                                <Col span={ 3 }> 
                                    <div className="actions">
                                        <Tag color="green">{ match[REMOVAL_ZONE] && match[REMOVAL_ZONE].length }</Tag>
                                    </div>
                                    <Zone title={ REMOVAL_ZONE } className='zone stack'>
                                        { match[REMOVAL_ZONE] && returnItemsForZone(REMOVAL_ZONE) }
                                    </Zone>
                                </Col>

                                <Col span={ 3 }> 
                                <   div className="actions">
                                        <Tag color="green">{ match[CASTLE_ZONE] && match[CASTLE_ZONE].length }</Tag>
                                    </div>
                                    <Zone title={ CASTLE_ZONE } className='zone stack'>
                                        { match[CASTLE_ZONE] && returnItemsForZone(CASTLE_ZONE) }
                                    </Zone>
                                </Col>

                                <Col span={ 18 }> 
                                    <Zone title={ DEFENSE_ZONE } className='zone'>
                                        { match[DEFENSE_ZONE] && returnItemsForZone(DEFENSE_ZONE) }
                                    </Zone>
                                </Col>

                            </Row>

                            <Row gutter={[8, 8]}>

                                <Col span={ 3 }> 
                                    Oros sin pagar
                                </Col>

                                <Col span={ 3 }> 
                                    Oros pagados
                                </Col>

                                <Col span={ 18 }> 
                                    <Zone title={ SUPPORT_ZONE } className='zone'>
                                        { match[SUPPORT_ZONE] && returnItemsForZone(SUPPORT_ZONE) }
                                    </Zone>
                                </Col>

                            </Row>  

                            <Row gutter={[8, 8]}>
                                <Col offset={ 6 }>
                                    <Zone title={ HAND_ZONE } className='zone'>
                                        { match[HAND_ZONE] && returnItemsForZone(HAND_ZONE) }
                                    </Zone>
                                </Col>
                            </Row>    

                        </DndProvider>
                    </Col>
                </Row>

            </DndProvider>
        </>
    )
}

export default MatchPage2;