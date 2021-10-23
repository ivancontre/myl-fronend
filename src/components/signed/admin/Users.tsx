import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import useHideMenu from '../../../hooks/useHideMenu';
import { resetCardUpdating, resetMySelection } from '../../../store/card/action';

const Users: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(false, path);

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