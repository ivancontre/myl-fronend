import { Image } from 'antd';
import React, { FC, useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor, DropTargetOptions } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { XYCoord } from 'dnd-core';
import { ZONE_NAMES } from "../../../constants";

import { RootState } from '../../../store';
import { Card } from '../../../store/card/types';
import { setViewCardsDestiny, setViewCardsOrigin } from '../../../store/match/action';

export interface NewDeckCardProps {
    id?: string;
    index: number;
    moveCard?: (dragIndex: number, hoverIndex: number, zoneName: string, isOrigin: boolean) => void;
    zone: string;
    card: Card;
    isOrigin: boolean;
    onlyRead?: boolean;
    isPrivate?: boolean;
    discard?:boolean;
};

interface DragCard extends Card {
    index: number;
    zone: string;
};

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, HAND_ZONE, UNPAID_GOLD_ZONE, GOLDS_PAID_ZONE, AUXILIARY_ZONE, EXILE_ZONE, REMOVAL_ZONE, CEMETERY_ZONE } = ZONE_NAMES;

const CardComponent: FC<NewDeckCardProps> = ({ id, index, moveCard, zone, card, isOrigin, onlyRead, isPrivate, discard }) => {   

    const dispatch = useDispatch();
    const ref = useRef<HTMLInputElement>(null); 

    const { viewCardsOrigin, viewCardsDestiny } = useSelector((state: RootState) => state.match);
    
    const changeCardZone = (item: DragCard, zoneName: string) => {
        // isOrigin true -> hacia destino
        // isOrigin false -> hacia origen 
        
        if (item.zone === zoneName) {
            return;
        }
        
        if (isOrigin) {

            const card = viewCardsOrigin.find((card: Card, index2: number) => index2 === index) as Card;
            card.isOpponent = true;
            const newOrigin = viewCardsOrigin.filter((card: Card, index2: number) => index2 !== index);
            const newDestiny = [...viewCardsDestiny, card];

            dispatch(setViewCardsOrigin(newOrigin));
            dispatch(setViewCardsDestiny(newDestiny));

        } else {
            const card = viewCardsDestiny.find((card: Card, index2: number) => index2 === index) as Card;
            const newDestiny = viewCardsDestiny.filter((card: Card, index2: number) => index2 !== index);
            const newOrigin = [...viewCardsOrigin, card];

            dispatch(setViewCardsOrigin(newOrigin));
            dispatch(setViewCardsDestiny(newDestiny));
        }

    };

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
            moveCard && moveCard(dragIndex, hoverIndex, item.zone, isOrigin);
        
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
                    case CASTLE_ZONE:
                        changeCardZone(item, CASTLE_ZONE);
                        break;
                    case HAND_ZONE:
                        changeCardZone(item, HAND_ZONE);                        
                        break;
                    case DEFENSE_ZONE:
                        changeCardZone(item, DEFENSE_ZONE);                        
                        break;
                    case ATTACK_ZONE:
                        changeCardZone(item, ATTACK_ZONE);                        
                        break;
                    case GOLDS_PAID_ZONE:
                        changeCardZone(item, GOLDS_PAID_ZONE);                        
                        break;
                    case UNPAID_GOLD_ZONE:
                        changeCardZone(item, UNPAID_GOLD_ZONE);                        
                        break;
                    case AUXILIARY_ZONE:
                        changeCardZone(item, AUXILIARY_ZONE);
                        break;
                    case EXILE_ZONE:
                        changeCardZone(item, EXILE_ZONE);
                        break;
                    case REMOVAL_ZONE:
                        changeCardZone(item, REMOVAL_ZONE);
                        break;
                    case CEMETERY_ZONE:
                        changeCardZone(item, CEMETERY_ZONE);
                        break;
                    default:
                        break;
                }
            }
        },
    });

    const opacity = isDragging ? 0.4 : 1;

    if (!onlyRead) drag(drop(ref));

    return (
        <span ref={ ref } style={{ opacity, padding: 3 }} data-handler-id={ handlerId } >
            
            <Image
                width={ 65 }
                className={discard ? "ant-image-img-custom img-180-deg" : "ant-image-img-custom"}
                src={ !isPrivate ? card.img : 'https://res.cloudinary.com/dcx2yyhxg/image/upload/v1641388971/assets/reverso-carta_avpq6q_1_x4rzt0.jpg'}
            />

        </span>
    )
}

export default CardComponent;