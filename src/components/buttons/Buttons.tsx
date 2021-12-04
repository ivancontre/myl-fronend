import { Button } from 'antd';
import React, { FC, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../context/SocketContext';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { RootState } from '../../store';
import { addMessageAction } from '../../store/chat/action';
import { Message } from '../../store/chat/types';


import { QuestionOutlined, StopOutlined, LikeOutlined } from '@ant-design/icons';

const Buttons: FC = () => {

    const { socket } = useContext(SocketContext);
    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);
    const { matchId } = useSelector((state: RootState) => state.match);
    const dispatch = useDispatch();

    const stop = () => {

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `STOP!!!`,
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

    const yourTurn = () => {

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `TU TURNO!!!`,
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

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Resultado dado: ${result}`,
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


    return (
        <div>
            <Button type="default" block onClick={ () => randomIntFromInterval(1, 6) } icon={ <QuestionOutlined />} style={{marginBottom: 3}} >
                Lanzar dado
            </Button>

            <Button type="primary" block danger onClick={ stop } icon={ <StopOutlined /> } style={{marginBottom: 3}} >
                Stop!
            </Button>
            
            <Button type="primary" block onClick={ yourTurn } icon={ <LikeOutlined /> }>
                Tu turno!
            </Button>
        </div>
    )
}

export default Buttons;