import React, { FC, useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { MenuContext } from '../../../context/MenuContext';
import useHideMenu from '../../../hooks/useHideMenu';
import { resetCardUpdating, resetMySelection } from '../../../store/card/action';

const Users: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    const { collapsedMenu } = useContext(MenuContext);

    useHideMenu(false, path, collapsedMenu);

    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(resetCardUpdating());
        dispatch(resetMySelection());

    }, [dispatch]);

    return (
        <div>
            Users
        </div>
    )
}

export default Users;