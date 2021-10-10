import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

export const success = '[socket] success';

export type SocketState = {
    online: boolean;
    socket?: Socket<DefaultEventsMap, DefaultEventsMap>
};

type SuccessAction = {
    type: typeof success;
    payload: SocketState;
};

export type SocketActionTypes = SuccessAction;