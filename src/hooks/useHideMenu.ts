import { useContext, useEffect } from 'react'
import { MenuContext } from '../context/MenuContext';

const useHideMenu = (hide: boolean, menuOption: string) => {

    const { showMenu, hideMenu, setOptionMenu } = useContext(MenuContext);

    useEffect(() => {

        hide ? hideMenu(): showMenu();
    
    }, [hide, showMenu, hideMenu]);

    useEffect(() => {

        setOptionMenu(menuOption);
    
    }, [menuOption, setOptionMenu]);
  
}

export default useHideMenu;