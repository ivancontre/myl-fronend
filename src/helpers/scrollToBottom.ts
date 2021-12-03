import { animateScroll } from 'react-scroll';

export const scrollToBottom = ( id: string ) => {
    
    animateScroll.scrollToBottom({
        containerId: id,
        duration: 0
    });

};