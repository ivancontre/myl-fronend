import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Tooltip, Select, Divider, Row, Col, Alert, Tag, message, Input, Form, Popconfirm } from 'antd';
import { useHistory, useParams } from 'react-router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import NewDeckCardContainer from './NewDeckCardContainer';
import {  loadCardsMySelection, resetMySelection, startLoadCardByEdition } from '../../../store/card/action';
import NewDeckCard from './NewDeckCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import '../../../css/new-deck.css';
import { loadDeckUpdating, startAddNewDeck, startLoadDeck, startUpdateDeck } from '../../../store/deck/action';
import { Card } from '../../../store/card/types';

interface FieldData {
    name: string | number | (string | number)[];
    value?: any;
};

const NewDeck: FC = () => {

    const history = useHistory();

    const params: any = useParams();

    const { cardsByEdition, selectMyCards } = useSelector((state: RootState) => state.cards);
    const { types, editions } = useSelector((state: RootState) => state.description); 
    const { deckUpdating, decks } = useSelector((state: RootState) => state.decks); 

    const [typeId, setTypeId] = useState<string>('all');
    const [fields, setFields] = useState<FieldData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSave, setLoadingSave] = useState<boolean>(false);

    const dispatch = useDispatch();

    useEffect(() => {
        async function getFromAPI() {
            await dispatch(startLoadDeck());
            await dispatch(loadDeckUpdating(params.id));
        }

        if (params.id && params.id !== 'undefined') {
            if (decks.length === 0) {
                getFromAPI();
            } else {
                dispatch(loadDeckUpdating(params.id));
            }
        }

    }, [params.id, dispatch, decks.length]);

    useEffect(() => {
        
        if (deckUpdating) {
            let fields = [{
                name: 'name',
                value: deckUpdating.name
            }];

            setFields(fields);
        }

    }, [deckUpdating]);

    const handleSelectEdition = async (editionId: string) => {
        setLoading(true);
        await dispatch(startLoadCardByEdition(editionId));
        setLoading(false)
    };

    const handleSelectType = (typeId: string) => {
        setTypeId(typeId);
    };

    useEffect(() => {
        if (deckUpdating?.cards) {
            dispatch(loadCardsMySelection(deckUpdating?.cards as Card[]));
        }

    }, [dispatch, deckUpdating?.cards])

    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number, zoneName: string) => {

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
        [selectMyCards, dispatch],
    );

    const returnItemsForZone = (zoneName: string) => {

        if (zoneName === 'cards') {
            
            if (typeId !== 'all') {
                return cardsByEdition
                    .filter(card => card.type === typeId)
                    .map((card, index) => {
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
                    });
            } else {
                return cardsByEdition
                    .map((card, index) => {
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
                    });
            }

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

    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           ((navigator as any).msMaxTouchPoints > 0));
    };

    const handleOnFinish = async (values: any) => {

        if (selectMyCards.length < 50) {
            message.warning('El mazo debe tener 50 cartas')
            return;
        }

        const body = {
            name: values.name,
            cards: selectMyCards.map(card => card.id)
        };

        setLoadingSave(true);

        if (!deckUpdating) {
            await dispatch(startAddNewDeck(body));
        } else {
            await dispatch(startUpdateDeck(deckUpdating.id as string, body));
        }

        setLoadingSave(false);

    }

    const confirm = (e: any) => {
        dispatch(resetMySelection());
        history.push('/decks');
    };
      
    const cancel = (e: any) => {};      

    return (
        <>
            <Row>
                <Col span={ 24 } >

                    { selectMyCards.length > 0 ? (
                        <Popconfirm
                            title="Si vuelve al listado perderá todos los datos no guardados. ¿Volver al listado?"
                            okText="Sí"
                            placement="right"
                            onConfirm={confirm}
                            onCancel={cancel}
                            cancelText="No"
                        >
                            <Tooltip className="actions" title="Volver al listado">
                                <Button type="primary" shape="circle" icon={<ArrowLeftOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    ) : (
                        <Tooltip className="actions" title="Volver al listado">
                            <Button onClick={ confirm } type="primary" shape="circle" icon={<ArrowLeftOutlined />} />
                        </Tooltip>
                    )}
                    
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
                        disabled={ !cardsByEdition.length } 
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
                <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
                    <Col className="container-deck" span={ 14 } >
                    <Tag color="gold">{`Total: ${cardsByEdition.length}`}</Tag>
                        <Tag color="green">{`Aliados: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Aliado')).length}`}</Tag>
                        <Tag color="green">{`Armas: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Arma')).length}`}</Tag>
                        <Tag color="green">{`Oros: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Oro')).length}`}</Tag>
                        <Tag color="green">{`Talismanes: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Talismán')).length}`}</Tag>                        
                        <Tag color="green">{`Tótems: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Tótem')).length}`}</Tag>
                        <Divider />

                        {
                            loading ? (<span>Cargando cartas...</span>) : (<NewDeckCardContainer title="cards" >
                                { cardsByEdition && returnItemsForZone('cards') }
                            </NewDeckCardContainer>)
                        }

                    </Col>

                    <Col className="container-deck" offset={ 1 } span={ 9 }>
                        <Row style={{ paddingTop: 10 }}>
                            <Col span={ 24 }>
                                <Form
                                    layout="inline"
                                    autoComplete="off"
                                    onFinish={ handleOnFinish }
                                    fields={ fields }
                                >
                                    <Form.Item
                                        name="name" 
                                        rules={[{
                                            required: true,
                                            message: 'Por favor ingrese el nombre del mazo'
                                        }
                                    ]} >
                                        <Input placeholder="Ingrese nombre del Mazo" />
                                    </Form.Item>

                                    <Form.Item >
                                        <Button loading={ loadingSave } htmlType="submit" type="primary">{params.id ? 'Actualizar' : 'Guardar'}</Button>
                                    </Form.Item>

                                </Form>
                            </Col>
                        </Row>

                        <Row style={{ paddingTop: 10 }}>
                            <Col span={ 24 }>
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
                        </Row>
                        
                    </Col>
                </DndProvider>   
            </Row>
        </>
    )
}

export default NewDeck;