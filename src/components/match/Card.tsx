import { FC, useRef, useState } from 'react';
import { useDrag, useDrop, DropTargetMonitor, DropTargetOptions } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { ZONE_NAMES } from "../../constants";
import { DragCard, ICard } from '../../pages/MatchPage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { changeMatch } from '../../store/match/action';
import { Button, Popover } from 'antd';
import {
    ToolFilled
} from '@ant-design/icons';

export interface CardProps {
    id: string;
    text: string;
    index: number;
    moveCard?: (dragIndex: number, hoverIndex: number, zoneName: string) => void;
    zone: string;
    arms?: string[];
};

const Card: FC<CardProps> = ({ id, text, index, moveCard, zone, arms }) => {

    const ref = useRef<HTMLInputElement>(null); 

    const dispatch = useDispatch();

    const { match } = useSelector((state: RootState) => state.match);

    const changeCardZone = (item: DragCard, zoneName: string) => {
        
        if (item.zone === zoneName) {
            return;
        }

        const card = match[item.zone].find(card => card.id === item.id) as ICard;
        let newCards = { ...match };

        newCards[item.zone] = match[item.zone].filter(card => card.id !== item.id);

        newCards[zoneName] = [...match[zoneName], card];

        const { HAND_ZONE, EXILE_ZONE, CEMETERY_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, DEFENSE_ZONE, ATTACK_ZONE } = ZONE_NAMES;

        const sendArmsZones = [
            HAND_ZONE, 
            EXILE_ZONE, 
            CEMETERY_ZONE, 
            REMOVAL_ZONE
        ];

        if (item.arms && sendArmsZones.includes(zoneName) ) { // Si un aliado con armas es enviado a una de las zonas de sendArmsZones entonces sus armas también son enviadas
            const arms = newCards[SUPPORT_ZONE].filter(card => item.arms?.includes(card.id));
            newCards[SUPPORT_ZONE] = newCards[SUPPORT_ZONE].filter(card => !item.arms?.includes(card.id));
            newCards[zoneName] = [...newCards[zoneName], ...arms];
        }

        if (item.zone === SUPPORT_ZONE && sendArmsZones.includes(zoneName)) { // Si es un arma y está en la zona de apoyo, entonces se busca el aliado portador del arma para quitársela
            newCards[DEFENSE_ZONE] = newCards[DEFENSE_ZONE].map(card => {

                if (card.arms) {
                    const index = card.arms.indexOf(item.id);
                    if (index > -1) {
                        card.arms.splice(index, 1);
                    }
                }

                return card;
                
            });

            newCards[ATTACK_ZONE] = newCards[ATTACK_ZONE].map(card => {

                if (card.arms) {
                    const index = card.arms.indexOf(item.id);
                    if (index > -1) {
                        card.arms.splice(index, 1);
                    }
                }

                return card;
                
            });
        }

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
            return { id, index, zone, arms }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item: DragCard, monitor: DropTargetOptions) => {

            const dropResult = monitor.getDropResult();
            
            if (dropResult) {
                const { name } = dropResult;
                const { DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE } = ZONE_NAMES;
                
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
                    default:
                        break;
                }
            }
        },
    });

    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));

    const [visiblePopover, setVisiblePopover] = useState(false);
    
    const detail = (event: any) => {
        event.preventDefault()
        console.log('detalle', id);
        setVisiblePopover(true)
    }

    const handleVisibleChange = (visible: boolean) => {
        setVisiblePopover(visible)
    };


    const content = (
        <div>
            <p>{ id }</p>
        </div>
    );

    return (
            <Popover 
                placement="right" 
                content={ content } 
                title={ text }
                trigger="click"
                visible={ visiblePopover }
                onVisibleChange={ handleVisibleChange }
            >
                
                <div ref={ ref }  style={{ opacity }} className='movable-item' data-handler-id={ handlerId } onContextMenu={ detail } >
                    {
                        arms && arms.length > 0 && (<Button type="primary" shape="circle" size="small" icon={<ToolFilled />} /> ) 
                    }

                    { text }
                </div>
            </Popover>
        
        
        
    )
}

export default Card;