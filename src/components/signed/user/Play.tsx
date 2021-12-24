import { Alert, Button, Input, message, Modal, Space, Table, Tag } from 'antd';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import Highlighter from 'react-highlight-words';
import { useLocation } from 'react-router';
import { SearchOutlined, TeamOutlined } from '@ant-design/icons';
import useHideMenu from '../../../hooks/useHideMenu';
import { RootState } from '../../../store';
import { resetCardUpdating, resetMySelection } from '../../../store/card/action';
import { User } from '../../../store/auth/types';
import { ColumnsType } from 'antd/lib/table';
import { SocketContext } from '../../../context/SocketContext';
import { startLoadDeck } from '../../../store/deck/action';
import { MenuContext } from '../../../context/MenuContext';
import { Link } from 'react-router-dom';
import { setDetail } from '../../../store/auth/action';

const Play: FC = () => {    

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    const { collapsedMenu } = useContext(MenuContext);

    useHideMenu(false, path, collapsedMenu);

    const dispatch = useDispatch();

    const { activeUsersForPlay } = useSelector((state: RootState) => state.play);
    const { decks, deckDefault } = useSelector((state: RootState) => state.decks);
    const { victories, defeats, playing } = useSelector((state: RootState) => state.auth);  
    const { matchId, opponentId } = useSelector((state: RootState) => state.match);
    const { eras } = useSelector((state: RootState) => state.description);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const { socket } = useContext(SocketContext);

    const ref0 = useRef();

    useEffect(() => {
        
        dispatch(resetCardUpdating());
        dispatch(resetMySelection());

    }, [dispatch]);

    useEffect(() => {

        if (!decks) { 
            dispatch(startLoadDeck());
        }

    }, [dispatch, decks]);

    const handleSearch = (selectedKeys: string, confirm: Function, dataIndex: string) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: Function) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: string, ref: any) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={ ref }
                    placeholder={`Buscar por ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0])
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => ref.current.select(), 100);
            }
        },
        render: (text: string) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
        ) : (
            text
        ),
    });

    const cancelInvitation = (opponentId: string, key: string) => {
        clearInterval(timer);

        socket?.emit('cancele-invitation', {
            opponentId,
            key
        });
    };

    let timer: any;
    
    const countDown = (username: string, opponentId: string, key: string) => {
        let secondsToGo = 15;
        const modal = Modal.info({
            title: 'Esperando confirmación',
            content: `El usuario "${username}" tiene ${secondsToGo} segundos para confirmar`,
            onOk: () => cancelInvitation(opponentId, key),
            onCancel: () => cancelInvitation(opponentId, key),
            okText: 'Cancelar',
        });
        
        timer = setInterval(() => {
            secondsToGo -= 1;
            modal.update({
                content: `El usuario "${username}" tiene ${secondsToGo} segundos para confirmar`,
            });
        }, 1000);

        setTimeout( () => {
            clearInterval(timer);
        }, secondsToGo * 1000);

        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1050);
    };

    useEffect(() => {
        socket?.on('go-match', (payload: any) => {
            Modal.destroyAll();
        });

        return () => {
            socket?.off('go-match');
            clearInterval(timer);
        }

    }, [socket, timer]);

    const invite = (opponentId: string, username: string) => {
        const key = uuid();

        socket?.emit('invite', {
            opponentId,
            key
        });
        
        countDown(username, opponentId, key);
    };

    const haveDecks = () => {
        return decks?.length ? true : false;
    };

    const isCorrectDeckDefault = () => {


        if (deckDefault?.cards.length === 50) {
            return true;
        }
        
        return false;
    };

    const forceMatchExit = () => {
        socket?.emit('force-match-exit', {
            opponentId,
            matchId
        }, (error: any, result: any) => {

            if (result) {
                dispatch(setDetail(false, victories ? victories : 0, defeats ? defeats : 0));
                message.success('Se forzó la salida de la partida correctamente');
            }
        });
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Usuario',
            dataIndex: 'username',
            key: 'username',
            width: '30%',
            ...getColumnSearchProps('username', ref0),
            sorter: (a: any, b: any) => { 
                if(a.username < b.username) { return -1; }
                if(a.username > b.username) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Victorias',
            dataIndex: 'victories',
            key: 'victories',
            width: '10%',
            sorter: (a: any, b: any) => { 
                if(a.victories < b.victories) { return -1; }
                if(a.victories > b.victories) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Derrotas',
            dataIndex: 'defeats',
            key: 'defeats',
            width: '10%',
            sorter: (a: any, b: any) => { 
                if(a.defeats < b.defeats) { return -1; }
                if(a.defeats > b.defeats) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Estado',
            dataIndex: 'online',
            key: 'online',
            width: '30%',
            sorter: (a: any, b: any) => { 
                if(a.online < b.online) { return -1; }
                if(a.online > b.online) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            render: (text, row) => {
                return (row.online ? <Tag color="lime">Online</Tag> : <Tag color="magneta">Desconectado</Tag>) 
            }
        },
        {
            title: 'Era',
            dataIndex: 'era',
            key: 'era',
            width: '30%',
            sorter: (a: any, b: any) => { 
                if(a.era < b.era) { return -1; }
                if(a.era > b.era) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            render: (text, row) => {
                return (<Tag color={row.era === 'Segunda era' ? 'blue': 'cyan' }>{row.era}</Tag>) 
            },
            filters: eras.map(e => {
                return {
                    text: e.name,
                    value: e.name
                }
            }),
            onFilter: (text, row) => row.era?.indexOf(text as string) === 0,
        },
        {
            title: '¿Jugando?',
            dataIndex: 'playing',
            key: 'playing',
            width: '30%',
            sorter: (a: any, b: any) => { 
                if(a.playing < b.playing) { return -1; }
                if(a.playing > b.playing) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            render: (text, row) => {
                return (row.playing ? <Tag color="volcano">Jugando...</Tag> : 'No') 
            }
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            render: (text, row) => {

                if (!playing && !row.playing && row.online && haveDecks() && isCorrectDeckDefault()) {
                    return <Button onClick={ () => invite(row.id, row.username) } ghost icon={<TeamOutlined />}>Invitar a jugar</Button>
                }
            },
        },
    ];

    return (
        <>
             <Alert 
                style={{ width: "100%", marginBottom: 10 }} 
                message="En esta sección podrás elegir contra quién jugar. Sólo aparecen los usuarios que al menos tiene un mazo creado con 50 cartas y posee alguno seleccionado por defecto" 
                type="info" showIcon
            />
 
            {
                !haveDecks() && (
                    <Alert 
                        style={{ width: "100%", marginBottom: 10 }} 
                        message="Debes crear al menos 1 mazo con 50 cartas para poder jugar" 
                        type="warning" 
                        showIcon
                        action={
                            <Link to="decks/new">Crear nuevo mazo</Link>
                        }
                    />                 

                )
            }

            {
                haveDecks() && !isCorrectDeckDefault() && (
                    <Alert 
                        style={{ width: "100%", marginBottom: 10 }} 
                        message="Debes tener un mazo elegido por defecto" 
                        type="warning" 
                        showIcon
                        action={
                            <Link to="decks">Elegir mazo</Link>
                        }
                    />

                )
            }

            {
                playing && <Alert 
                    style={{ width: "100%", marginBottom: 10 }} 
                    message="Ya te encuentras en una partida. Debes finalizarla para poder jugar desde aquí" 
                    type="warning" 
                    showIcon
                    action={
                        <Button onClick={ forceMatchExit } type="link" >Forzar abandono de partida</Button>
                    }
                />
            }

            <p><Tag color="green" style={{fontSize: 14}}>{`Mis victorias: ${victories ? victories : '0'}`}</Tag></p>
            <p><Tag color="red" style={{fontSize: 14}}>{`Mis derrotas: ${defeats ? defeats : '0'}`}</Tag></p>

            {
                deckDefault?.era && (
                    <Alert 
                        style={{ width: "100%", marginBottom: 10 }} 
                        message={`Tu mazo por defecto es: ${deckDefault.name} (${deckDefault.era})`}
                        type="success" 
                        showIcon
                        action={
                            <Link to="decks">¿Cambiar mazo?</Link>
                        }
                    />
                )
            }

            <Table<User>
                 pagination={{ defaultPageSize: 15 }}
                 rowKey="id" 
                 columns={ columns } 
                 dataSource={ activeUsersForPlay as User[] } 
                 style={{ paddingTop: 10 }}
                 loading={ activeUsersForPlay === null ? true : false }
             />
        </>
    )

    
}

export default Play;