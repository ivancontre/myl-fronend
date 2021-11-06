import { FC, useContext, useRef, useState } from 'react';
import { useDrag, useDrop, DropTargetMonitor, DropTargetOptions } from 'react-dnd';
import { XYCoord } from 'dnd-core';

import { Card } from '../../store/card/types';
import { DragCard  } from '../../store/match/types';

import { ToolOutlined, PlusOutlined } from '@ant-design/icons';

import { ZONE_NAMES } from "../../constants";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { changeMatch, changOpponenteMatch, setTakeControlOpponentCardAction } from '../../store/match/action';
import { Button, Image, message, Popover } from 'antd';
import { openModalSelectXcards, openModalTakeControlOpponentCard, openModalThrowXcards, openModalViewCastle, openModalViewCementery, openModalViewCementeryOpponent, openModalViewExile, openModalViewExileOpponent, openModalViewRemoval, openModalViewRemovalOpponent } from '../../store/ui-modal/action';
import { shuffle } from '../../helpers/shuffle';
import { throwXcards } from '../../helpers/throwsCards';
import { SocketContext } from '../../context/SocketContext';

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE, GOLDS_PAID_ZONE, UNPAID_GOLD_ZONE } = ZONE_NAMES;

export interface CardProps {
    id?: string;
    index: number;
    moveCard?: (dragIndex: number, hoverIndex: number, zoneName: string) => void;
    zone: string;
    isOpponent?: boolean;
    card: Card;
    withPopover?: boolean;
};

const CardComponent: FC<CardProps> = ({ id, index, moveCard, zone, isOpponent, card, withPopover }) => {

    const ref = useRef<HTMLInputElement>(null); 

    const dispatch = useDispatch();

    const { socket } = useContext(SocketContext);

    const { match, opponentId, opponentMatch } = useSelector((state: RootState) => state.match);

    const [visiblePopover, setVisiblePopover] = useState(false);
    const [animated, setAnimated] = useState(false);

    const changeCardZone = (item: DragCard, zoneName: string) => {
        
        if (item.zone === zoneName) {
            return;
        }

        const card = match[item.zone].find((card: Card, index2: number) => index2 === index) as Card;

        const newCards = { ...match };

        newCards[item.zone] = match[item.zone].filter((card: Card, index2: number) => index2 !== index);

        if (card.isOpponent) {

            if (zoneName === CASTLE_ZONE || zoneName === CEMETERY_ZONE || zoneName === EXILE_ZONE || zoneName === REMOVAL_ZONE) {

                const newCardsOpponent = { ...opponentMatch };
                delete card.isOpponent;
                newCardsOpponent[zoneName] = [...newCardsOpponent[zoneName], card];
                dispatch(changOpponenteMatch(newCardsOpponent));
                dispatch(changeMatch(newCards));

                socket?.emit('update-match-opponent', {
                    match: newCardsOpponent,
                    opponentId
                });

            } else {

                newCards[zoneName] = [...match[zoneName], card];
                dispatch(changeMatch(newCards));

            }

        } else {

            newCards[zoneName] = [...match[zoneName], card];
            dispatch(changeMatch(newCards));

            if (zoneName === SUPPORT_ZONE) {
                // Abrir modal para elegir el portador
            }
            

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

                if(isOpponent){
                    return;
                }
                
                
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
                    case GOLDS_PAID_ZONE:
                        changeCardZone(item, GOLDS_PAID_ZONE);
                        break;
                    case UNPAID_GOLD_ZONE:
                        changeCardZone(item, UNPAID_GOLD_ZONE);
                        break;
                    default:
                        break;
                }
            }
        },
    });

    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));

    const shuffleCaslte = () => {

        setAnimated(true);

        const newMatch = shuffle(match, CASTLE_ZONE); 

        dispatch(changeMatch(newMatch));
        handleVisibleChangePopever(false);

        setTimeout(() => {
            setAnimated(false);
        }, 500);
    };

    const getHand = (ammunt: number) => {
        if (!match[CASTLE_ZONE].length) {
            message.warning(`No hay cartas en ${CASTLE_ZONE}`);
            handleVisibleChangePopever(false);
            return;
        }

        const newMatch = throwXcards(ammunt, match, CASTLE_ZONE, HAND_ZONE);

        dispatch(changeMatch(newMatch));
        handleVisibleChangePopever(false);        
    };

    const showToOpponent = () => {
        socket?.emit('show-clastle-to-opponent', {
            opponentId
        });
        handleVisibleChangePopever(false);   
    };

    const viewMyCementery = () => {
        dispatch(openModalViewCementery());
        handleVisibleChangePopever(false);
    };

    const viewMyExile = () => {
        dispatch(openModalViewExile());
        handleVisibleChangePopever(false);
    };

    const viewMyRemoval = () => {
        dispatch(openModalViewRemoval());
        handleVisibleChangePopever(false);
    };

    const viewCementeryOpponent = () => {
        dispatch(openModalViewCementeryOpponent());
        handleVisibleChangePopever(false);
    };

    const viewExileOpponent = () => {
        dispatch(openModalViewExileOpponent());
        handleVisibleChangePopever(false);
    };

    const viewRemovalOpponent = () => {
        dispatch(openModalViewRemovalOpponent());
        handleVisibleChangePopever(false);
    };

    const takeControlOpponentCard = (zone: string) => {
        dispatch(setTakeControlOpponentCardAction(index, zone));
        dispatch(openModalTakeControlOpponentCard());
        handleVisibleChangePopever(false);
    };

    const content = (
        <div>
            {/* Acciones en mi castillo */}
            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ () => getHand(1) }>Robar carta</Button><br/></div>
            )}

            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ () => getHand(8) }>Robar mano</Button><br/></div>
            )}

            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ () => openViewCastleModal() }>Ver {zone}</Button><br/></div>
            )}

            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ () => openSelectXcardsCastleModal() }>Ver X</Button><br/></div>
            )}

            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ () => throwOneCard() }>Botar carta</Button> <br/></div>
            )}          
            

            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ () => openThrowCardsModal() }>Botar X</Button> <br/></div>
            )}        


            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ shuffleCaslte }>Barajar</Button> <br/></div>
            )}  
            
            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ showToOpponent }>Mostrar al oponente</Button> <br/></div>
            )}  


            {/* Acciones en mi cementerio, destierro y remoción */}

            {(zone === CEMETERY_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ viewMyCementery }>Ver Cementerio</Button> <br/></div>
            )}  

            {(zone === EXILE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ viewMyExile }>Ver Destierro</Button> <br/></div>
            )}  

            {(zone === REMOVAL_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ viewMyRemoval }>Ver Remoción</Button> <br/></div>
            )}


            {/* Acciones en cementerio, destierro y remoción oponentes */}

            {(zone === CEMETERY_ZONE && isOpponent) && (
                <div><Button type="link" onClick={ viewCementeryOpponent }>Ver Cementerio</Button> <br/></div>
            )}  

            {(zone === EXILE_ZONE && isOpponent) && (
                <div><Button type="link" onClick={ viewExileOpponent }>Ver Destierro</Button> <br/></div>
            )}  

            {(zone === REMOVAL_ZONE && isOpponent) && (
                <div><Button type="link" onClick={ viewRemovalOpponent }>Ver Remoción</Button> <br/></div>
            )}   
            
            {/* Acciones sobre oros, aliados, armas y totems oponentes */}

            {(zone === DEFENSE_ZONE && isOpponent) && (
                <div><Button type="link" onClick={ () => takeControlOpponentCard(DEFENSE_ZONE) }>Tomar control de Aliado</Button> <br/></div>
            )}

            {(zone === ATTACK_ZONE && isOpponent) && (
                <div><Button type="link" onClick={ () => takeControlOpponentCard(ATTACK_ZONE) }>Tomar control de Aliado</Button> <br/></div>
            )}

            {(zone === SUPPORT_ZONE && isOpponent) && (
                <div><Button type="link" onClick={ () => takeControlOpponentCard(SUPPORT_ZONE) }>Tomar control de Tótem</Button> <br/></div>
            )} 

            {(zone === GOLDS_PAID_ZONE && isOpponent) && (
                <div><Button type="link" onClick={ () => takeControlOpponentCard(GOLDS_PAID_ZONE) }>Tomar control de Oro</Button> <br/></div>
            )}

            {(zone === UNPAID_GOLD_ZONE && isOpponent) && (
                <div><Button type="link" onClick={ () => takeControlOpponentCard(UNPAID_GOLD_ZONE) }>Tomar control de Oro</Button> <br/></div>
            )}


            
        </div>
    );

    const openThrowCardsModal = () => {
        handleVisibleChangePopever(false);
        dispatch(openModalThrowXcards());
    }; 

    const openViewCastleModal = () => {
        handleVisibleChangePopever(false);
        dispatch(openModalViewCastle());
    };

    const throwOneCard = () => {
        const newMatch = throwXcards(1, match, CASTLE_ZONE, CEMETERY_ZONE);
        dispatch(changeMatch(newMatch));
    };

    const openSelectXcardsCastleModal = () => {
        handleVisibleChangePopever(false);
        dispatch(openModalSelectXcards());
    };

    const handleVisibleChangePopever = (visible: boolean) => {
        if (!visible) setVisiblePopover(visible);        
    };

    const detail = (event: any) => {
        event.preventDefault();
        setVisiblePopover(true);
    };

    return (
        <>

            {
                (   (zone === CASTLE_ZONE && !isOpponent)|| 
                    zone === CEMETERY_ZONE || 
                    zone === EXILE_ZONE || 
                    zone === REMOVAL_ZONE || 
                    (isOpponent && zone === DEFENSE_ZONE) || 
                    (isOpponent && zone === ATTACK_ZONE) ||
                    (isOpponent && zone === SUPPORT_ZONE) ||
                    (isOpponent && zone === GOLDS_PAID_ZONE) ||
                    (isOpponent && zone === UNPAID_GOLD_ZONE)
                ) ? (
                    <Popover 
                        placement="right" 
                        trigger="click"
                        content={ content }
                        visible={ visiblePopover }
                        onVisibleChange={ handleVisibleChangePopever }
                    >
                        
                        <div ref={ ref }  style={{ opacity, borderRadius: 2 }} className={animated ? 'animate__animated animate__shakeY movable-item' : 'movable-item'} data-handler-id={ handlerId } onContextMenu={ detail } >
                            { (zone === CASTLE_ZONE || (zone === HAND_ZONE && isOpponent)) ?
                                <img
                                    width={ 33 }
                                    height={ 50 }
                                    alt={ card.name }
                                    src={ "https://res.cloudinary.com/dfcm5wuuf/image/upload/v1635185102/reverso-carta_avpq6q.png" }
                                    className={isOpponent ? 'img-180-deg' : ''}
                                />
                                : 
                                <Image
                                    width={ 33 }
                                    height={ 50 }
                                    src={ card.img }
                                    className={isOpponent ? 'img-180-deg' : ''}
                                />                        
                            }
                            
                        </div>
                    </Popover>
                ) : (
                    <div ref={ ref }  style={{ opacity, borderRadius: 2 }} className={animated ? 'animate__animated animate__shakeY movable-item' : 'movable-item'} data-handler-id={ handlerId } >
                        { (zone === CASTLE_ZONE || (zone === HAND_ZONE && isOpponent)) ?
                            <img
                                width={ 33 }
                                height={ 50 }
                                alt={ card.name }
                                src={ "https://res.cloudinary.com/dfcm5wuuf/image/upload/v1635185102/reverso-carta_avpq6q.png" }
                                className={isOpponent ? 'img-180-deg' : ''}
                            />
                            : 
                            <>
                                {card.isMachinery && <ToolOutlined className="icon-arm" height={10} width={10} style={{color: 'black'}} />}

                                <Image
                                    width={ 33 }
                                    height={ 50 }
                                    src={ card.img }
                                    className={isOpponent ? 'img-180-deg' : ''}
                                />
                            </>
                                                    
                        }
                        
                    </div>
                ) 
            }

        </>

            
        
    )
}

export default CardComponent;