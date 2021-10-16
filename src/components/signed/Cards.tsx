import React from 'react'
import { useLocation } from 'react-router';
import useHideMenu from '../../hooks/useHideMenu';

const Cards = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(false, path);


    return (
        <div>
            Cards
        </div>
    )
}

export default Cards
