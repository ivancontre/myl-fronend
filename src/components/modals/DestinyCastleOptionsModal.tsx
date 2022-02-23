import { Modal, Space, Radio, RadioChangeEvent } from 'antd';
import React, { FC, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ZONE_NAMES } from "../../constants";
import { SocketContext } from '../../context/SocketContext';
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { Message } from '../../store/chat/types';
import { changeMatch, changOpponenteMatch, setCardToMoveAction } from '../../store/match/action';
import { closeModalDestinyCastleOptions } from '../../store/ui-modal/action';
import { shuffle } from '../../helpers/shuffle';
import { Card } from '../../store/card/types';
import { processArm, processArmsFromBearer } from '../../helpers/moveCards';

const { CASTLE_ZONE } = ZONE_NAMES;

const DestinyCastleOptionsModal: FC = () => {

    const { match, opponentMatch, matchId, cardToMove } = useSelector((state: RootState) => state.match);

    const { modalDestinyCastleOptions } = useSelector((state: RootState) => state.uiModal);

    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);

    const [option, setOption] = useState('SHUFFLE');

    const { socket } = useContext(SocketContext);

    const { card, fromZone, index } = cardToMove; 

    const dispatch = useDispatch();

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

    const handleOkModal = () => {

        const newCards = { ...match };
        const newCardsOpponent = { ...opponentMatch };
        let haveOpponentArm = false;

        switch (option) {
            case 'SHUFFLE':
                
                // si tiene armas, puede tener armas mías o armas asignadas por el oponente
                if (card.armsId) {
                    haveOpponentArm = processArmsFromBearer(card, newCards, newCardsOpponent, CASTLE_ZONE, myUserId as string, 'SHUFFLE', sendMessage);    
                    delete card.armsId;
                }

                if (card.bearerId) {
                    // Al portador se le debe quitar esta arma
                    processArm(card, newCards);
                    delete card.bearerId;
                }

                newCards[fromZone] = newCards[fromZone].filter((card: Card, index2: number) => index2 !== index);
                newCards[CASTLE_ZONE] = [...newCards[CASTLE_ZONE], card];

                sendMessage(`Moviendo y barajando "${card.name}" de "${fromZone}" a "${CASTLE_ZONE}"`);
                const newMatch = shuffle({ ...newCards }, CASTLE_ZONE);
                dispatch(changeMatch(newMatch));

                if (haveOpponentArm) {
                    const newMatchOpponent = shuffle({ ...newCardsOpponent }, CASTLE_ZONE);
                    dispatch(changOpponenteMatch(newMatchOpponent));
                    socket?.emit('update-match-opponent', {
                        match: newMatchOpponent,
                        matchId
                    });
                }
                
                break;

            case 'START':

                // si tiene armas, puede tener armas mías o armas asignadas por el oponente
                if (card.armsId) {
                    haveOpponentArm = processArmsFromBearer(card, newCards, newCardsOpponent, CASTLE_ZONE, myUserId as string, 'START', sendMessage);    
                    delete card.armsId;
                }

                if (card.bearerId) {
                    // Al portador se le debe quitar esta arma
                    processArm(card, newCards);
                    delete card.bearerId;
                }

                newCards[fromZone] = newCards[fromZone].filter((card: Card, index2: number) => index2 !== index);
                newCards[CASTLE_ZONE] = [...newCards[CASTLE_ZONE], card];

                sendMessage(`Moviendo "${card.name}" de "${fromZone}" al principio de "${CASTLE_ZONE}"`);
                dispatch(changeMatch(newCards));

                break;

            case 'END':

                // si tiene armas, puede tener armas mías o armas asignadas por el oponente
                if (card.armsId) {
                    haveOpponentArm = processArmsFromBearer(card, newCards, newCardsOpponent, CASTLE_ZONE, myUserId as string, 'END', sendMessage);    
                    delete card.armsId;
                }

                if (card.bearerId) {
                    // Al portador se le debe quitar esta arma
                    processArm(card, newCards);
                    delete card.bearerId;
                }

                newCards[fromZone] = newCards[fromZone].filter((card: Card, index2: number) => index2 !== index);
                newCards[CASTLE_ZONE] = [card, ...newCards[CASTLE_ZONE]];

                sendMessage(`Moviendo "${card.name}" de "${fromZone}" al final de "${CASTLE_ZONE}"`);
                dispatch(changeMatch(newCards));
                
                break;
        }

        dispatch(setCardToMoveAction(null));
        dispatch(closeModalDestinyCastleOptions());

    }; 

    const handleCancelModal = () => {
        dispatch(setCardToMoveAction(null));
        dispatch(closeModalDestinyCastleOptions());
    };

    const onChangeZone = (e: RadioChangeEvent) => {
        setOption(e.target.value);
    };

    return (
        <Modal centered title={ `Mover "${cardToMove.card.name}" al ${CASTLE_ZONE} y...`} visible={ modalDestinyCastleOptions } onOk={ handleOkModal } onCancel={ handleCancelModal } >
            <Radio.Group value={ option } onChange={ onChangeZone } >
                <Space direction="vertical">
                    <Radio value={ 'SHUFFLE' }>Barajar</Radio>
                    <Radio value={ 'START' }>Poner al principio</Radio>
                    <Radio value={ 'END' }>Poner al final</Radio>
                </Space>
            </Radio.Group>
        </Modal>
    )
}

export default DestinyCastleOptionsModal;