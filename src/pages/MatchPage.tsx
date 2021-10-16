import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import update from 'immutability-helper';
import { Col, Divider, Row, Tag, Modal, Space, Radio } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import Zone from '../components/match/Zone';
import Card from '../components/match/Card';
import { ZONE_NAMES } from "../constants";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { changeMatch } from '../store/match/action';
import usePrevious from '../hooks/usePrevious';

import '../css/match.css';
import { SocketContext } from '../context/SocketContext';
import useHideMenu from '../hooks/useHideMenu';
import { useLocation } from 'react-router';

export interface ICard {
    id: string;
    text: string;
    arms?: string[];
};

export type Dictionary<TValue> = {
    [id: string]: TValue;
};

export interface DragCard {
    index: number;
    id: string;
    zone: string;
    arms?: string[];
};

const MatchPage: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(true, path);

    const { DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE } = ZONE_NAMES;

    const dispatch = useDispatch();

    const { match } = useSelector((state: RootState) => state.match);


    const { online, socket } = useContext(SocketContext);


    let data: Dictionary<ICard[] | []> = {};
    data[HAND_ZONE] =  [
        {
          id: '1',
          text: 'I 1',
        },
        {
          id: '2',
          text: 'I 2',
        },
        {
          id: '3',
          text: 'Arma',
        },
        {
          id: '4',
          text: 'I 4',
        },
        {
          id: '5',
          text: 'I 5',
        },
        {
          id: '6',
          text: 'I 6',
        },
        {
          id: '7',
          text: 'I 7',
        },
        {
          id: '8',
          text: 'I 8',
        }
    ];
    data[ATTACK_ZONE] = [];
    data[CEMETERY_ZONE] = [];
    data[EXILE_ZONE] = [];
    data[DEFENSE_ZONE] = [];
    data[REMOVAL_ZONE] = [];    
    data[SUPPORT_ZONE] = [];    

    let oponentData: Dictionary<ICard[] | []> = {};
    oponentData[DEFENSE_ZONE] =  [
        {
          id: '6',
          text: 'I 6',
        },
        {
          id: '7',
          text: 'I 7',
        },
        {
          id: '8',
          text: 'I 8',
        },
        {
          id: '9',
          text: 'I 9',
        }
    ];
    oponentData[ATTACK_ZONE] = [];
    oponentData[CEMETERY_ZONE] = [];
    oponentData[EXILE_ZONE] = [];
    oponentData[HAND_ZONE] = [];
    oponentData[REMOVAL_ZONE] = [];
    oponentData[SUPPORT_ZONE] = [];

    const [oponentsCards, setOponentsCards] = useState<Dictionary<ICard[] | []>>(oponentData);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [armAllyId, setArmAllyId] = useState<string>('0');

    const isMobile = window.innerWidth < 600;

    useEffect(() => {
        dispatch(changeMatch(data));
        
    }, [dispatch]);

    useEffect(() => {

        socket?.emit('changing', match);

    }, [match, socket]);

    useEffect(() => {

        // socket?.on('changing-oponent', (data) => {
            
        //     setOponentsCards(data);

        // });
        
    }, [socket, setOponentsCards]);

    const prev = usePrevious(match[SUPPORT_ZONE]);

    useEffect(() => {
        
        if (prev && match[SUPPORT_ZONE]) {
            if (prev.length < match[SUPPORT_ZONE].length) {
                showModal();
            }
        }

        
        
    }, [match[SUPPORT_ZONE]]);

    

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
            .map((card, index) => (
                <Card 
                    key={ index }
                    index={ index }
                    moveCard={(dragIndex, hoverIndex, zoneName) => moveCard(dragIndex, hoverIndex, zoneName)}
                    zone={ zoneName }
                    { ...card }

                />
            ));
    };

    const showModal = () => {
        setIsModalVisible(true);
    };
    
    const handleOk = () => {
        const { id } = match[SUPPORT_ZONE][match[SUPPORT_ZONE].length - 1]; // id del arma

        if (id) {
            
            let newCards = { ...match };

            newCards[DEFENSE_ZONE] = newCards[DEFENSE_ZONE].map(card => {
                if (card.id === armAllyId) {
                    return {
                        ...card,
                        arms: card.arms ? [...card.arms, id] : [ id ]
                    }
                }

                return card;
                
            });

            newCards[ATTACK_ZONE] = newCards[ATTACK_ZONE].map(card => {
                if (card.id === armAllyId) {
                    return {
                        ...card,
                        arms: card.arms ? [...card.arms, id] : [ id ]
                    }
                }

                return card;
                
            });

            dispatch(changeMatch(newCards));

        }

        setIsModalVisible(false);
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // const returnItemsForZoneOponent = (zoneName: string) => {

    //     return oponentsCards[zoneName]
    //         .map((card, index) => (
    //             <Card key={ card.id }
    //                 index={ index }
    //                 id={ card.id }
    //                 text={ card.text }
    //                 zone={ zoneName }

    //             />
    //         ))
    // };
    //justify-content: center;
    //display: flex;
    

    const onChangeOptionModal = (e: any) => {
        setArmAllyId(e.target.value)
    };

    return (
        <>
            
            <Modal className="select-ally-arm" title="Seleccione el aliado que será portador de esta arma" visible={ isModalVisible } onOk={ handleOk } onCancel={ handleCancel }>
                <Radio.Group onChange={ onChangeOptionModal } value={ armAllyId }>
                    <Space direction="vertical">
                        {
                            (match[DEFENSE_ZONE] || match[ATTACK_ZONE]) && [...match[DEFENSE_ZONE], ...match[ATTACK_ZONE]].map(card => {
                                return (
                                    <Radio value={ card.id }>
                                        <div className='movable-item'  >
                                            { card.text }
                                        </div>
                                    </Radio>                                    
                                )
                            })
                        }
                    </Space>
                </Radio.Group>
            </Modal>
           
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
                                Castillo
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

                <Col span={ 3 }> 
                    Chat
                </Col>
            </Row> 
        </>
    )
}

export default MatchPage;