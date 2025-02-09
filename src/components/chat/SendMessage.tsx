import { Input, Form, Button } from 'antd';
import React, { FC, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SendOutlined } from '@ant-design/icons';

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

    const [message, setMessage] = useState<string>('');

    const dispatch = useDispatch();

    const sendMessage = (text: string) => {
        const newMessage: Message = {
            id: id as string,
            username: username as string,
            text,
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
    };

    const onFinish = (values: any) => {

        const { message } = values;

        if ( message.length === 0 ){ 
            return; 
        }

        sendMessage(message);  

        setFields([{
            name: 'message',
            value: ''
        }]);

    };

    const onSearch = () => {

        if ( message.length === 0 ){ 
            return; 
        }

        sendMessage(message);

        setFields([{
            name: 'message',
            value: ''
        }]);

        setMessage('');
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
    };

    return (
        <div className="button-send">
            <Form
                
                onFinish={ onFinish }
                autoComplete="off"
                noValidate
                fields={ fields }
                
            >

                {/* <Form.Item
                    style={{padding: 5, marginBottom: 2}}
                    name="message"
                >
                    <Input.Search
                        size="middle"
                        onSearch={ onSearch }
                        placeholder="Escribir mensaje..." 
                    />
                </Form.Item> */}
                <Input.TextArea
                    showCount
                    maxLength={100}
                    style={{ resize: 'none' }}
                    placeholder="Escribir mensaje..." 
                    onChange={onChange}
                    value={message}
                />
                <Button type="primary" block style={{marginBottom: 3, borderRadius: 3}} onClick={onSearch} icon={<SendOutlined />}>
                    Enviar mensaje
                </Button>

            </Form>
        </div>
        
    )
};

export default SendMessage;