import React, { FC } from 'react';
import { horaMes } from '../../helpers/date';
import { Message } from '../../store/chat/types';

export interface OpponentMessageProps {
    message: Message;
};

const OpponentMessage: FC<OpponentMessageProps> = ({ message }) => {

    return (
        <div className="content-text" style={{backgroundColor: 'lemonchiffon'}}>
            <p className="message-text">
                <span className="opponent-username">
                    { message.username + ': ' } 
                </span>
                <span>
                    { message.text }
                </span>
            </p>
            <p className="message-date">{ horaMes(message.date) }</p>
        </div>
    )
}

export default OpponentMessage;