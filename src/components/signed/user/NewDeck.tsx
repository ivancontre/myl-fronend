import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Button, Tooltip, Select, Divider, Row, Col, Alert, Tag, message, Input, Form } from 'antd';
import { useHistory, useParams } from 'react-router';
import { ArrowLeftOutlined, ArrowDownOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import NewDeckCardContainer from './NewDeckCardContainer';
import {  loadCardsByEdition, loadCardsMySelection, resetMySelection, startLoadCardByEdition } from '../../../store/card/action';
import NewDeckCard from './NewDeckCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import '../../../css/new-deck.css';
import { loadDeckUpdating, startAddNewDeck, startGetDeck, startLoadDeck, startUpdateDeck } from '../../../store/deck/action';
import { Card } from '../../../store/card/types';
import useHideMenu from '../../../hooks/useHideMenu';
import { MenuContext } from '../../../context/MenuContext';
import { isTouchDevice } from '../../../helpers/touch';

import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { RaceCard } from '../../../store/description/types';

interface FieldData {
    name: string | number | (string | number)[];
    value?: any;
};

const { Search } = Input;

const NewDeck: FC = () => {

    const history = useHistory();

    const params: any = useParams();

    const { collapsedMenu, showLoading, hideLoading } = useContext(MenuContext);
    useHideMenu(false, 'decks', collapsedMenu);

    const { cardsByEdition, selectMyCards } = useSelector((state: RootState) => state.cards);
    const { types, eras, editions } = useSelector((state: RootState) => state.description); 
    const { deckUpdating, decks } = useSelector((state: RootState) => state.decks); 

    const [typeId, setTypeId] = useState<string | undefined>(undefined);
    const [raceId, setRaceId] = useState<string | undefined>(undefined);
    const [editionId, setEditionId] = useState<string | undefined>(undefined);
    const [deckId, setDeckId] = useState<string | undefined>(undefined);

    const [search, setSearch] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');
    const [searchInMyCards, setSearchInMyCards] = useState<string>('');
    const [searchTextInMyCards, setSearchTextInMyCards] = useState<string>('');
    const [fields, setFields] = useState<FieldData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([])
    const [races, setRaces] = useState<RaceCard[]>([]);

    const [eraId, setEraId] = useState<string>('');

    const dispatch = useDispatch();

    useEffect(() => {
        async function getFromAPI() {
            await dispatch(startLoadDeck());
            await dispatch(loadDeckUpdating(params.id));
        }

        if (params.id && params.id !== 'undefined') {
            if (!decks) {
                getFromAPI();
            } else {
                dispatch(loadDeckUpdating(params.id));
            }
        }

    }, [params.id, dispatch, decks, decks?.length]);

    useEffect(() => {
        
        if (deckUpdating) {
            let fields = [{
                name: 'name',
                value: deckUpdating.name
            }];

            setFields(fields);
        } else {
            dispatch(resetMySelection());
        }

    }, [deckUpdating, dispatch]);

    useEffect(() => {
        if (deckUpdating?.cards) {
            dispatch(loadCardsMySelection(deckUpdating?.cards as Card[]));
        }

    }, [dispatch, deckUpdating?.cards]);

    const handleSelectEra = (eraId: string) => {
        setEraId(eraId);
        setRaceId(undefined);
        setEditionId(undefined);
        setDeckId(undefined)
        dispatch(loadCardsByEdition([]));
    };

    const handleSelectDeck = async (deckId: string) => {

        // if (selectMyCards.length) {
        //     message.warning('Si selecciona un mazo se eliminará las cartas seleccionadas')
        //     return;
        // }
        setLoading(true);

        setDeckId(deckId);
        dispatch(startGetDeck(deckId, showLoading, hideLoading))

        setLoading(false);
    }; 

    const handleSelectEdition = async (editionId: string) => {
        //setLoading(true);

        setRaceId(undefined);
        setDeckId(undefined);
        setEditionId(editionId);

        for (const edition of editions) {
            if (edition.id === editionId) {
                setRaces(edition.races);
                break;
            }
        }

        await dispatch(startLoadCardByEdition(editionId, showLoading, hideLoading));

        setLoading(false);
    };

    const getNameType = (id: string) => {
        const type = types.find(card => card.id === id);
        return type?.name;
    };

    const handleSelectType = (typeId: string) => {
        setTypeId(typeId);

        if (getNameType(typeId) !== 'Aliado') {
            setRaceId(undefined);
        }
       
    };

    const handleSelectRace = (raceId: string) => {
        setRaceId(raceId);
    };

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
            
            return cardsByEdition
                    .filter(card => {
                        return  (typeId !== undefined ? card.type === typeId : true) && 
                                (raceId !== undefined ? card.race === raceId : true) && 
                                (search ? card.name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search.toUpperCase()) > -1 : true) &&
                                (tags ? tags.every( tag => card.ability?.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(tag.toUpperCase())) : true)
                       
                    })
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
            
        return selectMyCards
            .filter(card => {
                return searchInMyCards ? card.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(searchInMyCards.toUpperCase()) > -1 : true;
            })
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
             
    };

    const confirm = (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
        dispatch(resetMySelection());
        history.push('/decks');
    };

    const handleOnFinish = async (values: any) => {

        if (selectMyCards.length > 50) {
            message.warning('El mazo debe tener 50 cartas')
            return;
        }

        let body: any = {
            name: values.name,
            cards: selectMyCards.map(card => card.id)
        };


        if (selectMyCards.length) {
            body.era = selectMyCards[0].era;
        }

        if (!deckUpdating || deckId) {
            
            await dispatch(startAddNewDeck(body, history, showLoading, hideLoading));
            
        } else {

            await dispatch(startUpdateDeck(deckUpdating.id as string, body, deckUpdating.byDefault, selectMyCards.length, showLoading, hideLoading));
            
        }

    };   

    const onChangeTags = (tags: string[]) => {
        setTags(tags);
    };

    const onSearch = (value: string) => {
        if (!value) {
            setSearch('');
            return;
        }

        setSearch(value);
    };

    const onSearchInMyCards = (value: string) => {
        if (!value) {
            setSearchInMyCards('');
            return;
        }

        setSearchInMyCards(value);
    };

    const onChangeSearchText = (event: any) => {
        if (event.target.value) {
            setSearchText(event.target.value as string)
        } else {
            setSearchText('');
            setSearch('');
        }
    };

    const onChangeSearchTextInMyCards = (event: any) => {
        if (event.target.value) {
            setSearchTextInMyCards(event.target.value as string)
        } else {
            setSearchTextInMyCards('');
            setSearchInMyCards('');
        }
    };

    return (
        <>
            <Row>
                <Col span={ 24 } >

                    <Tooltip title="Volver al listado">
                        <Button onClick={ confirm } type="primary" shape="circle" icon={<ArrowLeftOutlined />} />
                    </Tooltip>
                    
                </Col>
            </Row>

            {
                cardsByEdition.length === 0 && (
                    <Row gutter={[16, 16]} style={{ paddingTop: 10 }}>
                        <Col span={ 24 } >
                            <Alert message="Busque por era" type="info" showIcon icon={<ArrowDownOutlined />}  />
                        </Col>
                    </Row>
                )
            }  

            <Row gutter={[16, 16]} style={{ paddingTop: 10 }}>
                <Col span={ 24 } >
                    <Select
                        listHeight={300}
                        placeholder="Seleccione una era"
                        style={{ width: "100%" }}
                        onChange={ handleSelectEra }                    
                    >
                        {
                            eras.length > 0 && eras.map(era => (
                                <Select.Option key={ era.id } value={ era.id }>{ era.name }</Select.Option>
                            ))
                        }
                    </Select>
                </Col>
            </Row> 

            <Row gutter={[16, 16]} style={{ paddingTop: 10 }}>
                <Col span={ 12 } >
                    <Select
                        listHeight={300}
                        placeholder="Seleccione una edición"
                        style={{ width: "100%" }}
                        onChange={ handleSelectEdition }
                        value={ editionId }   
                        disabled={ !eraId }      
                        virtual={false}         
                    >
                        {
                            eras.find(era => era.id === eraId)?.editions.map(edition => (
                                <Select.Option key={ edition.id } value={ edition.id }>{ edition.name }</Select.Option>
                            ))
                        }
                    </Select>
                </Col>

                <Col span={ 12 } >
                    <Select
                        listHeight={300}
                        placeholder="Puedes seleccionar un mazo prediseñado"
                        style={{ width: "100%" }}
                        onChange={ handleSelectDeck }
                        value={ deckId }   
                        disabled={ !editionId }      
                        virtual={false}         
                    >
                        {
                            eras.find(era => era.id === eraId)?.editions.find(edition => edition.id === editionId)?.defaultDecks?.map(deck => (
                                <Select.Option key={ deck.id } value={ deck.id as string}>{ deck.name }</Select.Option>
                            ))
                        }
                    </Select>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ paddingTop: 10 }}>
                <Col span={ 12 } >
                    <Select
                        placeholder="Busque por un tipo de carta"
                        style={{ width: "100%" }}
                        onChange={ handleSelectType }
                        disabled={ !cardsByEdition.length }
                        value={ typeId }
                    >
                        {
                            types.length > 0 && types.map(type => (
                                <Select.Option key={ type.id } value={ type.id }>{ type.name }</Select.Option>
                            ))
                        }
                    </Select>
                </Col>
                <Col span={ 12 } >
                    <Select
                        placeholder="Busque por una raza de carta"
                        style={{ width: "100%" }}
                        onChange={ handleSelectRace }
                        disabled={ !cardsByEdition.length }
                        value={ raceId }
                        virtual={false}
                    >
                        {
                            races.length > 0 && races.map(race => (
                                <Select.Option key={ race.id } value={ race.id }>{ race.name }</Select.Option>
                            ))
                        }
                    </Select>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ paddingTop: 10 }}>
                <Col span={ 12 } >
                    <Search placeholder="Busque por nombre de carta" enterButton onSearch={ onSearch } disabled={ !cardsByEdition.length } value={ searchText } onChange={ onChangeSearchText }/>
                </Col>
                <Col span={ 12 } className={!cardsByEdition.length ? 'disabled': 'not-disabled'}>
                    <ReactTagInput 
                        placeholder="Escribe una palabra clave para buscar en la habilidad de la carta y luego presiona enter"
                        tags={tags} 
                        onChange={ onChangeTags }
                        />
                </Col>
            </Row>
            
            {
                cardsByEdition.length > 0 && (
                    <Row gutter={[16, 16]} style={{ paddingTop: 10 }}>
                        <Col span={ 24 } >
                            <Alert message="Arrastra las cartas de izquierda a derecha para agregarlas a tu mazo" type="info" showIcon/>
                        </Col>
                    </Row>
                )
            }
                       
            <Row style={{ paddingTop: 10 }}>
                <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
                    <Col className="container-deck" span={ 14 } >
                        <Tag className="tag-new-deck" color="gold">{`Total: ${cardsByEdition.length}`}</Tag>
                        <Tag className="tag-new-deck" color="green">{`Aliados: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Aliado')).length}`}</Tag>
                        <Tag className="tag-new-deck" color="green">{`Armas: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Arma')).length}`}</Tag>
                        <Tag className="tag-new-deck" color="green">{`Oros: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Oro')).length}`}</Tag>
                        <Tag className="tag-new-deck" color="green">{`Talismanes: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Talismán')).length}`}</Tag>                        
                        <Tag className="tag-new-deck" color="green">{`Tótems: ${(cardsByEdition.filter(card => getNameType(card.type) === 'Tótem')).length}`}</Tag>
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
                                        style={{width: '100%', paddingBottom: 10}}
                                        name="name" 
                                        rules={[{
                                            required: true,
                                            message: 'Por favor ingrese el nombre del mazo'
                                        }
                                    ]} >
                                        <Input placeholder="Ingrese nombre del Mazo" />
                                        
                                    </Form.Item>

                                    <Form.Item 
                                        style={{width: '100%'}}
                                    >
                                        <Button className="btn-save-deck" htmlType="submit" type="primary">{params.id ? 'Actualizar' : 'Guardar'}</Button>
                                    </Form.Item>

                                </Form>
                            </Col>
                        </Row>

                        <Row style={{ paddingTop: 10 }}>
                            <Col span={ 24 }>
                                <Tag className="tag-new-deck" color="gold">{`Total: ${selectMyCards.length}`}</Tag>
                                <Tag className="tag-new-deck" color="green">{`Aliados: ${(selectMyCards.filter(card => getNameType(card.type) === 'Aliado')).length}`}</Tag>
                                <Tag className="tag-new-deck" color="green">{`Armas: ${(selectMyCards.filter(card => getNameType(card.type) === 'Arma')).length}`}</Tag>
                                <Tag className="tag-new-deck" color="green">{`Oros: ${(selectMyCards.filter(card => getNameType(card.type) === 'Oro')).length}`}</Tag>
                                <Tag className="tag-new-deck" color="green">{`Talismanes: ${(selectMyCards.filter(card => getNameType(card.type) === 'Talismán')).length}`}</Tag>
                                <Tag className="tag-new-deck" color="green">{`Tótems: ${(selectMyCards.filter(card => getNameType(card.type) === 'Tótem')).length}`}</Tag>

                                <Divider />

                                <Search placeholder="Buscar por nombre de carta" className="search-my-cards" enterButton onSearch={ onSearchInMyCards } disabled={ !selectMyCards.length } value={ searchTextInMyCards } onChange={ onChangeSearchTextInMyCards } />

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