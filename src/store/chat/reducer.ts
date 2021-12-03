import { addMessage, ChatActionTypes, ChatState, resetChat } from "./types";


const initialState: ChatState = {
    chats: []
};

export const chatReducer = (state: typeof initialState = initialState, action: ChatActionTypes): ChatState => {

    switch (action.type) {

        case resetChat:
            return initialState;

        case addMessage:
            return {
                ...state,
                chats: [...state.chats, action.payload]
            };
    

        default:
            return state;

    }
};