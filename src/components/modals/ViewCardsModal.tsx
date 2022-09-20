import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import { Alert, Modal, Select, Space, Radio, Input, RadioChangeEvent } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import update from 'immutability-helper';
import { ArrowDownOutlined } from '@ant-design/icons';

import { ZONE_NAMES } from "../../constants";
import { RootState } from '../../store';
import { Card } from '../../store/card/types';
import { closeModalViewAuxiliary, closeModalViewAuxiliaryOpponent, closeModalViewCastle, closeModalViewCastleOpponent, closeModalViewCementery, closeModalViewCementeryOpponent, closeModalViewExile, closeModalViewExileOpponent, closeModalViewHandOpponent, closeModalViewRemoval, closeModalViewRemovalOpponent, closeModalViewXCastle, closeModalViewXCastleOpponent } from '../../store/ui-modal/action';
import CardComponentContainer from './drag/CardComponentContainer';
import CardComponent from './drag/CardComponent';
import { changeMatch, setAmountCardsViewAction, setViewCardsDestiny, setViewCardsOrigin } from '../../store/match/action';
import { Dictionary } from '../../store/match/types';
import { isTouchDevice } from '../../helpers/touch';
import { SocketContext } from '../../context/SocketContext';
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { Message } from '../../store/chat/types';
import { shuffle } from '../../helpers/shuffle';
const { Search } = Input;

const { DEFENSE_ZONE, ATTACK_ZONE, HAND_ZONE, UNPAID_GOLD_ZONE, GOLDS_PAID_ZONE, AUXILIARY_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, CASTLE_ZONE } = ZONE_NAMES;

interface ViewCastleModalProps {
    origin: Dictionary<Card[] | []>;
    zone: string;
    amount?: number;
    onlyRead?: boolean;
    isOpponent?: boolean;
};

const ViewCardsModal: FC<ViewCastleModalProps> = ({ origin, zone, amount, onlyRead, isOpponent }) => {

    const { viewCardsOrigin, viewCardsDestiny, matchId } = useSelector((state: RootState) => state.match);

    const { socket } = useContext(SocketContext);
    const [search, setSearch] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');

    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    const [option, setOption] = useState('SHUFFLE');

    useEffect(() => {

        if (origin[zone]) {
            if (amount) {
                dispatch(setViewCardsOrigin(origin[zone].slice(-amount)));
            } else {
                dispatch(setViewCardsOrigin(origin[zone]));
            }
    
            dispatch(setViewCardsDestiny([]));
        }
        
        
        
    }, [dispatch, origin, zone, amount]);

    const onSearch = (value: string) => {
        if (!value) {
            setSearch('');
            return;
        }

        setSearch(value);
    };

    const onChangeSearchText = (event: any) => {
        if (event.target.value) {
            setSearchText(event.target.value as string)
        } else {
            setSearchText('');
            setSearch('');
        }
    };

    const { 
            modalOpenViewCastle, 
            modalOpenViewXcards, 
            modalOpenViewCastleToOpponent, 
            modalOpenViewCementery, 
            modalOpenViewExile, 
            modalOpenViewRemoval,
            modalOpenViewAuxiliary,
            modalOpenViewCementeryOpponent, 
            modalOpenViewExileOpponent, 
            modalOpenViewRemovalOpponent,
            modalOpenViewAuxiliaryOpponent,
            modalOpenViewHandOpponent,
            modalOpenXViewCastleToOpponent
    } = useSelector((state: RootState) => state.uiModal);

    const [optionSelect, setOptionSelect] = useState('');

    const resetModal = () => {
        dispatch(closeModalViewCastle());
        dispatch(closeModalViewXCastle());
        dispatch(closeModalViewCastleOpponent());
        dispatch(closeModalViewXCastleOpponent());
        dispatch(closeModalViewCementery());
        dispatch(closeModalViewExile());
        dispatch(closeModalViewRemoval());
        dispatch(closeModalViewAuxiliary());

        dispatch(closeModalViewCementeryOpponent());
        dispatch(closeModalViewExileOpponent());
        dispatch(closeModalViewRemovalOpponent());
        dispatch(closeModalViewAuxiliaryOpponent());
        dispatch(closeModalViewHandOpponent());
        dispatch(setAmountCardsViewAction(1));
    };

    const onChangeZone = (e: RadioChangeEvent) => {
        setOption(e.target.value);
    };

    const sendMessage = (text: string) => {

        for (let [, value] of Object.entries(ZONE_NAMES)) {
            if (text.includes('"' + value + '"')) {
                text = text.replace('"' + value + '"', '<strong>' + value + '</strong>');
            } 
        }

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text,
            isAction: true
        };

        socket?.emit( 'personal-message', {
            matchId,
            message: newMessage
        }, (data: any) => {
            newMessage.date = data;
            dispatch(addMessageAction(newMessage));
            scrollToBottom('messages');
        });

    };

    const handleCancelModal = () => {
        
        resetModal();
        sendMessage(!onlyRead ? `Dejó de ver "${zone}"` : `Dejó de ver "${zone}" oponente`);

    };

    const handleOkModal = () => {

        if (onlyRead) {
            resetModal();
            sendMessage(`Dejó de ver "${zone}" oponente`);
            return;
        }

        let newMatch = { ...origin };

        newMatch[zone] = !amount ? viewCardsOrigin : [...origin[zone].filter((card: Card, index: number) => index < origin[zone].length - amount), ...viewCardsOrigin];        
        
        if (optionSelect && viewCardsDestiny.length) {            

            if (optionSelect !== CASTLE_ZONE) {
                newMatch[optionSelect] = [...newMatch[optionSelect], ...viewCardsDestiny];
                sendMessage(`Moviendo "${viewCardsDestiny.length}" carta(s) de "${zone}" a "${optionSelect}"`);

            } else {

                if (option === 'SHUFFLE') {

                    newMatch[optionSelect] = [...newMatch[optionSelect], ...viewCardsDestiny];
                    newMatch = shuffle({ ...newMatch }, CASTLE_ZONE);
                    sendMessage(`Moviendo y barajando "${viewCardsDestiny.length}" carta(s) de "${zone}" a "${optionSelect}"`);

                } else if (option === 'START') {
                    newMatch[optionSelect] = [...newMatch[optionSelect], ...viewCardsDestiny];
                    sendMessage(`Moviendo "${viewCardsDestiny.length}" carta(s) de "${zone}" al principio de "${optionSelect}"`);
                } else {
                    newMatch[optionSelect] = [...viewCardsDestiny, ...newMatch[optionSelect]];
                    sendMessage(`Moviendo "${viewCardsDestiny.length}" carta(s) de "${zone}" al final de "${optionSelect}"`);
                }                

            }

        }

        dispatch(changeMatch(newMatch));
        resetModal();

        sendMessage(`Dejó de ver "${zone}"`);
        
    };

    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number, zoneName: string, isOrigin: boolean) => {

            if (isOrigin && !viewCardsOrigin[dragIndex]) {
                return;
            }

            if (!isOrigin && !viewCardsDestiny[dragIndex]) {
                return;
            }

            const dragCard = isOrigin ? viewCardsOrigin[dragIndex] : viewCardsDestiny[dragIndex];

            let zoneToOrder = isOrigin ? viewCardsOrigin : viewCardsDestiny;

            zoneToOrder = update(zoneToOrder, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            });

            isOrigin ? dispatch(setViewCardsOrigin(zoneToOrder)) : dispatch(setViewCardsDestiny(zoneToOrder));

        },
        [viewCardsOrigin, viewCardsDestiny, dispatch],
    );

    const returnItemsForZoneOrigin = (zoneName: string, isOrigin: boolean) => {
        return viewCardsOrigin
                .filter(card => {
                    return (search ? card.name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search.toUpperCase()) > -1 : true)
                
                })
                .map((card, index) => (
                    <CardComponent 
                        key={ index }
                        id={ card.id }
                        index={ index }
                        moveCard={(dragIndex, hoverIndex, zoneName, isOrigin) => moveCard(dragIndex, hoverIndex, zoneName, isOrigin)}
                        zone={ zoneName }
                        card={ card }
                        isOrigin={ isOrigin }
                        onlyRead={ onlyRead as boolean}
                    />
                ));
    };

    const returnItemsForZoneDestiny = (zoneName: string, isOrigin: boolean) => {
        return viewCardsDestiny
                .map((card, index) => (
                    <CardComponent 
                        key={ index }
                        id={ card.id }
                        index={ index }
                        moveCard={(dragIndex, hoverIndex, zoneName, isOrigin) => moveCard(dragIndex, hoverIndex, zoneName, isOrigin)}
                        zone={ zoneName }
                        card={ card }
                        isOrigin={ isOrigin }
                    />
                ));
    };

    const handleSelect = (value: string) => {
        setOptionSelect(value);
    };

    return (
        <Modal 
            width={ 1000 } 
            centered 
            title={`Viendo ${zone}...`} 
            visible={ 
                modalOpenViewCastle ||
                modalOpenViewXcards || 
                modalOpenViewCastleToOpponent || 
                modalOpenViewCementery ||
                modalOpenViewExile ||
                modalOpenViewRemoval ||
                modalOpenViewAuxiliary ||
                modalOpenViewCementeryOpponent ||
                modalOpenViewExileOpponent ||
                modalOpenViewRemovalOpponent ||
                modalOpenViewAuxiliaryOpponent ||
                modalOpenViewHandOpponent ||
                modalOpenXViewCastleToOpponent
            } 
            onCancel={ handleCancelModal } 
            onOk={ handleOkModal }
        >
            <Alert style={{marginBottom: 20}} message={`Las cartas que están a la derecha son las primeras en el ${zone}`} type="info" showIcon/>
            <Search style={{marginBottom: 20}} placeholder="Busque por nombre de carta" enterButton onSearch={ onSearch } disabled={ !viewCardsOrigin.length } value={ searchText } onChange={ onChangeSearchText }/>

            <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
                <CardComponentContainer title={ zone } >
                    { viewCardsOrigin && returnItemsForZoneOrigin(zone, true)}
                </CardComponentContainer>

                {
                    !onlyRead && (
                        <Select
                            virtual={false}
                            placeholder="Mover a..."
                            style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                            onChange={ handleSelect }                      
                        >
                            { zone !== CASTLE_ZONE && (<Select.Option key={ CASTLE_ZONE } value={ CASTLE_ZONE }>{ CASTLE_ZONE }</Select.Option>  )}
                            { zone !== CEMETERY_ZONE && (<Select.Option key={ CEMETERY_ZONE } value={ CEMETERY_ZONE }>{ CEMETERY_ZONE }</Select.Option> )} 
                            { zone !== EXILE_ZONE && (<Select.Option key={ EXILE_ZONE } value={ EXILE_ZONE }>{ EXILE_ZONE }</Select.Option>  )} 
                            { zone !== REMOVAL_ZONE && (<Select.Option key={ REMOVAL_ZONE } value={ REMOVAL_ZONE }>{ REMOVAL_ZONE }</Select.Option>  )} 

                            <Select.Option key={ HAND_ZONE } value={ HAND_ZONE }>{ HAND_ZONE }</Select.Option>
                            <Select.Option key={ DEFENSE_ZONE } value={ DEFENSE_ZONE }>{ DEFENSE_ZONE }</Select.Option>
                            <Select.Option key={ ATTACK_ZONE } value={ ATTACK_ZONE }>{ ATTACK_ZONE }</Select.Option>
                            <Select.Option key={ GOLDS_PAID_ZONE } value={ GOLDS_PAID_ZONE }>{ GOLDS_PAID_ZONE }</Select.Option>  
                            <Select.Option key={ UNPAID_GOLD_ZONE } value={ UNPAID_GOLD_ZONE }>{ UNPAID_GOLD_ZONE }</Select.Option>
                            { zone !== AUXILIARY_ZONE && (<Select.Option key={ AUXILIARY_ZONE } value={ AUXILIARY_ZONE }>{ AUXILIARY_ZONE }</Select.Option>  )}
                                
                        </Select>
                    )
                }
                {
                    !onlyRead && optionSelect !== '' && (
                        <Alert style={{marginBottom: 20}} message={`Arrastra las cartas hacia el recuadro de abajo`} type="info" showIcon icon={<ArrowDownOutlined />}/>
                    )
                }
                { 
                    !onlyRead && optionSelect !== '' && (
                        <CardComponentContainer title={ optionSelect } >
                            { viewCardsDestiny && returnItemsForZoneDestiny(optionSelect, false)}
                        </CardComponentContainer>
                    )
                }

                {
                    !onlyRead && optionSelect === CASTLE_ZONE && viewCardsDestiny.length > 0 && (
                        <Radio.Group value={ option } onChange={ onChangeZone } style={{marginTop: 20}}>
                            <Space direction="vertical">
                                <Radio value={ 'SHUFFLE' }>{`Barajar en el ${CASTLE_ZONE}`}</Radio>
                                <Radio value={ 'START' }>{`Poner al principio del ${CASTLE_ZONE}`}</Radio>
                                <Radio value={ 'END' }>{`Poner al final del ${CASTLE_ZONE}`}</Radio>
                            </Space>
                        </Radio.Group>
                    )
                }

            </DndProvider>
            
        </Modal>
    )
}

export default ViewCardsModal;