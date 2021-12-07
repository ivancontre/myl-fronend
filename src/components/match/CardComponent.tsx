import { FC, useContext, useRef, useState } from 'react';
import { useDrag, useDrop, DropTargetMonitor, DropTargetOptions } from 'react-dnd';
import { XYCoord } from 'dnd-core';

import { Card } from '../../store/card/types';
import { DragCard  } from '../../store/match/types';

import { ToolOutlined, UserOutlined } from '@ant-design/icons';

import { ZONE_NAMES } from "../../constants";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { changeMatch, changOpponenteMatch, setTakeControlOpponentCardAction, setWeaponAction } from '../../store/match/action';
import { Button, Image, message, Popover } from 'antd';
import { openModalAssignWeapon, openModalSelectXcards, openModalTakeControlOpponentCard, openModalThrowXcards, openModalViewCastle, openModalViewCementery, openModalViewCementeryOpponent, openModalViewExile, openModalViewExileOpponent, openModalViewRemoval, openModalViewRemovalOpponent } from '../../store/ui-modal/action';
import { shuffle } from '../../helpers/shuffle';
import { throwXcards } from '../../helpers/throwsCards';
import { SocketContext } from '../../context/SocketContext';
import { Message } from '../../store/chat/types';
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE, GOLDS_PAID_ZONE, UNPAID_GOLD_ZONE, AUXILIARY_ZONE } = ZONE_NAMES;

export interface CardProps {
    id?: string;
    index: number;
    moveCard?: (dragIndex: number, hoverIndex: number, zoneName: string) => void;
    zone: string;
    isOpponent?: boolean;
    card: Card;
};

const CardComponent: FC<CardProps> = ({ id, index, moveCard, zone, card, isOpponent }) => {

    const ref = useRef<HTMLInputElement>(null); 

    const dispatch = useDispatch();

    const { socket } = useContext(SocketContext);

    const { match,matchId, opponentId, opponentMatch } = useSelector((state: RootState) => state.match);
    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);

    const [visiblePopover, setVisiblePopover] = useState(false);
    const [animated, setAnimated] = useState(false);

    const changeCardZone = (item: DragCard, zoneName: string) => {
        
        if (item.zone === zoneName || isOpponent) {
            return;
        }        

        const cardToMove = match[item.zone].find((card: Card, index2: number) => index2 === index) as Card;

        const newCards = { ...match };
        const newCardsOpponent = { ...opponentMatch };

        if (card.user === myUserId) { // Moviendo mis propias cartas

            const newMessage: Message = {
                id: myUserId as string,
                username: username as string,
                text: `Moviendo "${item.name}" de "${item.zone}" a "${zoneName}"`,
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

            if (cardToMove.armsId && (zoneName === CASTLE_ZONE || zoneName === CEMETERY_ZONE || zoneName === EXILE_ZONE || zoneName === REMOVAL_ZONE || zoneName === HAND_ZONE)) {                

                for (const armId of cardToMove.armsId as string[]) {

                    const armCardInMyZone = newCards[SUPPORT_ZONE].find((card: Card) => card.idx === armId);

                    if (armCardInMyZone) {

                        newCards[SUPPORT_ZONE] = newCards[SUPPORT_ZONE].filter((card: Card) => card.idx !== armId);

                        delete armCardInMyZone.bearerId;

                        if (armCardInMyZone.user === myUserId) {
                            
                            newCards[zoneName] = [...newCards[zoneName], armCardInMyZone];

                        } else {

                            newCardsOpponent[zoneName] = [...newCardsOpponent[zoneName], armCardInMyZone];

                        }

                    }

                }

                delete cardToMove.armsId;
            }

            if (cardToMove.bearerId && (zoneName === CASTLE_ZONE || zoneName === CEMETERY_ZONE || zoneName === EXILE_ZONE || zoneName === REMOVAL_ZONE  || zoneName === HAND_ZONE)) {
                // Al portador se le debe quitar esta arma
                const bearerInMyDefenseZone = newCards[DEFENSE_ZONE].find((card: Card) => card.idx === cardToMove.bearerId);

                if (bearerInMyDefenseZone) {
                    newCards[DEFENSE_ZONE] = newCards[DEFENSE_ZONE].map((card: Card) => {
                        if (card.idx === bearerInMyDefenseZone.idx) {
                            return {
                                ...card,
                                armsId: card.armsId?.filter((armId: string) => armId !== cardToMove.idx)
                            }
                        }

                        return card;
                    });
                } else {

                    const bearerInMyAttackZone = newCards[ATTACK_ZONE].find((card: Card) => card.idx === cardToMove.bearerId);

                    if (bearerInMyAttackZone) {
                        newCards[ATTACK_ZONE] = newCards[ATTACK_ZONE].map((card: Card) => {
                            if (card.idx === bearerInMyAttackZone.idx) {
                                return {
                                    ...card,
                                    armsId: card.armsId?.filter((armId: string) => armId !== cardToMove.idx)
                                }
                            }
    
                            return card;
                        });
                    }
                }

                delete cardToMove.bearerId;
            }

            newCards[item.zone] = newCards[item.zone].filter((card: Card, index2: number) => index2 !== index);
            newCards[zoneName] = [...newCards[zoneName], cardToMove];

            if (zoneName === CASTLE_ZONE) { // Se baraja previamente si el destino es el Castillo

                const newMatch = shuffle({ ...newCards }, CASTLE_ZONE);
                dispatch(changeMatch(newMatch));
                const newMatchOpponent = shuffle({ ...newCardsOpponent }, CASTLE_ZONE);
                dispatch(changOpponenteMatch(newMatchOpponent));
                socket?.emit('update-match-opponent', {
                    match: newMatchOpponent,
                    matchId
                });

            } else {

                dispatch(changeMatch(newCards));
                dispatch(changOpponenteMatch(newCardsOpponent));
                socket?.emit('update-match-opponent', {
                    match: newCardsOpponent,
                    matchId
                });

            }

        } else { // ------------------- Enviando cartas robadas -------------------------------------
            
            if (cardToMove.armsId && (zoneName === CASTLE_ZONE || zoneName === CEMETERY_ZONE || zoneName === EXILE_ZONE || zoneName === REMOVAL_ZONE || zoneName === HAND_ZONE)) {

                for (const armId of cardToMove.armsId as string[]) {

                    const armCardInMyZone = newCards[SUPPORT_ZONE].find((card: Card) => card.idx === armId);
                    
                    if (armCardInMyZone) {

                        newCards[SUPPORT_ZONE] = newCards[SUPPORT_ZONE].filter((card: Card) => card.idx !== armId);

                        delete armCardInMyZone.bearerId;

                        if (armCardInMyZone.user === myUserId) {
                            
                            newCards[zoneName] = [...newCards[zoneName], armCardInMyZone];

                        } else {

                            newCardsOpponent[zoneName] = [...newCardsOpponent[zoneName], armCardInMyZone];

                        }

                    }

                }

                delete cardToMove.armsId;

            }

            if (cardToMove.bearerId && (zoneName === CASTLE_ZONE || zoneName === CEMETERY_ZONE || zoneName === EXILE_ZONE || zoneName === REMOVAL_ZONE || zoneName === HAND_ZONE)) {
                // Al portador se le debe quitar esta arma
                const bearerInMyDefenseZone = newCards[DEFENSE_ZONE].find((card: Card) => card.idx === cardToMove.bearerId);

                if (bearerInMyDefenseZone) {
                    newCards[DEFENSE_ZONE] = newCards[DEFENSE_ZONE].map((card: Card) => {
                        if (card.idx === bearerInMyDefenseZone.idx) {
                            return {
                                ...card,
                                armsId: card.armsId?.filter((armId: string) => armId !== cardToMove.idx)
                            }
                        }

                        return card;
                    })
                } else {

                    const bearerInMyAttackZone = newCards[ATTACK_ZONE].find((card: Card) => card.idx === cardToMove.bearerId);

                    if (bearerInMyAttackZone) {
                        newCards[ATTACK_ZONE] = newCards[ATTACK_ZONE].map((card: Card) => {
                            if (card.idx === bearerInMyAttackZone.idx) {
                                return {
                                    ...card,
                                    armsId: card.armsId?.filter((armId: string) => armId !== cardToMove.idx)
                                }
                            }
    
                            return card;
                        })
                    }

                }

                delete cardToMove.bearerId;
            }

            newCards[item.zone] = newCards[item.zone].filter((card: Card, index2: number) => index2 !== index);

            if (zoneName === CASTLE_ZONE || zoneName === CEMETERY_ZONE || zoneName === EXILE_ZONE || zoneName === REMOVAL_ZONE) {
                console.log('Action:', `Moviendo "${item.name}" de "${item.zone}" a "${zoneName}" oponente`);
                newCardsOpponent[zoneName] = [...newCardsOpponent[zoneName], cardToMove];
            } else {
                console.log('Action:', `Moviendo "${item.name}" de "${item.zone}" a "${zoneName}"`);
                newCards[zoneName] = [...newCards[zoneName], cardToMove];
            }            

            if (zoneName === CASTLE_ZONE) { // Se baraja previamente si el destino es el Castillo

                const newMatch = shuffle({ ...newCards }, CASTLE_ZONE);
                dispatch(changeMatch(newMatch));
                const newMatchOpponent = shuffle({ ...newCardsOpponent }, CASTLE_ZONE);
                dispatch(changOpponenteMatch(newMatchOpponent));

                socket?.emit('update-match-opponent', {
                    match: newMatchOpponent,
                    matchId
                });

            } else {
                
                dispatch(changeMatch(newCards));
                dispatch(changOpponenteMatch(newCardsOpponent));

                socket?.emit('update-match-opponent', {
                    match: newCardsOpponent,
                    matchId
                });

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

                /*if(isOpponent){
                    return;
                }*/            
                
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
                    case AUXILIARY_ZONE:
                        changeCardZone(item, AUXILIARY_ZONE);
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

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Barajando "${CASTLE_ZONE}"`,
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
            message.warning(`No hay cartas en "${CASTLE_ZONE}"`);
            handleVisibleChangePopever(false);
            return;
        }

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Robando "${ammunt}" carta(s)`,
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

        const newMatch = throwXcards(ammunt, match, CASTLE_ZONE, HAND_ZONE);

        dispatch(changeMatch(newMatch));
        handleVisibleChangePopever(false);        
    };

    const showToOpponent = () => {

        socket?.emit('show-clastle-to-opponent', {
            matchId
        });

        handleVisibleChangePopever(false);   

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Mostrando "${CASTLE_ZONE}" al oponente`,
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

    const viewMyCementery = () => {
        dispatch(openModalViewCementery());
        handleVisibleChangePopever(false);
        
        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Viendo mi "${CEMETERY_ZONE}"`,
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

    const viewMyExile = () => {
        dispatch(openModalViewExile());
        handleVisibleChangePopever(false);

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Viendo mi "${EXILE_ZONE}"`,
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

    const viewMyRemoval = () => {
        dispatch(openModalViewRemoval());
        handleVisibleChangePopever(false);

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Viendo mi "${REMOVAL_ZONE}"`,
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

    const viewCementeryOpponent = () => {
        dispatch(openModalViewCementeryOpponent());
        handleVisibleChangePopever(false);

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Viendo "${CEMETERY_ZONE}" oponente`,
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

    const viewExileOpponent = () => {
        dispatch(openModalViewExileOpponent());
        handleVisibleChangePopever(false);

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Viendo "${EXILE_ZONE}" oponente`,
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

    const viewRemovalOpponent = () => {
        dispatch(openModalViewRemovalOpponent());
        handleVisibleChangePopever(false);

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Viendo ${REMOVAL_ZONE} oponente`,
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

    const viewModalAssignWeapon = () => {

        if ((match && (!match[DEFENSE_ZONE].length && !match[ATTACK_ZONE].length)) && (opponentMatch && (!opponentMatch[DEFENSE_ZONE].length && !opponentMatch[ATTACK_ZONE].length)) ) {
            message.warn(`Deben existir aliados en la línea de ${DEFENSE_ZONE} o ${ATTACK_ZONE} para asignarle una Arma`);
        } else {            
            dispatch(setWeaponAction({
                index, 
                idx: card.idx as string,
                name: card.name
            }));
            dispatch(openModalAssignWeapon());
        }
        
        handleVisibleChangePopever(false);
    };

    const takeControlOpponentCard = (zone: string) => {
        dispatch(setTakeControlOpponentCardAction(index, zone));
        dispatch(openModalTakeControlOpponentCard());
        handleVisibleChangePopever(false);
    };

    const sendToCastle = (zoneName: string) => {

        const dragCard: DragCard =  {
            ...card,
            zone: zoneName, 
            index: index
        };     

        const cardToDelete = match[dragCard.zone].find((card: Card, index2: number) => index2 === index) as Card;

        const newCards = { ...match };
        const newCardsOpponent = { ...opponentMatch };        

        if (cardToDelete.user === myUserId) { // Enviando mis propias cartas    
            
            const newMessage: Message = {
                id: myUserId as string,
                username: username as string,
                text: `Enviando y barajando "${cardToDelete.name}" de "${zoneName}" a mi "${CASTLE_ZONE}"`,
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
            
            if (cardToDelete.armsId) {

                for (const armId of cardToDelete.armsId as string[]) {

                    const armCardInMyZone = newCards[SUPPORT_ZONE].find((card: Card) => card.idx === armId);

                    if (armCardInMyZone) {

                        newCards[SUPPORT_ZONE] = newCards[SUPPORT_ZONE].filter((card: Card) => card.idx !== armId);

                        delete armCardInMyZone.bearerId;

                        if (armCardInMyZone.user === myUserId) {
                            
                            newCards[CASTLE_ZONE] = [...newCards[CASTLE_ZONE], armCardInMyZone];

                            const newMessage: Message = {
                                id: myUserId as string,
                                username: username as string,
                                text: `Enviando y barajando "${armCardInMyZone.name}" de "${SUPPORT_ZONE}" a mi "${CASTLE_ZONE}"`,
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

                        } else {

                            newCardsOpponent[CASTLE_ZONE] = [...newCardsOpponent[CASTLE_ZONE], armCardInMyZone];

                            const newMessage: Message = {
                                id: myUserId as string,
                                username: username as string,
                                text: `Enviando y barajando "${armCardInMyZone.name}" de "${SUPPORT_ZONE}" a "${CASTLE_ZONE}" oponente`,
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

                        }

                    }

                }

                delete cardToDelete.armsId;
            }

            if (cardToDelete.bearerId) {
                // Al portador se le debe quitar esta arma
                const bearerInMyDefenseZone = newCards[DEFENSE_ZONE].find((card: Card) => card.idx === cardToDelete.bearerId);

                if (bearerInMyDefenseZone) {
                    newCards[DEFENSE_ZONE] = newCards[DEFENSE_ZONE].map((card: Card) => {
                        if (card.idx === bearerInMyDefenseZone.idx) {
                            return {
                                ...card,
                                armsId: card.armsId?.filter((armId: string) => armId !== cardToDelete.idx)
                            }
                        }

                        return card;
                    });
                } else {

                    const bearerInMyAttackZone = newCards[ATTACK_ZONE].find((card: Card) => card.idx === cardToDelete.bearerId);

                    if (bearerInMyAttackZone) {
                        newCards[ATTACK_ZONE] = newCards[ATTACK_ZONE].map((card: Card) => {
                            if (card.idx === bearerInMyAttackZone.idx) {
                                return {
                                    ...card,
                                    armsId: card.armsId?.filter((armId: string) => armId !== cardToDelete.idx)
                                }
                            }
    
                            return card;
                        });
                    }
                }

                delete cardToDelete.bearerId;
            }

            newCards[dragCard.zone] = newCards[dragCard.zone].filter((card: Card, index2: number) => index2 !== index);
            newCards[CASTLE_ZONE] = [...newCards[CASTLE_ZONE], cardToDelete];

            const newMatch = shuffle({ ...newCards }, CASTLE_ZONE);
            dispatch(changeMatch(newMatch));
            const newMatchOpponent = shuffle({ ...newCardsOpponent }, CASTLE_ZONE);
            dispatch(changOpponenteMatch(newMatchOpponent));
            socket?.emit('update-match-opponent', {
                match: newMatchOpponent,
                matchId
            });

        } else { // ------------------- Enviando cartas robadas -------------------------------------

            const newMessage: Message = {
                id: myUserId as string,
                username: username as string,
                text: `Enviando y barajando "${cardToDelete.name}" de "${zoneName}" a "${CASTLE_ZONE}" oponente`,
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

            if (cardToDelete.armsId) {

                for (const armId of cardToDelete.armsId as string[]) {

                    const armCardInMyZone = newCards[SUPPORT_ZONE].find((card: Card) => card.idx === armId);
                    
                    if (armCardInMyZone) {

                        newCards[SUPPORT_ZONE] = newCards[SUPPORT_ZONE].filter((card: Card) => card.idx !== armId);

                        delete armCardInMyZone.bearerId;

                        if (armCardInMyZone.user === myUserId) {
                            
                            newCards[CASTLE_ZONE] = [...newCards[CASTLE_ZONE], armCardInMyZone];

                            const newMessage: Message = {
                                id: myUserId as string,
                                username: username as string,
                                text: `Enviando y barajando "${armCardInMyZone.name}" de "${SUPPORT_ZONE}" a mi "${CASTLE_ZONE}"`,
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

                        } else {

                            newCardsOpponent[CASTLE_ZONE] = [...newCardsOpponent[CASTLE_ZONE], armCardInMyZone];

                            const newMessage: Message = {
                                id: myUserId as string,
                                username: username as string,
                                text: `Enviando y barajando "${armCardInMyZone.name}" de "${SUPPORT_ZONE}" a "${CASTLE_ZONE}" oponente`,
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

                        }

                    }

                }

                delete cardToDelete.armsId;
            }

            if (cardToDelete.bearerId) {
                // Al portador se le debe quitar esta arma
                const bearerInMyDefenseZone = newCards[DEFENSE_ZONE].find((card: Card) => card.idx === cardToDelete.bearerId);

                if (bearerInMyDefenseZone) {
                    newCards[DEFENSE_ZONE] = newCards[DEFENSE_ZONE].map((card: Card) => {
                        if (card.idx === bearerInMyDefenseZone.idx) {
                            return {
                                ...card,
                                armsId: card.armsId?.filter((armId: string) => armId !== cardToDelete.idx)
                            }
                        }

                        return card;
                    })
                } else {

                    const bearerInMyAttackZone = newCards[ATTACK_ZONE].find((card: Card) => card.idx === cardToDelete.bearerId);

                    if (bearerInMyAttackZone) {
                        newCards[ATTACK_ZONE] = newCards[ATTACK_ZONE].map((card: Card) => {
                            if (card.idx === bearerInMyAttackZone.idx) {
                                return {
                                    ...card,
                                    armsId: card.armsId?.filter((armId: string) => armId !== cardToDelete.idx)
                                }
                            }
    
                            return card;
                        })
                    }

                }

                delete cardToDelete.bearerId;
            }

            newCards[dragCard.zone] = newCards[dragCard.zone].filter((card: Card, index2: number) => index2 !== index);
            newCardsOpponent[CASTLE_ZONE] = [...newCardsOpponent[CASTLE_ZONE], cardToDelete];

            const newMatch = shuffle({ ...newCards }, CASTLE_ZONE);
            dispatch(changeMatch(newMatch));
            const newMatchOpponent = shuffle({ ...newCardsOpponent }, CASTLE_ZONE);
            dispatch(changOpponenteMatch(newMatchOpponent));

            socket?.emit('update-match-opponent', {
                match: newMatchOpponent,
                matchId
            });
        }

        handleVisibleChangePopever(false);
    };

    const content = (
        <div>            
            
            {/* ACCIONES EN MI ZONA */}

            {/* Castillo */}
            {(zone === CASTLE_ZONE && !isOpponent) && (
                <div>
                    <Button type="link" onClick={ () => getHand(1) }>Robar carta</Button><br/>
                    <Button type="link" onClick={ () => getHand(8) }>Robar mano</Button><br/>
                    <Button type="link" onClick={ () => openViewCastleModal() }>Ver {zone}</Button><br/>
                    <Button type="link" onClick={ () => openSelectXcardsCastleModal() }>Ver X</Button><br/>
                    <Button type="link" onClick={ () => throwOneCard() }>Botar carta</Button> <br/>
                    <Button type="link" onClick={ () => openThrowCardsModal() }>Botar X</Button> <br/>
                    <Button type="link" onClick={ shuffleCaslte }>Barajar</Button> <br/>
                    <Button type="link" onClick={ showToOpponent }>Mostrar al oponente</Button>
                </div>
            )}

            {/* Cementerio, destierro y remoción */}
            {(zone === CEMETERY_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ viewMyCementery }>Ver Cementerio</Button> <br/></div>
            )}  

            {(zone === EXILE_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ viewMyExile }>Ver Destierro</Button> <br/></div>
            )}  

            {(zone === REMOVAL_ZONE && !isOpponent) && (
                <div><Button type="link" onClick={ viewMyRemoval }>Ver Remoción</Button> <br/></div>
            )}

            {/* Oros, aliados, armas y totems */}
            {(zone === DEFENSE_ZONE && (!isOpponent || match[zone].find(c => c.user === opponentId))) && (
                <div>
                    <Button type="link" onClick={ () => sendToCastle(DEFENSE_ZONE) }>Barajar en el Castillo</Button> <br/>
                    { card.armsId && <Button type="link" onClick={ () => viewArms(true) }>Conocer Armas</Button> }
                </div>
            )}

            {(zone === ATTACK_ZONE && (!isOpponent || match[zone].find(c => c.user === opponentId))) && (
                <div>
                    <Button type="link" onClick={ () => sendToCastle(ATTACK_ZONE) }>Barajar en el Castillo</Button> <br/>
                    { card.armsId && <Button type="link" onClick={ () => viewArms(true) }>Conocer armas</Button> }             
                </div>
            )}

            {(zone === SUPPORT_ZONE && (!isOpponent || match[zone].find(c => c.user === opponentId))) && (
                <div>
                    <Button type="link" onClick={ viewModalAssignWeapon }>Asignar Portador</Button> <br/>
                    { card.bearerId && <div><Button type="link" onClick={ () => viewBearer(true) }>Conocer Portador</Button> <br/></div> }
                    <Button type="link" onClick={ () => sendToCastle(SUPPORT_ZONE) }>Barajar el Castillo</Button>
                </div>
            )}

            {(zone === GOLDS_PAID_ZONE && (!isOpponent || match[zone].find(c => c.user === opponentId))) && (
                <div>
                    <Button type="link" onClick={ () => sendToCastle(SUPPORT_ZONE) }>Barajar el Castillo</Button>
                </div>
            )}

            {(zone === UNPAID_GOLD_ZONE && (!isOpponent || match[zone].find(c => c.user === opponentId))) && (
                <div>
                    <Button type="link" onClick={ () => sendToCastle(UNPAID_GOLD_ZONE) }>Barajar el Castillo</Button>
                </div>
            )}


            {/* ACCIONES EN ZONA OPONENTE*/}

            {/* Oros, aliados, armas y totems */}
            {(zone === DEFENSE_ZONE && (
                (
                    opponentMatch[DEFENSE_ZONE].find((c, index2) => (c.user === myUserId)) ||
                    opponentMatch[DEFENSE_ZONE].find((c, index2) => (c.user === opponentId)) 
                ) &&
                opponentMatch[DEFENSE_ZONE].find((c, index2) => (index2 === index && c.id === card.id))
            )) && (
                <div>
                    <Button type="link" onClick={ () => takeControlOpponentCard(DEFENSE_ZONE) }>Tomar control de Aliado</Button><br/>
                    { card.armsId && <Button type="link" onClick={ () => viewArms(false) }>Conocer armas</Button> }  
                </div>
            )}

            {(zone === ATTACK_ZONE && (
                (
                    opponentMatch[ATTACK_ZONE].find((c, index2) => (c.user === myUserId)) ||
                    opponentMatch[ATTACK_ZONE].find((c, index2) => (c.user === opponentId)) 
                ) &&
                opponentMatch[ATTACK_ZONE].find((c, index2) => (index2 === index && c.id === card.id))
            )) && (
                <div>
                    <Button type="link" onClick={ () => takeControlOpponentCard(ATTACK_ZONE) }>Tomar control de Aliado</Button><br/>
                    { card.armsId && <Button type="link" onClick={ () => viewArms(false) }>Conocer armas</Button> }    
                </div>
            )}

            {(zone === SUPPORT_ZONE && (
                (
                    opponentMatch[SUPPORT_ZONE].find((c, index2) => (c.user === myUserId)) ||
                    opponentMatch[SUPPORT_ZONE].find((c, index2) => (c.user === opponentId)) 
                ) &&
                opponentMatch[SUPPORT_ZONE].find((c, index2) => (index2 === index && c.id === card.id))
            )) && (
                <div>
                    <Button type="link" onClick={ () => takeControlOpponentCard(SUPPORT_ZONE) }>Tomar control de Arma</Button><br/>
                    { card.bearerId && <Button type="link" onClick={ () => viewBearer(false) }>Conocer Portador</Button> }
                </div>
            )}

            {(zone === GOLDS_PAID_ZONE && (
                (
                    opponentMatch[GOLDS_PAID_ZONE].find((c, index2) => (c.user === myUserId)) ||
                    opponentMatch[GOLDS_PAID_ZONE].find((c, index2) => (c.user === opponentId)) 
                ) &&
                opponentMatch[GOLDS_PAID_ZONE].find((c, index2) => (index2 === index && c.id === card.id))
            )) && (
                <div>
                    <Button type="link" onClick={ () => takeControlOpponentCard(GOLDS_PAID_ZONE) }>Tomar control de Oro</Button>
                </div>
            )}

            {(zone === UNPAID_GOLD_ZONE && (
                (
                    opponentMatch[UNPAID_GOLD_ZONE].find((c, index2) => (c.user === myUserId)) ||
                    opponentMatch[UNPAID_GOLD_ZONE].find((c, index2) => (c.user === opponentId)) 
                ) &&
                opponentMatch[UNPAID_GOLD_ZONE].find((c, index2) => (index2 === index && c.id === card.id))
            )) && (
                <div>
                    <Button type="link" onClick={ () => takeControlOpponentCard(UNPAID_GOLD_ZONE) }>Tomar control de Oro</Button>
                </div>
            )}

            {/* Cementerio, destierro y remoción oponentes */}

            {(zone === CEMETERY_ZONE && isOpponent) && (
                <div><Button type="link" onClick={ viewCementeryOpponent }>Ver Cementerio</Button> <br/></div>
            )}  

            {(zone === EXILE_ZONE && isOpponent) && (
                <div><Button type="link" onClick={ viewExileOpponent }>Ver Destierro</Button> <br/></div>
            )}  

            {(zone === REMOVAL_ZONE && isOpponent) && (
                <div><Button type="link" onClick={ viewRemovalOpponent }>Ver Remoción</Button> <br/></div>
            )}    

        </div>
    );

    const openThrowCardsModal = () => {
        handleVisibleChangePopever(false);
        dispatch(openModalThrowXcards());
    }; 

    const openViewCastleModal = () => {
        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Viendo "${CASTLE_ZONE}"`,
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

        handleVisibleChangePopever(false);
        dispatch(openModalViewCastle());
    };

    const throwOneCard = () => {

        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text: `Botando carta del "${CASTLE_ZONE}" al "${CEMETERY_ZONE}"`,
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

    const setVibrateCard = (isMyMatch: boolean, vibrate: boolean) => {
        if (isMyMatch) {
            const newMatch = { ...match };
            newMatch[DEFENSE_ZONE] = newMatch[DEFENSE_ZONE].map((c: Card, index: number) => {
                if (card.bearerId === c.idx) {
                    if (vibrate) {
                        return {
                            ...c,
                            vibrate
                        }
                    }

                    delete c.vibrate;
                    return c;
                }

                return c;
            });

            newMatch[ATTACK_ZONE] = newMatch[ATTACK_ZONE].map((c: Card, index: number) => {
                if (card.bearerId === c.idx) {
                    if (vibrate) {
                        return {
                            ...c,
                            vibrate
                        }
                    }

                    delete c.vibrate;
                    return c;
                }

                return c;
            });

            dispatch(changeMatch(newMatch, false));

        } else {

            const newOpponentMatch = { ...opponentMatch };
            newOpponentMatch[DEFENSE_ZONE] = newOpponentMatch[DEFENSE_ZONE].map((c: Card, index: number) => {
                if (card.bearerId === c.idx) {
                    if (vibrate) {
                        return {
                            ...c,
                            vibrate
                        }
                    }

                    delete c.vibrate;
                    return c;
                }

                return c;
            });

            newOpponentMatch[ATTACK_ZONE] = newOpponentMatch[ATTACK_ZONE].map((c: Card, index: number) => {
                if (card.bearerId === c.idx) {

                    if (vibrate) {
                        return {
                            ...c,
                            vibrate
                        }
                    }

                    delete c.vibrate;
                    return c;
                    
                }

                return c;
            });

            dispatch(changOpponenteMatch(newOpponentMatch));
        }
    }

    const viewBearer = (isMyMatch: boolean) => {
        
        setVibrateCard(isMyMatch, true);

        setTimeout(() => {
            setVibrateCard(isMyMatch, false);
        }, 500);

        handleVisibleChangePopever(false);

    };

    const setVibrateArmCard = (isMyMatch: boolean, vibrate: boolean) => {

        if (isMyMatch) {
            const newMatch = { ...match };
            newMatch[SUPPORT_ZONE] = newMatch[SUPPORT_ZONE].map((c: Card, index: number) => {
                if (card.armsId?.includes(c.idx as string)) {
                    if (vibrate) {
                        return {
                            ...c,
                            vibrate
                        }
                    }

                    delete c.vibrate;
                    return c;
                }

                return c;
            });

            dispatch(changeMatch(newMatch, false));

        } else {
            const newOpponentMatch = { ...opponentMatch };
            newOpponentMatch[SUPPORT_ZONE] = newOpponentMatch[SUPPORT_ZONE].map((c: Card, index: number) => {
                if (card.armsId?.includes(c.idx as string)) {
                    if (vibrate) {
                        return {
                            ...c,
                            vibrate
                        }
                    }

                    delete c.vibrate;
                    return c;
                }

                return c;
            });

            dispatch(changOpponenteMatch(newOpponentMatch));
        }
    };

    const viewArms = (isMyMatch: boolean) => {

        setVibrateArmCard(isMyMatch, true);

        setTimeout(() => {
            setVibrateArmCard(isMyMatch, false);
        }, 500);

        handleVisibleChangePopever(false);

    };

    const getClassName = () => {
        if (animated) {
            return 'animate__animated animate__shakeY';
        }

        if (card.vibrate) {
            return 'animate__animated animate__flash';
        }
    }

    return (
        <>

            {
                (   (zone === CASTLE_ZONE && !isOpponent)|| 
                    zone === CEMETERY_ZONE || 
                    zone === EXILE_ZONE || 
                    zone === REMOVAL_ZONE || 
                    (zone === DEFENSE_ZONE) || 
                    (zone === ATTACK_ZONE) ||
                    (zone === SUPPORT_ZONE) ||
                    (zone === GOLDS_PAID_ZONE) ||
                    (zone === UNPAID_GOLD_ZONE) ||
                    (zone === AUXILIARY_ZONE)
                ) ? (
                    <Popover 
                        placement="right" 
                        trigger="click"
                        content={ content }
                        visible={ visiblePopover }
                        onVisibleChange={ handleVisibleChangePopever }
                    >
                        {/* animate__flash */}
                        <div ref={ ref }  style={{ opacity, borderRadius: 2 }} className={`${getClassName()} movable-item`} data-handler-id={ handlerId } onContextMenu={ detail } >
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
                                    {card.armsId && card.armsId.length > 0 && <ToolOutlined className="icon-arm" height={ 10 } width={ 10 } />}
                                    {card.bearerId && <UserOutlined className="icon-arm" height={ 10 } width={ 10 } />}
                                    
                                    <Image
                                        width={ 33 }
                                        height={ 50 }
                                        src={ card.img }
                                        className={isOpponent ? 'img-180-deg' : ''}
                                    />   
                                </>                     
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
                            <Image
                                width={ 33 }
                                height={ 50 }
                                src={ card.img }
                                className={isOpponent ? 'img-180-deg' : ''}
                            />
                                                    
                        }
                        
                    </div>
                ) 
            }

        </>

            
        
    )
}

export default CardComponent;