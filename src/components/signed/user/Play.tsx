import { Alert, Button, Input, Modal, Space, Table, Tag, Select, message } from 'antd';
import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Highlighter from 'react-highlight-words';
import { useLocation } from 'react-router';
import { SearchOutlined } from '@ant-design/icons';
import useHideMenu from '../../../hooks/useHideMenu';
import { RootState } from '../../../store';
import { resetCardUpdating, resetMySelection } from '../../../store/card/action';
import { User } from '../../../store/auth/types';
import { ColumnsType } from 'antd/lib/table';
import { SocketContext } from '../../../context/SocketContext';
import { startLoadDeck } from '../../../store/deck/action';
import { matchSetDeck } from '../../../store/match/action';
import { Deck } from '../../../store/deck/types';

const Play: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(false, path);

    const dispatch = useDispatch();

    const { activeUsers, deckByPlay } = useSelector((state: RootState) => state.match);
    const { decks } = useSelector((state: RootState) => state.decks);   

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const { online, socket } = useContext(SocketContext);

    const ref0 = useRef();

    useEffect(() => {
        
        dispatch(resetCardUpdating());
        dispatch(resetMySelection());

    }, [dispatch]);

    useEffect(() => {
        if (decks.length === 0) { 
            dispatch(startLoadDeck());
        }

    }, [dispatch, decks.length]);

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
    
    const countDown = (username: string) => {
        let secondsToGo = 10;
        const modal = Modal.info({
            title: 'Esperando confirmación',
            content: `El usuario ${username.toUpperCase()} tiene ${secondsToGo} segundos para confirmar`,
            okButtonProps: { hidden: true },
        });
        
        const timer = setInterval(() => {
            secondsToGo -= 1;
            modal.update({
                content: `El usuario ${username.toUpperCase()} tiene ${secondsToGo} segundos para confirmar`,
            });
        }, 1000);

        setTimeout( () => {
            clearInterval(timer);
        }, secondsToGo * 1000);

        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1050);
    };

    const invite = (opponentId: string, username: string) => {

        if (!deckByPlay) {
            message.warn('Antes de invitar tiene que seleccionar el mazo con el que deseas jugar');
            return;
        }

        socket?.emit('invite', {
            opponentId
        });
        
        countDown(username);
    };

    const handleSelectDeck = (deckId: string) => {

        const deck = decks.find(deck => deck.id === deckId) as Deck;

        dispatch(matchSetDeck(deck))
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

                if (!row.playing && row.online) {
                    return <Button onClick={ () => invite(row.id, row.username) } ghost>Invitar a jugar</Button>
                }
            },
        },
    ];

    return (
        <>
             <Alert style={{ width: "100%", marginBottom: 10 }} message="En esta sección podrás elegir contra quién jugar. Sólo aparecen los usuarios que al menos tiene un mazo creado" type="info" showIcon/>
 
            <Select
                placeholder="Seleccione el mazo con el que quiere jugar"
                style={{ width: "100%"}}
                onChange={ handleSelectDeck }   
            >

                {
                    decks.length > 0 && decks.map(deck => (
                        <Select.Option key={ deck.id } value={ deck.id as string }>{ deck.name }</Select.Option>
                    ))
                }
            </Select>
             <Table<User>
                 pagination={{ defaultPageSize: 15 }}
                 rowKey="id" 
                 columns={ columns } 
                 dataSource={ activeUsers } 
                 style={{ paddingTop: 10 }}
             />
        </>
    )

    
}

export default Play;