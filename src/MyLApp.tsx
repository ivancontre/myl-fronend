import React, { FC } from 'react';
import { MenuProvider } from './context/MenuContext';
import { SocketProvider } from './context/SocketContext';
import AppRouter from './routers/AppRouter';

const MyLApp: FC = () => {

    return (
        <SocketProvider>
            <MenuProvider>
            <AppRouter />
            </MenuProvider > 
            
        </SocketProvider>
        
    )
}

export default MyLApp;