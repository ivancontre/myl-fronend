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
import { closeModalViewCastle, closeModalViewXCastle } from '../../store/ui-modal/action';
import CardComponentContainer from './drag/CardComponentContainer';
import CardComponent from './drag/CardComponent';
import { changeMatch, setAmountCardsViewAction, setViewCardsDestiny, setViewCardsOrigin } from '../../store/match/action';

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE } = ZONE_NAMES;

interface ViewCastleModalProps {
    zone: string;
    amount?: number;
    onlyRead?: boolean;
};

const ViewCardsModal: FC<ViewCastleModalProps> = ({ zone, amount, onlyRead }) => {

    const { match, viewCardsOrigin, viewCardsDestiny } = useSelector((state: RootState) => state.match);

    const dispatch = useDispatch();

    useEffect(() => {

        if (amount) {
            dispatch(setViewCardsOrigin(match[zone].slice(-amount)));
        } else {
            dispatch(setViewCardsOrigin(match[zone]));
        }
        
    }, [dispatch, match, zone, amount]);

    const { modalOpenViewCastle, modalOpenViewXcards } = useSelector((state: RootState) => state.uiModal);

    const [optionSelect, setOptionSelect] = useState('');

    const handleCancelModal = () => {
        dispatch(closeModalViewCastle());
        dispatch(closeModalViewXCastle());
        dispatch(setAmountCardsViewAction(1))
    };

    const handleOkModal = () => {

        if (onlyRead) {
            dispatch(closeModalViewCastle());
            dispatch(closeModalViewXCastle());
            dispatch(setAmountCardsViewAction(1));
            return;
        }

        const newMatch = { ...match };

        newMatch[zone] = !amount ? viewCardsOrigin : [...match[zone].filter((card: Card, index: number) => index < match[zone].length - amount), ...viewCardsOrigin];
        
        if (optionSelect && viewCardsDestiny.length) {
            newMatch[optionSelect] = viewCardsDestiny;
        }    

        dispatch(changeMatch(newMatch));
        dispatch(closeModalViewCastle());
        dispatch(closeModalViewXCastle());
        dispatch(setAmountCardsViewAction(1))
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
        <Modal width={ 1000 } centered title={`Viendo ${zone}...`} visible={ modalOpenViewCastle || modalOpenViewXcards } onCancel={ handleCancelModal } onOk={ handleOkModal }>
            <Alert style={{marginBottom: 20}} message="Las cartas que están a la derecha son las primeras en el Castillo" type="info" showIcon/>

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
                            <Select.Option key={ HAND_ZONE } value={ HAND_ZONE }>Mi { HAND_ZONE }</Select.Option>      
                                
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