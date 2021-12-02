import { useContext, useEffect } from 'react'
import { MenuContext } from '../context/MenuContext';

const useHideMenu = (hide: boolean, menuOption: string, collapse?: boolean) => {

    const { showMenu, hideMenu, setOptionMenu, collapsedOn, collapsedOff } = useContext(MenuContext);

    useEffect(() => {

        hide ? hideMenu(): showMenu();
    
    }, [hide, showMenu, hideMenu]);

    useEffect(() => {

        collapse ? collapsedOn(): collapsedOff();
    
    }, [collapse, collapsedOn, collapsedOff]);

    useEffect(() => {

        setOptionMenu(menuOption);
    
    }, [menuOption, setOptionMenu]);
  
}

export default useHideMenu;