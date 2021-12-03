import { Input, Form } from 'antd';
import React, { FC, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../context/SocketContext';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { RootState } from '../../store';
import { addMessageAction } from '../../store/chat/action';
import { Message } from '../../store/chat/types';

interface FieldData {
    name: string | number | (string | number)[];
    value?: any;
};


const SendMessage: FC = () => {

    const { socket } = useContext(SocketContext);

    const { matchId } = useSelector((state: RootState) => state.match);
    const { id } = useSelector((state: RootState) => state.auth);
    const { username } = useSelector((state: RootState) => state.auth);

    const [fields, setFields] = useState<FieldData[]>([]);

    const dispatch = useDispatch();

    const onFinish = (values: any) => {

        const { message } = values;

        if ( message.length === 0 ){ 
            return; 
        }

        const newMessage: Message = {
            id: id as string,
            username: username as string,
            text: message,
            isAction: false
        };

        socket?.emit( 'personal-message', {
            matchId,
            message: newMessage
        }, (data: any) => {
            newMessage.date = data;
            dispatch(addMessageAction(newMessage));
            scrollToBottom('messages');
        });        

        setFields([{
            name: 'message',
            value: ''
        }]);

    };

    return (
        <div className="button-send">
            <Form
                
                onFinish={ onFinish }
                autoComplete="off"
                noValidate
                fields={ fields }
                
            >

                <Form.Item
                    style={{paddingBottom: 0}}
                    name="message"
                >
                    <Input 
                        
                        placeholder="Escribir mensaje..." 
                    />
                </Form.Item>

            </Form>
        </div>
        
    )
};

export default SendMessage;