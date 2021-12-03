import React, { FC } from 'react';
import { MenuProvider } from './context/MenuContext';
import { SocketProvider } from './context/SocketContext';
import AppRouter from './routers/AppRouter';

import 'animate.css';

const MyLApp: FC = () => {
    
    //document.addEventListener('contextmenu', event => event.preventDefault());

    return (
            <SocketProvider>
                <MenuProvider>
                    <AppRouter />
                </MenuProvider >
            </SocketProvider>
        
        
    )
}

export default MyLApp;