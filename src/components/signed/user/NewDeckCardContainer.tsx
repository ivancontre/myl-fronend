import React, { FC, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface CardContainerProps {
    children: ReactNode;
    title: string;
};

const NewDeckCardContainer: FC<CardContainerProps> = ({ children, title }) => {

    const { selectMyCards } = useSelector((state: RootState) => state.cards);

    const [, drop] = useDrop({
        accept: 'card',
        drop: () => ({ name: title }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        canDrop: (item: any) => {

            if (selectMyCards.length >= 50 && title === 'my-cards') {
                return false;
            }

            return true;                
        }
        
    });

    return (
        <div ref={ drop } style={{ height: '100vh'}}>
            
            { children }

        </div>
    )
}

export default NewDeckCardContainer;