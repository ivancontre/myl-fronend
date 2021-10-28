import { FC, useRef, useState } from 'react';
import { useDrag, useDrop, DropTargetMonitor, DropTargetOptions } from 'react-dnd';
import { XYCoord } from 'dnd-core';

import { Card } from '../../store/card/types';
import { DragCard  } from '../../store/match/types';

import { ZONE_NAMES } from "../../constants";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { changeMatch } from '../../store/match/action';
import { Button, Image, message, Popover } from 'antd';
import { openModalThrowXcards, openModalViewCastle } from '../../store/ui-modal/action';
import { shuffle } from '../../helpers/shuffle';
import { throwXcards } from '../../helpers/throwsCards';

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE } = ZONE_NAMES;

export interface CardProps {
    id?: string;
    index: number;
    moveCard?: (dragIndex: number, hoverIndex: number, zoneName: string) => void;
    zone: string;
    isOpponent?: boolean;
    card: Card;
};

const CardComponent: FC<CardProps> = ({ id, index, moveCard, zone, isOpponent, card }) => {

    const ref = useRef<HTMLInputElement>(null); 

    const dispatch = useDispatch();

    const { match } = useSelector((state: RootState) => state.match);
    const [visiblePopover, setVisiblePopover] = useState(false);
    const [animated, setAnimated] = useState(false);

    const changeCardZone = (item: DragCard, zoneName: string) => {
        
        if (item.zone === zoneName) {
            return;
        }

        const card = match[item.zone].find((card: Card, index2: number) => index2 === index) as Card;

        const newCards = { ...match };

        newCards[item.zone] = match[item.zone].filter((card: Card, index2: number) => index2 !== index);

        newCards[zoneName] = [...match[zoneName], card];

       dispatch(changeMatch(newCards));

    }

    const [{ handlerId }, drop] = useDrop({
        accept: 'card',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragCard, monitor: DropTargetMonitor) {
            
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
    
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
    
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
    
            // Get vertical middle
            const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
    
            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
    
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
        
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
    
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
        
            // Time to actually perform the action
            moveCard && moveCard(dragIndex, hoverIndex, item.zone);
        
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'card',
        item: () => {
            return { id, index, zone, ...card }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item: DragCard, monitor: DropTargetOptions) => {

            const dropResult = monitor.getDropResult();
            
            if (dropResult) {
                const { name } = dropResult;
                
                
                switch (name) {
                    case DEFENSE_ZONE:
                        changeCardZone(item, DEFENSE_ZONE);
                        break;
                    case ATTACK_ZONE:
                        changeCardZone(item, ATTACK_ZONE);                        
                        break;
                    case CEMETERY_ZONE:
                        changeCardZone(item, CEMETERY_ZONE);
                        break;
                    case EXILE_ZONE:
                        changeCardZone(item, EXILE_ZONE);
                        break;
                    case HAND_ZONE:
                        changeCardZone(item, HAND_ZONE);
                        break;
                    case REMOVAL_ZONE:
                        changeCardZone(item, REMOVAL_ZONE);
                        break;
                    case SUPPORT_ZONE:
                        changeCardZone(item, SUPPORT_ZONE);
                        break;
                    case CASTLE_ZONE:
                        changeCardZone(item, CASTLE_ZONE);
                        break;
                    default:
                        break;
                }
            }
        },
    });

    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));    
    
    const detail = (event: any, id:string) => {
        event.preventDefault();
        setVisiblePopover(true)
    };

    const handleVisibleChangePopever = (visible: boolean) => {
        setVisiblePopover(visible);
    };

    const shuffleCaslte = () => {

        setAnimated(true);

        const newMatch = shuffle(match, CASTLE_ZONE); 

        dispatch(changeMatch(newMatch));
        handleVisibleChangePopever(false);

        setTimeout(() => {
            setAnimated(false);
        }, 500);
    }

    const getHand = () => {
        if (!match[CASTLE_ZONE].length) {
            message.warning(`No hay cartas en ${CASTLE_ZONE}`);
            handleVisibleChangePopever(false);
            return;
        }

        if (match[HAND_ZONE].length) {
            message.warning(`Para obtener una nueva mano debes descartarte todas las cartas`);
            handleVisibleChangePopever(false);
            return;
        }

        const newMatch = throwXcards(8, match, CASTLE_ZONE, HAND_ZONE);

        dispatch(changeMatch(newMatch));
        handleVisibleChangePopever(false);
        
    };


    const content = (
        <div>
            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ shuffleCaslte }>Barajar</Button> <br/></div>
            )}

            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ () => getHand() }>Obtener mano</Button><br/></div>
            )}

            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ () => openViewCastleModal() }>Ver {zone}</Button><br/></div>
            )}
            
            
            {/* <Button type="link">Ver las primeras X cartas</Button> <br/>  */}

            {/* {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ () => throwXcards(8, CASTLE_ZONE, HAND_ZONE) }>Robar X cartas</Button> <br/></div>
            )} */}

            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ () => openlThrowCardsModal()}>Botar X cartas</Button> <br/></div>
            )}          
            
        </div>
    );

    const openlThrowCardsModal = () => {
        handleVisibleChangePopever(false);
        dispatch(openModalThrowXcards());
    }; 

    const openViewCastleModal = () => {
        handleVisibleChangePopever(false);
        dispatch(openModalViewCastle());
    };

    return (

        <>
            <Popover 
                placement="right" 
                content={ content }
                trigger="click"
                visible={ visiblePopover }
                onVisibleChange={ handleVisibleChangePopever }
            >
                
                <div ref={ ref }  style={{ opacity, borderRadius: 2 }} className={animated ? 'animate__animated animate__shakeY movable-item' : 'movable-item'} data-handler-id={ handlerId } onContextMenu={ (e: any) => detail(e, card.id as string) } >
                    { (zone === CASTLE_ZONE || (zone === HAND_ZONE && isOpponent)) ?
                        <img
                            width={ 50 }
                            height={ 75 }
                            alt={ card.name }
                            src={ "https://res.cloudinary.com/dfcm5wuuf/image/upload/v1635185102/reverso-carta_avpq6q.png" }
                            className={isOpponent ? 'img-180-deg' : ''}
                        />
                        : 
                        <Image
                            width={ 50 }
                            height={ 75 }
                            src={ card.img }
                            className={isOpponent ? 'img-180-deg' : ''}
                        />                        
                    }
                    
                </div>
            </Popover>
        </>
        
    )
}

export default CardComponent;