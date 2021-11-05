import React, { FC, useCallback, useEffect, useState } from 'react'
import { Alert, message, Modal, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import update from 'immutability-helper';

import { ZONE_NAMES } from "../../constants";
import { RootState } from '../../store';
import { Card } from '../../store/card/types';
import { closeModalViewCastle, closeModalViewCastleOpponent, closeModalViewCementery, closeModalViewCementeryOpponent, closeModalViewExile, closeModalViewExileOpponent, closeModalViewHandOpponent, closeModalViewRemoval, closeModalViewRemovalOpponent, closeModalViewXCastle } from '../../store/ui-modal/action';
import CardComponentContainer from './drag/CardComponentContainer';
import CardComponent from './drag/CardComponent';
import { changeMatch, setAmountCardsViewAction, setViewCardsDestiny, setViewCardsOrigin } from '../../store/match/action';
import { Dictionary } from '../../store/match/types';

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE, UNPAID_GOLD_ZONE, GOLDS_PAID_ZONE } = ZONE_NAMES;

interface ViewCastleModalProps {
    origin: Dictionary<Card[] | []>;
    zone: string;
    amount?: number;
    onlyRead?: boolean;
};

const ViewCardsModal: FC<ViewCastleModalProps> = ({ origin, zone, amount, onlyRead }) => {

    const { viewCardsOrigin, viewCardsDestiny } = useSelector((state: RootState) => state.match);

    const dispatch = useDispatch();

    useEffect(() => {

        if (amount) {
            dispatch(setViewCardsOrigin(origin[zone].slice(-amount)));
        } else {
            dispatch(setViewCardsOrigin(origin[zone]));
        }

        dispatch(setViewCardsDestiny([]));
        
        
    }, [dispatch, origin, zone, amount]);

    const { 
            modalOpenViewCastle, 
            modalOpenViewXcards, 
            modalOpenViewCastleToOpponent, 
            modalOpenViewCementery, 
            modalOpenViewExile, 
            modalOpenViewRemoval,
            modalOpenViewCementeryOpponent, 
            modalOpenViewExileOpponent, 
            modalOpenViewRemovalOpponent,
            modalOpenViewHandOpponent
    } = useSelector((state: RootState) => state.uiModal);

    const [optionSelect, setOptionSelect] = useState('');

    const resetModal = () => {
        dispatch(closeModalViewCastle());
        dispatch(closeModalViewXCastle());
        dispatch(closeModalViewCastleOpponent());
        dispatch(closeModalViewCementery());
        dispatch(closeModalViewExile());
        dispatch(closeModalViewRemoval());
        dispatch(closeModalViewCementeryOpponent());
        dispatch(closeModalViewExileOpponent());
        dispatch(closeModalViewRemovalOpponent());
        dispatch(closeModalViewHandOpponent());
        dispatch(setAmountCardsViewAction(1));
    };

    const handleCancelModal = () => {
        resetModal();
    };

    const handleOkModal = () => {

        if (onlyRead) {
            resetModal();            
            return;
        }

        const newMatch = { ...origin };

        newMatch[zone] = !amount ? viewCardsOrigin : [...origin[zone].filter((card: Card, index: number) => index < origin[zone].length - amount), ...viewCardsOrigin];
        
        if (optionSelect && viewCardsDestiny.length) {
            newMatch[optionSelect] = [...newMatch[optionSelect], ...viewCardsDestiny];
        }    

        dispatch(changeMatch(newMatch));
        resetModal();
    }

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

    const isMobile = window.innerWidth < 600;

    const returnItemsForZoneOrigin = (zoneName: string, isOrigin: boolean) => {
        return viewCardsOrigin
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
                modalOpenViewCementeryOpponent ||
                modalOpenViewExileOpponent ||
                modalOpenViewRemovalOpponent ||
                modalOpenViewHandOpponent
            } 
            onCancel={ handleCancelModal } 
            onOk={ handleOkModal }
        >
            <Alert style={{marginBottom: 20}} message={`Las cartas que están a la derecha son las primeras en el ${zone}`} type="info" showIcon/>

            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                <CardComponentContainer title={ zone } >
                    { viewCardsOrigin && returnItemsForZoneOrigin(zone, true)}
                </CardComponentContainer>

                {
                    !onlyRead && (
                        <Select
                            placeholder="Mover a"
                            style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                            onChange={ handleSelect }                      
                        >
                            <Select.Option key={ HAND_ZONE } value={ HAND_ZONE }>{ HAND_ZONE }</Select.Option>
                            <Select.Option key={ DEFENSE_ZONE } value={ DEFENSE_ZONE }>{ DEFENSE_ZONE }</Select.Option>
                            <Select.Option key={ ATTACK_ZONE } value={ ATTACK_ZONE }>{ ATTACK_ZONE }</Select.Option>
                            <Select.Option key={ GOLDS_PAID_ZONE } value={ GOLDS_PAID_ZONE }>{ GOLDS_PAID_ZONE }</Select.Option>  
                            <Select.Option key={ UNPAID_GOLD_ZONE } value={ UNPAID_GOLD_ZONE }>{ UNPAID_GOLD_ZONE }</Select.Option>  
                                
                        </Select>
                    )
                }
                { !onlyRead && optionSelect !== '' && (
                    <CardComponentContainer title={ optionSelect } >
                        { viewCardsDestiny && returnItemsForZoneDestiny(optionSelect, false)}
                    </CardComponentContainer>
                )}

            </DndProvider>
            
        </Modal>
    )
}

export default ViewCardsModal;