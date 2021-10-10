import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import update from 'immutability-helper';
import { Button, Col, Divider, Row, Tag } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { EyeFilled } from '@ant-design/icons';

import Zone from '../components/Zone';
import Card from '../components/Card';
import { ZONE_NAMES } from "../constants";
import { SocketContext } from '../context/SocketContext';

export interface Item {
    id: number;
    text: string;
};

export type Dictionary<TValue> = {
    [id: string]: TValue;
};

export interface DragItem {
    index: number;
    id: number;
    zone: string;
};

const Match: FC = () => {

    const { DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE } = ZONE_NAMES;


    let data: Dictionary<Item[] | []> = {};
    data[DEFENSE_ZONE] =  [
        {
          id: 1,
          text: 'I 1',
        },
        {
          id: 2,
          text: 'I 2',
        },
        {
          id: 3,
          text: 'I 3',
        },
        {
          id: 4,
          text: 'I 4',
        },
        {
          id: 5,
          text: 'I 5',
        },
        {
          id: 6,
          text: 'I 6',
        },
        {
          id: 7,
          text: 'I 7',
        },
        {
          id: 8,
          text: 'I 8',
        }
    ];
    data[ATTACK_ZONE] = [];
    data[CEMETERY_ZONE] = [];
    data[EXILE_ZONE] = [];
    data[REMOVAL_ZONE] = [];

    let oponentData: Dictionary<Item[] | []> = {};
    oponentData[DEFENSE_ZONE] =  [
        {
          id: 6,
          text: 'I 6',
        },
        {
          id:7,
          text: 'I 7',
        },
        {
          id: 8,
          text: 'I 8',
        },
        {
          id: 9,
          text: 'I 9',
        }
    ];
    oponentData[ATTACK_ZONE] = [];
    oponentData[CEMETERY_ZONE] = [];
    oponentData[EXILE_ZONE] = [];
    oponentData[REMOVAL_ZONE] = [];

    const [cards, setCards] = useState<Dictionary<Item[] | []>>(data);

    const [oponentsCards, setOponentsCards] = useState<Dictionary<Item[] | []>>(oponentData);
    
    const { socket } = useContext(SocketContext);

    useEffect(() => {

        socket?.emit('changing', cards);

    }, [cards, socket]);

    useEffect(() => {

        socket?.on('changing-oponent', (data) => {
            
            setOponentsCards(data);

        });
        
    }, [socket, setOponentsCards]);

    const isMobile = window.innerWidth < 600;

    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number, zoneName: string) => {

            const dragCard = cards[zoneName][dragIndex];

            if (!cards[zoneName][dragIndex]) { // Significa que quiere ordenar cards de distintas zonas
                return;
            }

            setCards((cards: Dictionary<Item[] | []>) => {
                let newCards = {...cards};

                newCards[zoneName] = update(cards[zoneName], {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragCard],
                    ],
                });

                return newCards;
            });


        },
        [cards],
    );

    const returnItemsForZone = (zoneName: string) => {

        return cards[zoneName]
            .map((card, index) => (
                <Card key={ card.id }
                    index={ index }
                    id={ card.id }
                    text={ card.text }
                    moveCard={(dragIndex, hoverIndex, zoneName) => moveCard(dragIndex, hoverIndex, zoneName)}
                    zone={ zoneName }
                    setCards={ setCards }

                />
            ))
    };

    const returnItemsForZoneOponent = (zoneName: string) => {

        return oponentsCards[zoneName]
            .map((card, index) => (
                <Card key={ card.id }
                    index={ index }
                    id={ card.id }
                    text={ card.text }
                    zone={ zoneName }

                />
            ))
    };

    return (
        <div className="container">
            {/* <Row>
                <Col span={ 21 }> 
                
                    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>

                        <Zone title={ CEMETERY_ZONE } className='zone stack'>
                            { returnItemsForZoneOponent(CEMETERY_ZONE) }
                        </Zone>

                        <Zone title={ DEFENSE_ZONE } className='zone'>
                            { returnItemsForZoneOponent(DEFENSE_ZONE) }
                        </Zone>

                         <Zone title={ ATTACK_ZONE } className='zone'>
                            { returnItemsForZoneOponent(ATTACK_ZONE) }
                        </Zone>

                    </DndProvider>
                </Col>

                <Col span={ 3 }> 
                    Acciones
                </Col>
            </Row>  */}

            <Divider>División</Divider>

            <Row>
                <Col span={ 21 }> 
                
                    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>

                        <Row>

                            <Col span={ 3 }> 
                                <div className="actions">
                                    <Tag color="green">{ cards[EXILE_ZONE].length }</Tag>
                                    <Button type="primary" size="small" icon={<EyeFilled />}></Button>
                                </div>
                                <Zone title={ EXILE_ZONE } className='zone stack'>
                                    { returnItemsForZone(EXILE_ZONE) }
                                </Zone>
                            </Col>

                            <Col span={ 3 }> 
                                <div className="actions">
                                    <Tag color="green">{ cards[REMOVAL_ZONE].length }</Tag>
                                    <Button type="primary" size="small" icon={<EyeFilled />}></Button>
                                </div>
                                <Zone title={ REMOVAL_ZONE } className='zone stack'>
                                    { returnItemsForZone(REMOVAL_ZONE) }
                                </Zone>
                            </Col>

                            <Col span={ 18 }> 
                                <Zone title={ ATTACK_ZONE } className='zone'>
                                    { returnItemsForZone(ATTACK_ZONE) }
                                </Zone> 
                            </Col>

                        </Row>

                        <Row>

                            <Col span={ 3 }> 
                                <div className="actions">
                                    <Tag color="green">{ cards[CEMETERY_ZONE].length }</Tag>
                                    <Button type="primary" size="small" icon={<EyeFilled />}></Button>
                                </div>
                                <Zone title={ CEMETERY_ZONE } className='zone stack'>
                                    { returnItemsForZone(CEMETERY_ZONE) }
                                </Zone>
                            </Col>

                            <Col span={ 3 }> 
                                Castillo
                            </Col>

                            <Col span={ 18 }> 
                                <Zone title={ DEFENSE_ZONE } className='zone'>
                                    { returnItemsForZone(DEFENSE_ZONE) }
                                </Zone>
                            </Col>

                        </Row>
                        
                        <Row>

                            <Col span={ 3 }> 
                                Oros sin pagar
                            </Col>

                            <Col span={ 3 }> 
                                Oros pagados
                            </Col>

                            <Col span={ 18 }> 
                                Totems
                            </Col>

                        </Row>  

                        <Row>
                            <Col offset={ 6 }>
                                Mano
                            </Col>
                        </Row>                     

                    </DndProvider>
                </Col>

                <Col span={ 3 }> 
                    Chat
                </Col>
            </Row> 
            
        </div>
    )
}

export default Match;