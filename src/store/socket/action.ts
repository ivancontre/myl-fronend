import { Dispatch } from "react";
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

import useSocket from "../../hooks/useSocket";
import { SocketActionTypes, success } from "./types";

export const startSocket = () => {
    return async (dispatch: Dispatch<SocketActionTypes>) => {

        try {
            
            const { socket, online } = useSocket(process.env.REACT_APP_HOST_BACKEND || '');

            dispatch(setSocket(online, socket));

        } catch (error) {
            console.log(error);
        }
    }
}

export const setSocket = (online: boolean, socket?: Socket<DefaultEventsMap, DefaultEventsMap>): SocketActionTypes => {
    
    return {
        type: success,
        payload: {
            online,
            socket
        }
    }
};