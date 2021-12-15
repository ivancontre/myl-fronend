import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Message } from '../../store/chat/types';
import MyMessage from './MyMessage';
import OpponentMessage from './OpponentMessage';
import SendMessage from './SendMessage';

import '../../css/chat.css';
import { SocketContext } from '../../context/SocketContext';
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';

const Chat = () => {

    const { chats } = useSelector((state: RootState) => state.chats);
    const { opponentId } = useSelector((state: RootState) => state.match);

    const { socket } = useContext(SocketContext);

    const dispatch = useDispatch();

    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        
        socket?.on('receive-personal-message', (message: Message) => {
            dispatch(addMessageAction(message));
            scrollToBottom('messages');

            if (message.text === 'STOP!!!' || message.text === 'TU TURNO!!!') {

                setAnimated(true);

                setTimeout(() => {
                    setAnimated(false);
                }, 500);

            }
        });

        return () => {
            socket?.off('receive-personal-message');
        }
        
    }, [socket, dispatch]);


    return (

        <div className={ animated ? "animate__animated animate__shakeY chat" : "chat" }>
            <div className="messages" id="messages">
                {
                    chats.length > 0 ? chats.map((message: Message, index: number) => (
                        ( message.id === opponentId )
                            ? <OpponentMessage key={index} message={ message } />
                            : <MyMessage key={index} message={ message } />
                    )) : <p style={{textAlign: 'center'}}>Chat vacío, escribe algo para iniciar la conversación...</p>
                }
            </div>

            <SendMessage />

        </div>
        
    )
}

export default Chat;