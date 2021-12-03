import React, { FC } from 'react';
import { horaMes } from '../../helpers/date';
import { Message } from '../../store/chat/types';

export interface MyMessageProps {
    message: Message;
};

const MyMessage: FC<MyMessageProps>  = ({ message }) => {

    return (
        <div className="content-text">
            <p className="message-text">
                <span className="my-username">
                   { `Yo: ` }
                </span>
                <span>
                    { message.text }
                </span>
            </p>
            <p className="message-date">{ horaMes(message.date) }</p>
        </div>
    )
}

export default MyMessage;