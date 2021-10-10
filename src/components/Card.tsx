import { FC, useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor, DropTargetOptions } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { ZONE_NAMES } from "../constants";
import { Dictionary, DragItem, Item } from '../pages/Match';

export interface CardProps {
    id: any;
    text: string;
    index: number;
    moveCard?: (dragIndex: number, hoverIndex: number, zoneName: string) => void;
    zone: string;
    setCards?: Function;
};

const Card: FC<CardProps> = ({ id, text, index, moveCard, zone, setCards }) => {

    const ref = useRef<HTMLInputElement>(null);

    const changeCardZone = (item: DragItem, zoneName: string) => {
        
        if (item.zone === zoneName) {
            return;
        }

        setCards && setCards((cards: Dictionary<Item[] | []>) => {
            
            const card = cards[item.zone].find(card => card.id === item.id) as Item;
            let newCards = {...cards};

            newCards[item.zone] = cards[item.zone].filter(card => card.id !== item.id);

            newCards[zoneName] = [...cards[zoneName], card];        

            return newCards;

        });

    }

    const [{ handlerId }, drop] = useDrop({
        accept: 'card',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor: DropTargetMonitor) {
            
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
            return { id, index, zone }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item: DragItem, monitor: DropTargetOptions) => {

            const dropResult = monitor.getDropResult();
            
            if (dropResult) {
                const { name } = dropResult;
                const { DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE } = ZONE_NAMES;
                
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
                    case REMOVAL_ZONE:
                        changeCardZone(item, REMOVAL_ZONE);
                        break;
                    default:
                        break;
                }
            }
        },
    });

    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));   
    
    const detail = () => {
        console.log('detalle', id)
    }

    return (

        <div ref={ ref } style={{ opacity }} className='movable-item' data-handler-id={ handlerId } onDoubleClick={ detail} >
            { text }
        </div>
        


        
    )
}

export default Card;