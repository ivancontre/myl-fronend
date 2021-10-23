import { Image } from 'antd';
import React, { FC, useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor, DropTargetOptions } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { XYCoord } from 'dnd-core';
import { RootState } from '../../../store';
import { loadCardsByEdition, loadCardsMySelection } from '../../../store/card/action';
import { Card } from '../../../store/card/types';

export interface NewDeckCardProps {
    id?: string;
    index: number;
    moveCard?: (dragIndex: number, hoverIndex: number, zoneName: string) => void;
    zone: string;
    card: Card
};

interface DragCard extends Card {
    index: number;
    zone: string;
};


const NewDeckCard: FC<NewDeckCardProps> = ({ id, index, moveCard, zone, card }) => {   

    const dispatch = useDispatch();
    const ref = useRef<HTMLInputElement>(null); 

    const { cardsByEdition, selectMyCards } = useSelector((state: RootState) => state.cards);
    
    const changeCardZone = (item: DragCard, zoneName: string) => {
        // zoneName es el destino

        if (item.zone === zoneName) {
            return;
        }

        if (zoneName === 'my-cards') {
            //mover hacia "my-cards"
            const card = cardsByEdition.find((card: Card) => card.id === item.id) as Card;

            const newCardsToMySelection = [...selectMyCards, card];   
            
            dispatch(loadCardsMySelection(newCardsToMySelection));

        } else { // cards

            const editionId = cardsByEdition[0]?.edition;
            const card = selectMyCards[index];

            if (card.edition === editionId) {
                const existCardInCards = cardsByEdition.find(c => c.id === card.id);

                if (!existCardInCards) {
                    dispatch(loadCardsByEdition([...cardsByEdition, card]));
                }
            }

            selectMyCards.splice(index, 1);

            dispatch(loadCardsMySelection(selectMyCards));

        }
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
                    case 'cards':
                        changeCardZone(item, 'cards');
                        break;
                    case 'my-cards':
                        changeCardZone(item, 'my-cards');                        
                        break;
                    default:
                        break;
                }
            }
        },
    });

    const opacity = isDragging ? 0.4 : 1;

    if (zone === 'my-cards') {
        drag(drop(ref));
    } else {
        drag(ref);
    }    

    return (
        <span ref={ ref } style={{ opacity, padding: 3 }} data-handler-id={ handlerId } >
            
            <Image
                width={ 45 }
                src={ card.img }
            />

        </span>
    )
}

export default NewDeckCard;