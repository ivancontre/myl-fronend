import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (serverPath: string) => {
	
    // const socket = useMemo(() => io(serverPath, {
	// 	transports: ['websocket']
	// }).connect(), [serverPath]);    


	const [ socket, setSocket ] = useState<any>(null);
    const [ online, setOnline ] = useState(false);

    const conectarSocket = useCallback( () => {

        const token = localStorage.getItem('token') || '';

        const socketTemp = io(serverPath, {
            transports: ['websocket'],
            autoConnect: true,
            forceNew: true,
            query: {
                'x-token': token
            }
        
        }).connect();

        setSocket( socketTemp );
    },[ serverPath ]);

    const desconectarSocket = useCallback( () => {
        socket?.disconnect();
    },[ socket ]);


    useEffect(() => {
        setOnline( socket?.connected );
    }, [socket])

    useEffect(() => {
        socket?.on('connect', () => setOnline( true ));
    }, [ socket ])

    useEffect(() => {
        socket?.on('disconnect', () => setOnline( false ));
    }, [ socket ])

    return {
        socket,
        online,
        conectarSocket,
        desconectarSocket
    }
};

export default useSocket;