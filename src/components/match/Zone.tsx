import { Button, message, Popover } from 'antd';
import React, { FC, ReactNode, useContext, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { CaretDownOutlined, CaretUpOutlined, MoreOutlined, ReloadOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';


import { ZONE_NAMES } from '../../constants';
import { SocketContext } from '../../context/SocketContext';
import { RootState } from '../../store';
import { changeMatch, changOpponenteMatch } from '../../store/match/action';
import { DragCard  } from '../../store/match/types';
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { Message } from '../../store/chat/types';
import { shuffle } from '../../helpers/shuffle';

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
    const [visibleButtonPlayOpenHand, setVisibleButtonPlayOpenHand] = useState(false);

    const { match, matchId, opponentMatch, playOpenHand } = useSelector((state: RootState) => state.match);
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

    const sendMessage = (text: string) => {
        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text,
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
    };

    const sendToZone = (origin: string, destiny: string) => {

        sendMessage(`Moviendo ${ destiny === CASTLE_ZONE ? 'y barajando' : '' } todas las cartas de <strong>${origin}</strong> a <strong>${destiny}</strong>`);

        let newMatch = { ...match };        
        if (!newMatch[origin].length) {
            message.warn(`No hay cartas en la zona de ${origin}` );
            setVisiblePopover(false);
            return;
        }    

        newMatch[destiny] = [...newMatch[destiny], ...newMatch[origin]];

        if (destiny === CASTLE_ZONE) {
            newMatch = shuffle(newMatch, CASTLE_ZONE);
        }

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

    const onClickPlayOpenHand = (open: boolean) => {
        setVisibleButtonPlayOpenHand(open);

        sendMessage(`Jugando con la mano ${open ? 'descubierta' : 'cubierta'}`)
        socket?.emit('play-open-hand', {
            matchId,
            playOpenHand: open
        });

        setVisiblePopover(false);
    };

    const content = (
        <div>
            <Button type="link" onClick={ showHandToOpponent }>Mostrar mano</Button><br/>
            <Button type="link" onClick={ () => sendToZone(HAND_ZONE, CASTLE_ZONE) }>Devolver mano</Button><br/>
            {
                !visibleButtonPlayOpenHand ? 
                (
                    <Button type="link" onClick={ () => onClickPlayOpenHand(true) }>Jugar mano descubierta</Button>
                    
                )
                :
                (
                    <Button type="link" onClick={ () => onClickPlayOpenHand(false) }>Jugar mano cubierta</Button>
                )
            }
             
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

    const reloadOpponentMatch = () => {
        socket?.emit('opponent-match-not-charged', {
            matchId
        }, (data: any) => {
            dispatch(changOpponenteMatch(data));
        });
    };

    return (
        <>
            <div ref={ drop } className={ `zone ${getClassAnimated()}`} style={ { backgroundColor: getBackgroundColor() } } >
                    
                        
                    <div className={isOpponent ? "title-zone-opponent" : "title-zone"}>

                        {
                            (!isOpponent && title === HAND_ZONE && (
                                visibleButtonPlayOpenHand ? <EyeOutlined style={{ color: 'white', float: 'left', marginTop: 3, marginLeft: 2}} /> : <EyeInvisibleOutlined style={{ color: 'white', float: 'left', marginTop: 3, marginLeft: 2}} />
                            ))
                        }

                        {
                            (isOpponent && title === HAND_ZONE && (
                                playOpenHand ? <EyeOutlined style={{ color: 'white', float: 'left', marginTop: 3, marginLeft: 2}} /> : <EyeInvisibleOutlined style={{ color: 'white', float: 'left', marginTop: 3, marginLeft: 2}} />
                            ))
                        }

                        <span>{ getTitle() }</span>

                        {
                            (!isOpponent && title === UNPAID_GOLD_ZONE) && (
                                <Button type="link" onClick={ () => sendToZone(UNPAID_GOLD_ZONE, GOLDS_PAID_ZONE)} icon={<CaretUpOutlined />} size="small" className="icon-zone-action" />
                            )
                        }

                        {
                            (!isOpponent && title === GOLDS_PAID_ZONE) && (
                                <Button type="link" onClick={ () => sendToZone(GOLDS_PAID_ZONE, UNPAID_GOLD_ZONE)} icon={<CaretDownOutlined />} size="small" className="icon-zone-action" />
                            )
                        }

                        {
                            (!isOpponent && title === ATTACK_ZONE) && (
                                <Button type="link" onClick={ () => sendToZone(ATTACK_ZONE, DEFENSE_ZONE)} icon={<CaretDownOutlined />} size="small" className="icon-zone-action" />
                            )
                        }

                        {
                            (!isOpponent && title === DEFENSE_ZONE) && (
                                <Button type="link" onClick={ () => sendToZone(DEFENSE_ZONE, ATTACK_ZONE)} icon={<CaretUpOutlined />} size="small" className="icon-zone-action" />
                            )
                        }

                        {
                            (isOpponent && title === CASTLE_ZONE && Object.keys(opponentMatch).length === 0) && (
                                <Button type="link" onClick={ reloadOpponentMatch } icon={<ReloadOutlined />} size="small" className="icon-zone-action" />
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
                                    <Button type="link" icon={<MoreOutlined />} size="small" className="icon-zone-action" />
                                </Popover>
                                
                            )
                        }
                        
                    </div>
                    
                    <div className={className}>
                        { isOpponent && title === CASTLE_ZONE && Object.keys(opponentMatch).length === 0 ? ' not loaded' : children }
                    </div>
                    
            </div>      
            
        </>
    )
}

export default Zone;