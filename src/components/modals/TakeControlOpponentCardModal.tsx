import { message, Modal, Select } from 'antd';
import React, { FC, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { closeModalTakeControlOpponentCard } from '../../store/ui-modal/action';
import { ZONE_NAMES } from "../../constants";
import { Card } from '../../store/card/types';
import { changeMatch, changOpponenteMatch } from '../../store/match/action';
import { SocketContext } from '../../context/SocketContext';

interface TakeControlOpponentCardModalProps {
    zone: string;
    index: number;
};

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE, UNPAID_GOLD_ZONE, GOLDS_PAID_ZONE } = ZONE_NAMES;

const TakeControlOpponentCardModal: FC<TakeControlOpponentCardModalProps> = ({zone, index}) => {

    const { match, opponentMatch, opponentId } = useSelector((state: RootState) => state.match);
    const { modalOpenTakeControlOpponentCard } = useSelector((state: RootState) => state.uiModal);
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
        card.isOpponent = true;

        newOpponentMatch[zone] = newOpponentMatch[zone].filter((card: Card, index2: number) => index2 !== index);
        newMatch[optionSelect] = [...newMatch[optionSelect], card];

        dispatch(changeMatch(newMatch));
        dispatch(changOpponenteMatch(newOpponentMatch));
        dispatch(closeModalTakeControlOpponentCard());

        socket?.emit('update-match-opponent', {
            match: newOpponentMatch,
            opponentId
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
                    
            </Select>
        </Modal>
    )
}

export default TakeControlOpponentCardModal;