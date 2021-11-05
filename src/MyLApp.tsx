import { Spin } from 'antd';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { MenuProvider } from './context/MenuContext';
import { SocketProvider } from './context/SocketContext';
import AppRouter from './routers/AppRouter';
import { RootState } from './store';

import 'animate.css';

const MyLApp: FC = () => {
    //document.addEventListener('contextmenu', event => event.preventDefault());

    const { show, text } = useSelector((state: RootState) => state.spin);

    return (
        <Spin tip={ text } spinning={ show }>
            <SocketProvider>
                <MenuProvider>
                    <AppRouter />
                </MenuProvider >
            </SocketProvider>
        </Spin>
        
        
    )
}

export default MyLApp;