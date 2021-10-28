import { Tooltip } from 'antd';
import React, { FC, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { ZONE_NAMES } from '../../constants';
import { DragCard  } from '../../store/match/types';

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
        canDrop: (item: DragCard) => {
            const { DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE } = ZONE_NAMES;
            const { zone: currentZone } = item;

            return true
            
                /*(currentZone === title) ||

                (currentZone === ATTACK_ZONE && title === DEFENSE_ZONE) ||
                (currentZone === ATTACK_ZONE && title === CEMETERY_ZONE) ||
                (currentZone === ATTACK_ZONE && title === EXILE_ZONE) ||
                (currentZone === ATTACK_ZONE && title === HAND_ZONE) ||
                (currentZone === ATTACK_ZONE && title === REMOVAL_ZONE) ||
                (currentZone === ATTACK_ZONE && title === SUPPORT_ZONE) ||

                (currentZone === DEFENSE_ZONE && title === ATTACK_ZONE) ||
                (currentZone === DEFENSE_ZONE && title === CEMETERY_ZONE) ||
                (currentZone === DEFENSE_ZONE && title === EXILE_ZONE) ||
                (currentZone === DEFENSE_ZONE && title === HAND_ZONE) ||
                (currentZone === DEFENSE_ZONE && title === REMOVAL_ZONE) ||     
                (currentZone === DEFENSE_ZONE && title === SUPPORT_ZONE) ||             

                (currentZone === CEMETERY_ZONE && title === ATTACK_ZONE) ||
                (currentZone === CEMETERY_ZONE && title === DEFENSE_ZONE) ||
                (currentZone === CEMETERY_ZONE && title === EXILE_ZONE) ||
                (currentZone === CEMETERY_ZONE && title === HAND_ZONE) ||
                (currentZone === CEMETERY_ZONE && title === REMOVAL_ZONE) ||
                (currentZone === CEMETERY_ZONE && title === SUPPORT_ZONE) ||

                (currentZone === EXILE_ZONE && title === ATTACK_ZONE) ||
                (currentZone === EXILE_ZONE && title === CEMETERY_ZONE) ||
                (currentZone === EXILE_ZONE && title === DEFENSE_ZONE) ||
                (currentZone === EXILE_ZONE && title === HAND_ZONE) ||
                (currentZone === EXILE_ZONE && title === REMOVAL_ZONE) || 
                (currentZone === EXILE_ZONE && title === SUPPORT_ZONE) || 

                (currentZone === REMOVAL_ZONE && title === ATTACK_ZONE) ||
                (currentZone === REMOVAL_ZONE && title === CEMETERY_ZONE) ||
                (currentZone === REMOVAL_ZONE && title === DEFENSE_ZONE) ||
                (currentZone === REMOVAL_ZONE && title === EXILE_ZONE) ||
                (currentZone === REMOVAL_ZONE && title === HAND_ZONE) ||
                (currentZone === REMOVAL_ZONE && title === SUPPORT_ZONE) ||

                (currentZone === SUPPORT_ZONE && title === ATTACK_ZONE) ||
                (currentZone === SUPPORT_ZONE && title === CEMETERY_ZONE) ||
                (currentZone === SUPPORT_ZONE && title === DEFENSE_ZONE) ||
                (currentZone === SUPPORT_ZONE && title === EXILE_ZONE) ||
                (currentZone === SUPPORT_ZONE && title === HAND_ZONE) ||
                (currentZone === SUPPORT_ZONE && title === REMOVAL_ZONE) ||

                (currentZone === HAND_ZONE && title === ATTACK_ZONE) ||
                (currentZone === HAND_ZONE && title === CEMETERY_ZONE) ||
                (currentZone === HAND_ZONE && title === DEFENSE_ZONE) ||
                (currentZone === HAND_ZONE && title === EXILE_ZONE) ||
                (currentZone === HAND_ZONE && title === REMOVAL_ZONE) ||
                (currentZone === HAND_ZONE && title === SUPPORT_ZONE)*/
                
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
        <>
            <Tooltip title={ title }>
                <div ref={ drop } className={ className + ' ' + getClassAnimated()} style={ { backgroundColor: getBackgroundColor() } }>
                    
                    { children }

                </div>
            </Tooltip>
            
        </>
    )
}

export default Zone;