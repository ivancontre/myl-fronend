import React, { createContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import useSocket from '../hooks/useSocket';
import { RootState } from '../store';

// Todo lo que se defina aquí estará disponible en sus hijos

type Props = {
    children: React.ReactNode;
};

export type GlobalContentSocket = {
    online: boolean;
    socket?: Socket<DefaultEventsMap, DefaultEventsMap>
};

export const SocketContext = createContext<GlobalContentSocket>({
    online: false
});

export const SocketProvider = ({ children }: Props) => {
    
    const { socket, online,  conectarSocket, desconectarSocket } = useSocket(process.env.REACT_APP_HOST_BACKEND as string);

    const { logged } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if ( logged ) {
            conectarSocket();
            
        }
    }, [ logged, conectarSocket ]);

    useEffect(() => {
        if ( !logged ) {
            desconectarSocket();
        }
    }, [ logged, desconectarSocket ]);

    return (
        <SocketContext.Provider value={ {socket, online} }>
            { children }
        </SocketContext.Provider>
    )
};