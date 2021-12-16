
import React, { createContext, useState } from 'react';

type Props = {
    children: React.ReactNode;
};

type GlobalContentUI = {
    hiddenMenu: boolean;
    showMenu: Function;
    hideMenu: Function;

    loading: boolean;
    showLoading: Function;
    hideLoading: Function;

    collapsedMenu: boolean;
    collapsedOn: Function;
    collapsedOff: Function;

    selectedOption: string;
    setOptionMenu: Function;
};

export const MenuContext = createContext<GlobalContentUI>({
    hiddenMenu: false,
    showMenu: () => {},
    hideMenu: () => {},

    loading: false,
    showLoading: () => {},
    hideLoading: () => {},

    collapsedMenu: false,
    collapsedOn:  () => {},
    collapsedOff:  () => {},

    selectedOption: '',
    setOptionMenu: () => {},
});

export const MenuProvider = ({ children }: Props) => {

    const [hiddenMenu, setHiddenMenu] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [collapsedMenu, setCollapsedMenu] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>('');

    const showMenu = () => {
        setHiddenMenu(false);
    };

    const hideMenu = () => {
        setHiddenMenu(true);
    };

    const showLoading = () => {
        setLoading(true);
    };

    const hideLoading = () => {
        setLoading(false);
    };

    const collapsedOn = () => {
        setCollapsedMenu(true);
    };

    const collapsedOff = () => {
        setCollapsedMenu(false);
    };

    const setOptionMenu = (option: string) => {
        setSelectedOption(option)
    }

    return (
        <MenuContext.Provider value={ { hiddenMenu, showMenu, hideMenu, selectedOption, setOptionMenu, collapsedMenu, collapsedOn, collapsedOff, loading, showLoading, hideLoading } }>
            { children }
        </MenuContext.Provider>
    )
};