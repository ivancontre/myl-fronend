import { InputNumber, Modal } from 'antd';
import React, { FC, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ZONE_NAMES } from "../../constants";
import { closeModalSelectXcards, closeModalSelectXcardsOpponent, openModalViewXCastle } from '../../store/ui-modal/action';
import { setAmountCardsViewAction } from '../../store/match/action';
import { SocketContext } from '../../context/SocketContext';
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { Message } from '../../store/chat/types';

const { CASTLE_ZONE } = ZONE_NAMES;

interface SelectXcardsModalProps {
    toOpponent?: boolean;
};

const SelectXcardsModal: FC<SelectXcardsModalProps> = ({ toOpponent }) => {

    const { match, matchId, amountCardsView } = useSelector((state: RootState) => state.match);

    const { modalOpenSelectXcards, modalOpenSelectXcardsOpponent } = useSelector((state: RootState) => state.uiModal);

    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);

    const { socket } = useContext(SocketContext);

    const dispatch = useDispatch();

    const handleOkModal = () => {


        if (!toOpponent) {

            dispatch(closeModalSelectXcards());
            dispatch(openModalViewXCastle());

            const newMessage: Message = {
                id: myUserId as string,
                username: username as string,
                text: `Viendo las primeras "${amountCardsView}" carta(s) del <strong>${CASTLE_ZONE}</strong>`,
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

        } else {

            dispatch(closeModalSelectXcardsOpponent());
            
            socket?.emit('show-x-clastle-to-opponent', {
                matchId,
                amountCardsView
            });
    
            const newMessage: Message = {
                id: myUserId as string,
                username: username as string,
                text: `Mostrando al oponente las primeras "${amountCardsView}" carta(s) del <strong>${CASTLE_ZONE}</strong>`,
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

        }

    };

    const onChangeInputAmount = (value: number) => {
        dispatch(setAmountCardsViewAction(value))
    };    

    const handleCancelModal = () => {
        
        if (!toOpponent) {
            dispatch(closeModalSelectXcards());
        } else {
            dispatch(closeModalSelectXcardsOpponent());
        }

        dispatch(setAmountCardsViewAction(1));
    };

    return (
        <Modal centered title={!toOpponent ? "Ver Cartas" : "Mostrar Cartas"} visible={ modalOpenSelectXcards || modalOpenSelectXcardsOpponent } onOk={ handleOkModal } onCancel={ handleCancelModal } >
            <p>{!toOpponent ? `Indique la cantidad de cartas que desea ver`: `Indique la cantidad de cartas que desea mostrar`}</p>                
            <InputNumber min={ 1 } max={ match[CASTLE_ZONE].length } defaultValue={ 1 } onChange={ onChangeInputAmount }/>
        </Modal>
    )
}

export default SelectXcardsModal;