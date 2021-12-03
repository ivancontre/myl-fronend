import { addMessage, ChatActionTypes, Message, resetChat } from "./types";

export const addMessageAction = (message: Message): ChatActionTypes => {
    return {
        type: addMessage,
        payload: message
    }
};

export const resetChatAction = (): ChatActionTypes => {
    return {
        type: resetChat
    }
};