import React, { FC } from 'react';
import { MenuProvider } from './context/MenuContext';
import { SocketProvider } from './context/SocketContext';
import AppRouter from './routers/AppRouter';

import 'animate.css';

const MyLApp: FC = () => {
    
    document.addEventListener('contextmenu', event => event.preventDefault());

    localStorage.openpages = Date.now();

    const onLocalStorageEvent = function(e: StorageEvent){
        
        if(e.key === 'openpages'){
            // Emit that you're already available.
            localStorage.page_available = Date.now();
        }
  
        if(e.key === 'page_available') {
            
            alert('Ya posees una pestaña abierta con la aplicación. Solo puedes tener una sola abierta');
            const win = window.open("about:blank", "_self");
            win?.close();
            
        }
    };

    window.addEventListener('storage', onLocalStorageEvent, false);

    return (
            <SocketProvider>
                <MenuProvider>
                    <AppRouter />
                </MenuProvider >
            </SocketProvider>
    )
}

export default MyLApp;