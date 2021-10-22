import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Tooltip, Select, Divider, Row, Col, Alert, Tag, message } from 'antd';
import { useHistory } from 'react-router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import NewDeckCardContainer from './NewDeckCardContainer';
import { loadCardsByEdition, loadCardsMySelection, startLoadCardByEdition } from '../../../store/card/action';
import NewDeckCard from './NewDeckCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import '../../../css/new-deck.css';

const NewDeck: FC = () => {

    const history = useHistory();

    const { cardsByEdition, selectMyCards } = useSelector((state: RootState) => state.cards);
    const { types, frecuencies, editions, races } = useSelector((state: RootState) => state.description); 

    const [typeId, setTypeId] = useState<string>('all');

    const dispatch = useDispatch();

    const back = () => {
        history.push('/decks');
    };

    const handleSelectEdition = (editionId: string) => {
        dispatch(startLoadCardByEdition(editionId))
    };

    const handleSelectType = (typeId: string) => {
        setTypeId(typeId);
    };

    useEffect(() => {
        if (selectMyCards.length >= 50) {            
            message.warning('No puede agregar más de 50 cartas');
        }

    }, [selectMyCards.length])

    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number, zoneName: string) => {
            console.log(zoneName)
            let list;

            if (zoneName === 'cards') {
                return;
            }

            const dragCard = selectMyCards[dragIndex];
    
            const newList = update(selectMyCards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            });
            
            dispatch(loadCardsMySelection(newList));
            
        },
        [cardsByEdition, selectMyCards, dispatch],
    );

    const returnItemsForZone = (zoneName: string) => {

        if (zoneName === 'cards') {
            
            if (typeId !== 'all') {
                return cardsByEdition
                    .map((card, index) => {
                        if (card.type === typeId) {
                            return (
                                <NewDeckCard 
                                    key={ index }
                                    id={ card.id }
                                    index={ index }
                                    moveCard={(dragIndex, hoverIndex, zoneName) => moveCard(dragIndex, hoverIndex, zoneName)}
                                    zone={ zoneName }
                                    card={ card }
                                />
                            )
                        }
                    });
            }

            return cardsByEdition
                .map((card, index) => (
                    <NewDeckCard 
                        key={ index }
                        id={ card.id }
                        index={ index }
                        moveCard={(dragIndex, hoverIndex, zoneName) => moveCard(dragIndex, hoverIndex, zoneName)}
                        zone={ zoneName }
                        card={ card }
                    />
                ));

        } else {
            return selectMyCards
                .map((card, index) => (
                    <NewDeckCard 
                        key={ index }
                        id={ card.id }
                        index={ index }
                        moveCard={(dragIndex, hoverIndex, zoneName) => moveCard(dragIndex, hoverIndex, zoneName)}
                        zone={ zoneName }
                        card={ card }
                    />
                ));
        }        
    };

    const getNameType = (id: string) => {
        const type = types.find(card => card.id === id);
        return type?.name;
    };

    const isMobile = window.innerWidth < 600;

    return (
        <>
            <Row>
                <Col span={ 24 } >
                    <Tooltip className="actions" title="Volver al listado">
                        <Button onClick={ back } type="primary" shape="circle" icon={<ArrowLeftOutlined />} />
                    </Tooltip>
                </Col>
            </Row>
            

            <Row gutter={[16, 16]} style={{ paddingTop: 10 }}>
                <Col span={ 24 } >
                    <Select
                        placeholder="Seleccione una edición"
                        style={{ width: "100%" }}
                        onChange={ handleSelectEdition }                    
                    >
                        {
                            editions.length > 0 && editions.map(edition => (
                                <Select.Option key={ edition.id } value={ edition.id }>{ edition.name }</Select.Option>
                            ))
                        }
                    </Select>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ paddingTop: 10 }}>
                <Col span={ 24 } >
                    <Select
                        placeholder="Seleccione un tipo"
                        style={{ width: "100%" }}
                        onChange={ handleSelectType }                    
                    >
                        <Select.Option key="0" value="all">Todos</Select.Option>
                        {
                            types.length > 0 && types.map(type => (
                                <Select.Option key={ type.id } value={ type.id }>{ type.name }</Select.Option>
                            ))
                        }
                    </Select>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ paddingTop: 10 }}>
                <Col span={ 24 } >
                    <Alert message="Arrastra las cartas de izquierda a derecha para agregarlas a tu mazo" type="info" showIcon/>
                </Col>
            </Row>

            <Row style={{ paddingTop: 10 }}>
                <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                    <Col className="container-deck" span={ 14 } >
                    <Tag color="gold">{`Total: ${cardsByEdition.length}`}</Tag>
                        <Tag color="green">{`Aliados: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Aliado')).length}`}</Tag>
                        <Tag color="green">{`Armas: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Arma')).length}`}</Tag>
                        <Tag color="green">{`Oros: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Oro')).length}`}</Tag>
                        <Tag color="green">{`Talismanes: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Talismán')).length}`}</Tag>                        
                        <Tag color="green">{`Tótems: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Tótem')).length}`}</Tag>
                        <Divider />
                        {cardsByEdition.length > 0 && (
                            <NewDeckCardContainer title="cards" >
                                { cardsByEdition && returnItemsForZone('cards')}
                            </NewDeckCardContainer>
                        )}
                    </Col>

                    <Col className="container-deck" offset={ 1 } span={ 9 }>
                        <Tag color="gold">{`Total: ${selectMyCards.length}`}</Tag>
                        <Tag color="green">{`Aliados: ${(selectMyCards.filter(card => getNameType(card.type) === 'Aliado')).length}`}</Tag>
                        <Tag color="green">{`Armas: ${(selectMyCards.filter(card => getNameType(card.type) === 'Arma')).length}`}</Tag>
                        <Tag color="green">{`Oros: ${(selectMyCards.filter(card => getNameType(card.type) === 'Oro')).length}`}</Tag>
                        <Tag color="green">{`Talismanes: ${(selectMyCards.filter(card => getNameType(card.type) === 'Talismán')).length}`}</Tag>
                        <Tag color="green">{`Tótems: ${(selectMyCards.filter(card => getNameType(card.type) === 'Tótem')).length}`}</Tag>
                        <Divider />
                        <NewDeckCardContainer title="my-cards" >
                            { selectMyCards && returnItemsForZone('my-cards')}
                        </NewDeckCardContainer> 
                    </Col>
                </DndProvider>   
            </Row>
        </>
    )
}

export default NewDeck;