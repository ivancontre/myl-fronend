import { Button, Input, Space, Tooltip } from 'antd'
import { Table } from "antd";
import React, { FC, useRef, useState } from 'react'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ColumnsType } from 'antd/es/table';

import 'antd/dist/antd.css';
import { useHistory, useLocation } from 'react-router';
import useHideMenu from '../../hooks/useHideMenu';

interface User {
    key: string;
    name: string;
    age: number
    address: string
}


const AdminCards: FC = () => {

    const history = useHistory();

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(false, path);

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

    const ref1 = useRef();
    const ref2 = useRef();
    const ref3 = useRef();

    const getColumnSearchProps = (dataIndex: string, ref: any) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={ ref }
                    placeholder={`Search ${dataIndex}`}
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


    const data: User[] = [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
        },
        {
          key: '2',
          name: 'Joe Black',
          age: 42,
          address: 'London No. 1 Lake Park',
        },
        {
          key: '3',
          name: 'Jim Green',
          age: 32,
          address: 'Sidney No. 1 Lake Park',
        },
        {
          key: '4',
          name: 'Jim Red',
          age: 32,
          address: 'London No. 2 Lake Park',
        },
    ];

    const columns: ColumnsType<User> = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: '30%',
          ...getColumnSearchProps('name', ref1),
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
          width: '20%',
          ...getColumnSearchProps('age', ref2),
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
          ...getColumnSearchProps('address', ref3),
          sorter: (a: any, b: any) => a.address.length - b.address.length,
          sortDirections: ['descend', 'ascend'],
        },
    ];

    const addNewCard = () => {
        history.push(`/cards-created/new`);
    };
    
    

    return (
        <>
            <Tooltip className="actions" title="Agregar carta">
                <Button onClick={ addNewCard } type="primary" shape="circle" icon={<PlusOutlined />} />
            </Tooltip>

            <Table<User> columns={ columns } dataSource={ data } style={{ paddingTop: 10 }}/>
        </>
    )
}

export default AdminCards;