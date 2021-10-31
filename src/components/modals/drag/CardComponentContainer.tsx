import React, { FC, ReactNode } from 'react';
import { useDrop } from 'react-dnd';

interface CardContainerProps {
    children: ReactNode;
    title: string;
};

const CardComponentContainer: FC<CardContainerProps> = ({ children, title }) => {

    const [{isOver, canDrop}, drop] = useDrop({
        accept: 'card',
        drop: () => ({ name: title }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        canDrop: (item: any) => {

           return true;                
        }
        
    });

    const getBackgroundColor = () => {

        if (!isOver) {
            return '';
        }

        if (!canDrop) {
            return 'rgb(0,0,0)';
        }

        return 'rgb(46,44,44)';
        
    };

    const getClassAnimated = () => {
        
        if (!isOver) {
            return '';
        }

        if (!canDrop) {
            return '';
        }

        return 'animate__animated animate__pulse';
    }

    return (
        <div ref={ drop } style={ { backgroundColor: getBackgroundColor() } } className={`view-moda-origin ${ getClassAnimated() }`} >
            
            { children }

        </div>
    )
}

export default CardComponentContainer;