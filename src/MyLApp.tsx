import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import AppRouter from './routers/AppRouter';
import { setSocket } from './store/socket/action';

const MyLApp: FC = () => {

    const socket = useMemo(() => io(process.env.REACT_APP_HOST_BACKEND as string, {
		transports: ['websocket']
	}).connect(), []);

    const dispatch = useDispatch();

    //const { match } = useSelector((state: RootState) => state.socket);

    useEffect(() => {
        dispatch(setSocket(socket.connected, socket))
	}, [socket, dispatch]);

	useEffect(() => {

		socket.on('connect', () => {
            dispatch(setSocket(true, socket))
		});
		
	}, [socket, dispatch]);

	useEffect(() => {

		socket.on('disconnect', () => {
			dispatch(setSocket(false))
		});

	}, [socket, dispatch]);


    return (
        <AppRouter />
    )
}

export default MyLApp;