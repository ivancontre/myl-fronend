import React, { FC, useCallback, useContext, useEffect } from 'react'
import { Alert, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import update from 'immutability-helper';
import { ArrowDownOutlined } from '@ant-design/icons';

import { ZONE_NAMES } from "../../constants";
import { RootState } from '../../store';
import CardComponentContainer from './drag/CardComponentContainer';
import CardComponent from './drag/CardComponent';
import { setViewCardsDestiny, setViewCardsOrigin } from '../../store/match/action';
import { isTouchDevice } from '../../helpers/touch';
import { SocketContext } from '../../context/SocketContext';
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { Message } from '../../store/chat/types';
import { closeModalOpponentDiscard } from '../../store/ui-modal/action';

const { HAND_ZONE, CEMETERY_ZONE } = ZONE_NAMES;

const OpponentDiscard: FC = () => {

    const { viewCardsOrigin, viewCardsDestiny, matchId, opponentMatch } = useSelector((state: RootState) => state.match);

    const { socket } = useContext(SocketContext);

    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {

        if (opponentMatch[HAND_ZONE]) {
            dispatch(setViewCardsOrigin(opponentMatch[HAND_ZONE]));
    
            dispatch(setViewCardsDestiny([]));
        }        
        
    }, [dispatch, opponentMatch]);

    const { 
        modalOpenDiscardOpponent
    } = useSelector((state: RootState) => state.uiModal);

    const resetModal = () => {
        dispatch(closeModalOpponentDiscard());
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

        socket?.emit('personal-message', {
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
        sendMessage("Dejó de descartar al azar mano oponente");

    };

    const handleOkModal = () => {      
        
        if (!viewCardsDestiny.length) {
            sendMessage("No descartó alguna carta");
            return;
        }

        socket?.emit('discard-to-opponent', {
            matchId,
            toDiscard: viewCardsDestiny
        });

        const viewCardsDestinyName = viewCardsDestiny.map(card => `"${card.name}"`);

        sendMessage(`Descartó al oponente ${viewCardsDestinyName.length} carta(s) al azar: ${viewCardsDestinyName.join(', ')}`);

        resetModal();
        
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
                .map((card, index) => (
                    <CardComponent 
                        key={ index }
                        id={ card.id }
                        index={ index }
                        moveCard={(dragIndex, hoverIndex, zoneName, isOrigin) => moveCard(dragIndex, hoverIndex, zoneName, isOrigin)}
                        zone={ zoneName }
                        card={ card }
                        isOrigin={ isOrigin }
                        isPrivate
                        discard
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
                        isPrivate
                        discard
                    />
                ));
    };

    return (
        <Modal 
            width={ 1000 } 
            centered 
            title={`Descartando cartas oponentes al azar...`} 
            visible={ 
                modalOpenDiscardOpponent
            } 
            onCancel={ handleCancelModal } 
            onOk={ handleOkModal }
        >

            <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
                <CardComponentContainer title={ HAND_ZONE } >
                    { viewCardsOrigin && returnItemsForZoneOrigin(HAND_ZONE, true)}
                </CardComponentContainer>

                <Alert style={{marginBottom: 20}} message={`Arrastra las cartas hacia el recuadro de abajo`} type="info" showIcon icon={<ArrowDownOutlined />}/>

                <CardComponentContainer title={ CEMETERY_ZONE } >
                    { viewCardsDestiny && returnItemsForZoneDestiny(CEMETERY_ZONE, false)}
                </CardComponentContainer>

            </DndProvider>
            
        </Modal>
    )
}

export default OpponentDiscard;