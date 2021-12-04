import { message, Modal, Select } from 'antd';
import React, { FC, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { closeModalTakeControlOpponentCard } from '../../store/ui-modal/action';
import { ZONE_NAMES } from "../../constants";
import { Card } from '../../store/card/types';
import { changeMatch, changOpponenteMatch } from '../../store/match/action';
import { SocketContext } from '../../context/SocketContext';
import { Message } from '../../store/chat/types';
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';

interface TakeControlOpponentCardModalProps {
    zone: string;
    index: number;
};

const { DEFENSE_ZONE, ATTACK_ZONE, SUPPORT_ZONE, HAND_ZONE, UNPAID_GOLD_ZONE, GOLDS_PAID_ZONE, EXILE_ZONE } = ZONE_NAMES;

const TakeControlOpponentCardModal: FC<TakeControlOpponentCardModalProps> = ({zone, index}) => {

    const { match, opponentMatch, matchId } = useSelector((state: RootState) => state.match);
    const { modalOpenTakeControlOpponentCard } = useSelector((state: RootState) => state.uiModal);
    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);

    const [optionSelect, setOptionSelect] = useState('');
    const dispatch = useDispatch();

    const { socket } = useContext(SocketContext);

    const handleOkModal = () => {

        if (optionSelect === '') {
            message.warn('Ninguna zona de destino seleccionada')
            return;
        }

        const newOpponentMatch = { ...opponentMatch };
        const newMatch = { ...match };

        const card = newOpponentMatch[zone].find((card: Card, index2: number) => index2 === index) as Card;        

        newOpponentMatch[zone] = newOpponentMatch[zone].filter((card: Card, index2: number) => index2 !== index);
        newMatch[optionSelect] = [...newMatch[optionSelect], card];

        if (card.armsId?.length) {

            for (const armId of card.armsId as string[]) {
                const armCardInMyZone = newOpponentMatch[SUPPORT_ZONE].find((card: Card) => card.idx === armId) as Card;
                newOpponentMatch[SUPPORT_ZONE] = newOpponentMatch[SUPPORT_ZONE].filter((card: Card) =>  card.idx !== armId);
                newMatch[SUPPORT_ZONE] = [...newMatch[SUPPORT_ZONE], armCardInMyZone];
            }
        }

        dispatch(changeMatch(newMatch));
        dispatch(changOpponenteMatch(newOpponentMatch));
        dispatch(closeModalTakeControlOpponentCard());

        socket?.emit('update-match-opponent', {
            match: newOpponentMatch,
            matchId
        });

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Tomando control de "${card.name}" oponente y enviándola a mi "${optionSelect}"`,
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
        dispatch(closeModalTakeControlOpponentCard());
    };

    const handleSelect = (value: string) => {
        setOptionSelect(value);
    };

    return (
        <Modal centered title="Destino de Carta" visible={ modalOpenTakeControlOpponentCard } onOk={ handleOkModal } onCancel={ handleCancelModal }>
            <p>Seleccione tu zona donde quieres que se envíe la carta seleccionada</p>

            <Select
                placeholder="Mover a"
                style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                onChange={ handleSelect }                      
            >
                <Select.Option key={ HAND_ZONE } value={ HAND_ZONE }>{ HAND_ZONE }</Select.Option>
                <Select.Option key={ SUPPORT_ZONE } value={ SUPPORT_ZONE }>{ SUPPORT_ZONE }</Select.Option> 
                <Select.Option key={ DEFENSE_ZONE } value={ DEFENSE_ZONE }>{ DEFENSE_ZONE }</Select.Option>
                <Select.Option key={ ATTACK_ZONE } value={ ATTACK_ZONE }>{ ATTACK_ZONE }</Select.Option>
                <Select.Option key={ GOLDS_PAID_ZONE } value={ GOLDS_PAID_ZONE }>{ GOLDS_PAID_ZONE }</Select.Option>  
                <Select.Option key={ UNPAID_GOLD_ZONE } value={ UNPAID_GOLD_ZONE }>{ UNPAID_GOLD_ZONE }</Select.Option>
                <Select.Option key={ EXILE_ZONE } value={ EXILE_ZONE }>{ EXILE_ZONE }</Select.Option> 
                    
            </Select>
        </Modal>
    )
}

export default TakeControlOpponentCardModal;