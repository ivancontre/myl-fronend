import React, { FC, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { ZONE_NAMES } from '../constants';
import { DragItem } from '../pages/Match';

interface ZoneProps {
    children: ReactNode;
    className: string;
    title: string;
};

const Zone: FC<ZoneProps> = ({ children, className, title }) => {

    const [{isOver, canDrop}, drop] = useDrop({
        accept: 'card',
        drop: () => ({ name: title }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        // Override monitor.canDrop() function
        canDrop: (item: DragItem) => {
            const { DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE } = ZONE_NAMES;
            const { zone: currentZone } = item;

            return (currentZone === title) ||

                (currentZone === ATTACK_ZONE && title === DEFENSE_ZONE) ||
                (currentZone === ATTACK_ZONE && title === CEMETERY_ZONE) ||
                (currentZone === ATTACK_ZONE && title === EXILE_ZONE) ||
                (currentZone === ATTACK_ZONE && title === REMOVAL_ZONE) ||

                (currentZone === DEFENSE_ZONE && title === ATTACK_ZONE) ||
                (currentZone === DEFENSE_ZONE && title === CEMETERY_ZONE) ||
                (currentZone === DEFENSE_ZONE && title === EXILE_ZONE) ||
                (currentZone === DEFENSE_ZONE && title === REMOVAL_ZONE) ||                

                (currentZone === CEMETERY_ZONE && title === ATTACK_ZONE) ||
                (currentZone === CEMETERY_ZONE && title === DEFENSE_ZONE) ||
                (currentZone === CEMETERY_ZONE && title === EXILE_ZONE) ||
                (currentZone === CEMETERY_ZONE && title === REMOVAL_ZONE) ||

                (currentZone === EXILE_ZONE && title === ATTACK_ZONE) ||
                (currentZone === EXILE_ZONE && title === CEMETERY_ZONE) ||
                (currentZone === EXILE_ZONE && title === DEFENSE_ZONE) ||
                (currentZone === EXILE_ZONE && title === REMOVAL_ZONE) || 

                (currentZone === REMOVAL_ZONE && title === ATTACK_ZONE) ||
                (currentZone === REMOVAL_ZONE && title === CEMETERY_ZONE) ||
                (currentZone === REMOVAL_ZONE && title === DEFENSE_ZONE) ||
                (currentZone === REMOVAL_ZONE && title === EXILE_ZONE)
        }
    });

    const getBackgroundColor = () => {

        if (!isOver) {
            return '';
        }

        if (!canDrop) {
            return 'rgb(255,188,188)';
        }

        return 'rgb(188,251,255)';
        
    };

    return (
        <>
            <p>{ title }</p>
            <div ref={ drop } className={ className } style={ {backgroundColor: getBackgroundColor()} }>
                
                { children }

            </div>
        </>
    )
}

export default Zone;