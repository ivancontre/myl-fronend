import React, { FC } from 'react';
import { horaMes } from '../../helpers/date';
import { Message } from '../../store/chat/types';

export interface MyMessageProps {
    message: Message;
};

const MyMessage: FC<MyMessageProps>  = ({ message }) => {

    return (
        <div className="content-text" style={{backgroundColor: 'cyan'}}>
            <p className="message-text">
                <span className="my-username">
                   { `Yo: ` }
                </span>
                <span className={ message.isAction ? 'font-action' : ''} dangerouslySetInnerHTML={{__html: message.text }}>
                </span>
            </p>
            <p className="message-date">{ horaMes(message.date) }</p>
        </div>
    )
}

export default MyMessage;