import { InputNumber, Modal } from 'antd';
import React, { FC, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ZONE_NAMES } from "../../constants";
import { throwXcards } from '../../helpers/throwsCards';
import { changeMatch } from '../../store/match/action';
import { closeModalThrowXcards } from '../../store/ui-modal/action';
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { SocketContext } from '../../context/SocketContext';
import { Message } from '../../store/chat/types';

const { CASTLE_ZONE, CEMETERY_ZONE } = ZONE_NAMES;

const ThrowXcardsModal: FC = () => {

    const { match, matchId } = useSelector((state: RootState) => state.match);

    const { modalOpenThrowXcards } = useSelector((state: RootState) => state.uiModal);

    const [amountThrowXcards, setAmountModalThrowXcards] = useState(1);

    const { socket } = useContext(SocketContext);

    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    const handleOkModal = () => {
        
        const newMatch = throwXcards(amountThrowXcards, match, CASTLE_ZONE, CEMETERY_ZONE);
        dispatch(changeMatch(newMatch));
        dispatch(closeModalThrowXcards());

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Botando "${amountThrowXcards}" carta(s) del "${CASTLE_ZONE}" a "${CEMETERY_ZONE}"`,
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
        setAmountModalThrowXcards(value);
    };    

    const handleCancelModal = () => {
        dispatch(closeModalThrowXcards());
    };

    return (
        <Modal centered title="Botar Cartas" visible={ modalOpenThrowXcards } onOk={ handleOkModal } onCancel={ handleCancelModal }>
            <p>Indique la cantidad de cartas que desea botar desde el {CASTLE_ZONE} al {CEMETERY_ZONE}</p>                
            <InputNumber min={ 1 } max={ match[CASTLE_ZONE].length } defaultValue={ 1 } onChange={ onChangeInputAmount }/>
        </Modal>
    )
}

export default ThrowXcardsModal;