import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router';
import useHideMenu from '../../../hooks/useHideMenu';

const Decks: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(false, path);

    const history = useHistory();


    const handleNeDesk = () => {
        history.push(`/decks/new`);
    };


    return (
        <>
            <Tooltip className="actions" title="Crear nuevo Mazo">
                <Button onClick={ handleNeDesk } type="primary" shape="circle" icon={<PlusOutlined />} />
            </Tooltip>
            
        </>
    )
}

export default Decks;