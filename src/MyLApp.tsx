import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import Match from './pages/Match';
import { setSocket } from './store/socket/action';

const MyLApp: FC = () => {

    const socket = useMemo(() => io(process.env.REACT_APP_HOST_BACKEND as string, {
		transports: ['websocket']
	}).connect(), []);

    const dispatch = useDispatch();

    //const { match } = useSelector((state: RootState) => state.socket);

    useEffect(() => {
        dispatch(setSocket(socket.connected, socket))
	}, [socket]);

	useEffect(() => {

		socket.on('connect', () => {
            dispatch(setSocket(true, socket))
		});
		
	}, [socket]);

	useEffect(() => {

		socket.on('disconnect', () => {
			dispatch(setSocket(false))
		});

	}, [socket]);


    return (
        <Match />
    )
}

export default MyLApp;