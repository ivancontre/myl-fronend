import { Button } from 'antd';
import React, { FC, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../context/SocketContext';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { RootState } from '../../store';
import { addMessageAction } from '../../store/chat/action';
import { Message } from '../../store/chat/types';


import { QuestionCircleOutlined, ExclamationCircleOutlined, CheckCircleOutlined, MessageOutlined } from '@ant-design/icons';

const Buttons: FC = () => {

    const { socket } = useContext(SocketContext);
    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);
    const { matchId } = useSelector((state: RootState) => state.match);
    const dispatch = useDispatch();

    const sendMessage = (text: string) => {

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

    const randomIntFromInterval = (min: number, max: number) => {

        const result = Math.floor(Math.random() * (max - min + 1) + min);
        sendMessage(`Resultado dado: ${result}`);

    };


    return (
        <div>
            <Button type="default" block onClick={ () => randomIntFromInterval(1, 6) } icon={ <QuestionCircleOutlined />} style={{marginBottom: 3, backgroundColor: 'darkgoldenrod'}} >
                Lanzar dado
            </Button>

            <Button type="primary" block danger onClick={ () => sendMessage('STOP!!!') } icon={ <ExclamationCircleOutlined /> } style={{marginBottom: 3}} >
                Stop!
            </Button>
            
            <Button type="primary" block onClick={ () => sendMessage('TU TURNO!!!') } icon={ <CheckCircleOutlined /> }>
                Tu turno!
            </Button>

            <Button type="default" block onClick={ () => sendMessage('Pensando...') } icon={ <MessageOutlined /> }>
                Pensando...
            </Button>
        </div>
    )
}

export default Buttons;