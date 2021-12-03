import moment from "moment";

export const getChats = '[chat] get messages';
export const addMessage = '[chat] add message';
export const resetChat = '[chat] reset';

export type Message = {
    id: string;
    username: string;
    text: string;
    isAction: boolean;
    date?: moment.Moment
};

export type ChatState = {
    chats: Message[];
};

type ChatGetAction = {    
    type: typeof getChats
};

type ChatAddMessageAction = {    
    type: typeof addMessage,
    payload: Message
};

type ChatResetAction = {    
    type: typeof resetChat
};

export type ChatActionTypes = 
ChatGetAction | 
ChatAddMessageAction |
ChatResetAction;