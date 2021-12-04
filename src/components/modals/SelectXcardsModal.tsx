import { InputNumber, Modal } from 'antd';
import React, { FC, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ZONE_NAMES } from "../../constants";
import { closeModalSelectXcards, openModalViewXCastle } from '../../store/ui-modal/action';
import { setAmountCardsViewAction } from '../../store/match/action';
import { SocketContext } from '../../context/SocketContext';
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { Message } from '../../store/chat/types';

const { CASTLE_ZONE } = ZONE_NAMES;

const SelectXcardsModal: FC = () => {

    const { match, matchId, amountCardsView } = useSelector((state: RootState) => state.match);

    const { modalOpenSelectXcards } = useSelector((state: RootState) => state.uiModal);

    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);

    const { socket } = useContext(SocketContext);

    const dispatch = useDispatch();

    const handleOkModal = () => {
        dispatch(closeModalSelectXcards());
        dispatch(openModalViewXCastle());

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Viendo las primeras "${amountCardsView}" carta(s) del "${CASTLE_ZONE}"`,
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

    const onChangeInputAmount = (value: number) => {
        dispatch(setAmountCardsViewAction(value))
    };    

    const handleCancelModal = () => {
        dispatch(closeModalSelectXcards());
        dispatch(setAmountCardsViewAction(1))
    };

    return (
        <Modal centered title="Ver Cartas" visible={ modalOpenSelectXcards } onOk={ handleOkModal } onCancel={ handleCancelModal } >
            <p>Indique la cantidad de cartas que desea ver</p>                
            <InputNumber min={ 1 } max={ match[CASTLE_ZONE].length } defaultValue={ 1 } onChange={ onChangeInputAmount }/>
        </Modal>
    )
}

export default SelectXcardsModal;