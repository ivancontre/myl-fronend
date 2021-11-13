import { Button, message, Popover } from 'antd';
import React, { FC, ReactNode, useContext, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { CaretDownOutlined, CaretUpOutlined, MoreOutlined } from '@ant-design/icons';


import { ZONE_NAMES } from '../../constants';
import { SocketContext } from '../../context/SocketContext';
import { RootState } from '../../store';
import { changeMatch } from '../../store/match/action';
import { DragCard  } from '../../store/match/types';

interface ZoneProps {
    children: ReactNode;
    className: string;
    title: string;
    isOpponent?: boolean;
    withPopover?: boolean
};

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, HAND_ZONE, GOLDS_PAID_ZONE, UNPAID_GOLD_ZONE } = ZONE_NAMES;


const Zone: FC<ZoneProps> = ({ children, className, title, isOpponent }) => {

    const [visiblePopover, setVisiblePopover] = useState(false);

    const { match, opponentId } = useSelector((state: RootState) => state.match);

    const { socket } = useContext(SocketContext);

    const dispatch = useDispatch();

    const [{isOver, canDrop}, drop] = useDrop({
        accept: 'card',
        drop: () => ({ name: title.split(":")[0] }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        // Override monitor.canDrop() function
        canDrop: (item: DragCard) => {
            //const { zone: currentZone } = item;
            
            if (isOpponent) {
                return false;
            }

            return true;
            
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
            return 'rgb(255, 0, 0)';
        }

        return 'rgb(51, 0, 0)';
        
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

    const handleVisibleChangePopever = (visible: boolean) => {
        setVisiblePopover(visible); 
    };

    const sendToZone = (origin: string, destiny: string) => {
        const newMatch = { ...match };        
        if (!newMatch[origin].length) {
            message.warn(`No hay cartas en la zona de ${origin}` );
            setVisiblePopover(false);
            return;
        }

        newMatch[destiny] = [...newMatch[destiny], ...newMatch[origin]];
        newMatch[origin] = [];
        dispatch(changeMatch(newMatch));
        setVisiblePopover(false);
    };

    const showHandToOpponent = () => {
        if (!match[HAND_ZONE].length) {
            message.warn(`No hay cartas en la ${HAND_ZONE}` );
            setVisiblePopover(false);
            return;
        }

        socket?.emit('show-hand-to-opponent', {
            opponentId
        });
        setVisiblePopover(false);
    };

    const content = (
        <div>
            <Button type="link" onClick={ showHandToOpponent }>Mostrar mano</Button><br/>
            <Button type="link" onClick={ () => sendToZone(HAND_ZONE, CASTLE_ZONE) }>Devolver mano</Button>
        </div>        
    );

    return (
        <>
            <div ref={ drop } className={ `zone ${getClassAnimated()}`} style={ { backgroundColor: getBackgroundColor() } } >
                        
                    <div className={isOpponent ? "title-zone-opponent" : "title-zone"}>
                        <span>{ title }</span>

                        {
                            (!isOpponent && title.split(":")[0] === UNPAID_GOLD_ZONE) && (
                                <Button type="link" onClick={ () => sendToZone(UNPAID_GOLD_ZONE, GOLDS_PAID_ZONE)} icon={<CaretDownOutlined />} size="small" style={{ color: 'white', height: 15, width: 15, float: 'right' }} />
                            )
                        }

                        {
                            (!isOpponent && title.split(":")[0] === GOLDS_PAID_ZONE) && (
                                <Button type="link" onClick={ () => sendToZone(GOLDS_PAID_ZONE, UNPAID_GOLD_ZONE)} icon={<CaretUpOutlined />} size="small" style={{ color: 'white',height: 15, width: 15, float: 'right' }} />
                            )
                        }

                        {
                            (!isOpponent && title === ATTACK_ZONE) && (
                                <Button type="link" onClick={ () => sendToZone(ATTACK_ZONE, DEFENSE_ZONE)} icon={<CaretDownOutlined />} size="small" style={{ color: 'white', height: 15, width: 15, float: 'right' }} />
                            )
                        }

                        {
                            (!isOpponent && title === DEFENSE_ZONE) && (
                                <Button type="link" onClick={ () => sendToZone(DEFENSE_ZONE, ATTACK_ZONE)} icon={<CaretUpOutlined />} size="small" style={{ color: 'white', height: 15, width: 15, float: 'right' }} />
                            )
                        }

                        {
                            (!isOpponent && title === HAND_ZONE) && (
                                <Popover 
                                    placement="right" 
                                    trigger="click"
                                    content={ content }
                                    visible={ visiblePopover }
                                    onVisibleChange={ handleVisibleChangePopever }
                                >
                                    <Button type="link" icon={<MoreOutlined />} size="small" style={{ color: 'white', height: 15, width: 15, float: 'right' }} />
                                </Popover>
                                
                            )
                        }
                        
                    </div>

                    <div className={className}>
                        { children }
                    </div>
                    
            </div>      
            
        </>
    )
}

export default Zone;