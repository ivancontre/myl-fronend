import { SocketState, SocketActionTypes, success } from "./types";

const initialState: SocketState = {
    online: false
};

export const socketReducer = (state: typeof initialState = initialState, action: SocketActionTypes): SocketState => {

    switch (action.type) {

        case success:
            return {
                ...state,
                online: action.payload.online,
                socket: action.payload.socket

            };
    
        default:
            return state;
    }

}