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
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { Message } from '../../store/chat/types';

interface ZoneProps {
    children: ReactNode;
    className: string;
    title: string;
    isOpponent?: boolean;
    withCount?: boolean
};

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, HAND_ZONE, GOLDS_PAID_ZONE, UNPAID_GOLD_ZONE } = ZONE_NAMES;


const Zone: FC<ZoneProps> = ({ children, className, title, isOpponent, withCount }) => {

    const [visiblePopover, setVisiblePopover] = useState(false);

    const { match, matchId, opponentMatch } = useSelector((state: RootState) => state.match);
    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);

    const { socket } = useContext(SocketContext);

    const dispatch = useDispatch();

    const [{isOver, canDrop}, drop] = useDrop({
        accept: 'card',
        drop: () => ({ name: title }),
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

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Moviendo todas las cartas de "${origin}" a "${destiny}"`,
            isAction: true
        };

        socket?.emit( 'personal-message', {
            matchId,
            message: newMessage
        }, (data: any) => {
            newMessage.date = data;
            dispatch(addMessageAction(newMessage));
            scrollToBottom('messages');
        });


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
            matchId
        });
        setVisiblePopover(false);
    };

    const content = (
        <div>
            <Button type="link" onClick={ showHandToOpponent }>Mostrar mano</Button><br/>
            <Button type="link" onClick={ () => sendToZone(HAND_ZONE, CASTLE_ZONE) }>Devolver mano</Button>
        </div>        
    );

    const getTitle = () => {
        if (withCount) {
            if (isOpponent) {
                return `${title}: ${opponentMatch[title] ? opponentMatch[title].length : '0'}`;
            } 

            return `${title}: ${match[title] ? match[title].length : '0'}`;
        } else {
            return title;
        }
    };

    return (
        <>
            <div ref={ drop } className={ `zone ${getClassAnimated()}`} style={ { backgroundColor: getBackgroundColor() } } >
                
                        
                    <div className={isOpponent ? "title-zone-opponent" : "title-zone"}>
                        <span>{ getTitle() }</span>

                        {
                            (!isOpponent && title === UNPAID_GOLD_ZONE) && (
                                <Button type="link" onClick={ () => sendToZone(UNPAID_GOLD_ZONE, GOLDS_PAID_ZONE)} icon={<CaretUpOutlined />} size="small" style={{ color: 'white', height: 15, width: 15, float: 'right' }} />
                            )
                        }

                        {
                            (!isOpponent && title === GOLDS_PAID_ZONE) && (
                                <Button type="link" onClick={ () => sendToZone(GOLDS_PAID_ZONE, UNPAID_GOLD_ZONE)} icon={<CaretDownOutlined />} size="small" style={{ color: 'white',height: 15, width: 15, float: 'right' }} />
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