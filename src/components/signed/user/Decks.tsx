import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Button, Input, Popconfirm, Space, Tooltip, Table, Alert } from 'antd';
import Highlighter from 'react-highlight-words';
import { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router';
import useHideMenu from '../../../hooks/useHideMenu';
import { Link } from 'react-router-dom';
import { Deck } from '../../../store/deck/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { resetDeckUpdating, startDeleteDeck, startLoadDeck, startSetDefaultDeck } from '../../../store/deck/action';
import { resetCardUpdating } from '../../../store/card/action';
import { MenuContext } from '../../../context/MenuContext';

const Decks: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    const { collapsedMenu } = useContext(MenuContext);

    useHideMenu(false, path, collapsedMenu);

    const history = useHistory();

    const dispatch = useDispatch();

    const { decks, deckDefault } = useSelector((state: RootState) => state.decks);

    const handleNewDesk = () => {
        history.push(`/decks/new`);
    };

    useEffect(() => {
        dispatch(startLoadDeck());
        dispatch(resetDeckUpdating());
        dispatch(resetCardUpdating());
    }, [dispatch]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

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

    const handleDelete = (deckId?: string) => {
        dispatch(startDeleteDeck(deckId as string));
    };

    const ref0 = useRef();

    const columns: ColumnsType<Deck> = [
        
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            width: '90%',
            ...getColumnSearchProps('name', ref0),
            sorter: (a: any, b: any) => { 
                if(a.name < b.name) { return -1; }
                if(a.name > b.name) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            render: (text, row) => <Link to={`/decks/${row.id}/edit`}>{ text }</Link>  
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            render: (text, row) => (
                <Popconfirm title="¿Está seguro?" onConfirm={() => handleDelete(row.id)}>
                    <Link to="">Eliminar</Link>     
                </Popconfirm>
            ),
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[]) => {
            console.log(`selectedRowKeys1: ${selectedRowKeys}`);
            const id = selectedRowKeys.toString();
            dispatch(startSetDefaultDeck(id));
        }
    };

    return (
        <>
            <Tooltip title="Crear nuevo Mazo">
                <Button onClick={ handleNewDesk } type="primary" shape="circle" icon={<PlusOutlined />} />
            </Tooltip>

            <Alert style={{marginTop: 10}} message="En esta sección podrás crear tus mazos. Si no tiene al menos un mazo creado no podrás jugar" type="info" showIcon/>

            <Table<Deck>
                rowSelection={{
                    type: 'radio',
                    ...rowSelection,
                    selectedRowKeys: [deckDefault?.id as string]
                }}
                pagination={{ defaultPageSize: 15 }}
                rowKey="id" 
                columns={ columns } 
                dataSource={ decks } 
                style={{ paddingTop: 10 }}
                loading={ decks.length > 0 ? false : true }
            />
            
        </>
    )
}

export default Decks;