import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, Input, Popconfirm, Space, Tooltip, Table } from 'antd';

import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ColumnsType } from 'antd/es/table';

import { useHistory, useLocation } from 'react-router';
import useHideMenu from '../../../hooks/useHideMenu';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../../store/card/types';
import { RootState } from '../../../store';
import { resetCardUpdating, resetMySelection } from '../../../store/card/action';
import { Link } from 'react-router-dom';

const Cards: FC = () => {

    const history = useHistory();

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(false, path);

    const dispatch = useDispatch();

    const { cards } = useSelector((state: RootState) => state.cards);

    useEffect(() => {
        
        dispatch(resetCardUpdating());
        dispatch(resetMySelection());

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

    const handleDelete = (id?: string) => {

    };

    const ref0 = useRef();
    const ref1 = useRef();
    const ref2 = useRef();
    const ref3 = useRef();
    const ref4 = useRef();
    //const ref5 = useRef();

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

    const columns: ColumnsType<Card> = [
        {
            title: 'Número',
            dataIndex: 'num',
            key: 'num',
            width: '5%',
            ...getColumnSearchProps('num', ref0),
            sorter: (a: any, b: any) => {
                let newA = a.num;
                let newB = b.num;

                if (!a.num) newA = 0;
                if (!b.num) newB = 0;

                return newA - newB;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name', ref1),
            sorter: (a: any, b: any) => { 
                if(a.name < b.name) { return -1; }
                if(a.name > b.name) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            render: (text, row) => <Link to={`/cards/${row.id}/edit`}>{ text }</Link>           
            
        },
        {
            title: 'Edición',
            dataIndex: 'edition',
            key: 'edition',
            width: '20%',
            ...getColumnSearchProps('edition', ref2),
            sortDirections: ['descend', 'ascend'],
            sorter: (a: any, b: any) => { 
                if(a.edition < b.edition) { return -1; }
                if(a.edition > b.edition) { return 1; }
                return 0;
            },
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            width: '20%',
            ...getColumnSearchProps('type', ref3),
            sortDirections: ['descend', 'ascend'],
            sorter: (a: any, b: any) => { 
                if(a.type < b.type) { return -1; }
                if(a.type > b.type) { return 1; }
                return 0;
            },
        },
        {
            title: 'Raza',
            dataIndex: 'race',
            key: 'race',
            width: '20%',
            ...getColumnSearchProps('race', ref3),
            sortDirections: ['descend', 'ascend'],
            sorter: (a: any, b: any) => { 
                if(a.race < b.race) { return -1; }
                if(a.race > b.race) { return 1; }
                return 0;
            },
        },
        {
            title: 'Frecuencia',
            dataIndex: 'frecuency',
            key: 'frecuency',
            ...getColumnSearchProps('frecuency', ref4),
            sortDirections: ['descend', 'ascend'],
            sorter: (a: any, b: any) => { 
                if(a.frecuency < b.frecuency) { return -1; }
                if(a.frecuency > b.frecuency) { return 1; }
                return 0;
            },
            
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

    const addNewCard = () => {
        history.push(`/cards/new`);
    };

    return (
        <>
            <Tooltip title="Agregar carta">
                <Button onClick={ addNewCard } type="primary" shape="circle" icon={<PlusOutlined />} />
            </Tooltip>

            <Table<Card>
                pagination={{ defaultPageSize: 15 }}
                rowKey="id" 
                columns={ columns } 
                dataSource={ cards } 
                style={{ paddingTop: 10 }}
                loading={ cards.length > 0 ? false : true }
            />
        </>
    )
}

export default Cards;