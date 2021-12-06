import { Image, Modal, Radio, RadioChangeEvent, Space, Typography } from 'antd';
import React, { FC, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { closeModalAssignWeapon } from '../../store/ui-modal/action';
import { ZONE_NAMES } from "../../constants";
import { Card } from '../../store/card/types';
import { changeMatch, changOpponenteMatch, setWeaponAction } from '../../store/match/action';
import { SocketContext } from '../../context/SocketContext';
import { addMessageAction } from '../../store/chat/action';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { Message } from '../../store/chat/types';

const { DEFENSE_ZONE, ATTACK_ZONE, SUPPORT_ZONE } = ZONE_NAMES;

const { Title } = Typography;

const AssingWeaponModal: FC = () => {


    const dispatch = useDispatch();

    const { modalOpenAssignWeapon } = useSelector((state: RootState) => state.uiModal);
    const { match, matchId, opponentMatch, opponentId, selectedWeapon } = useSelector((state: RootState) => state.match);
    const { id } = useSelector((state: RootState) => state.auth);
    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);

    const { socket } = useContext(SocketContext);

    const [optionZone, setOptionZone] = useState(id);
    const [optionCarrier, setOptionCarrier] = useState('');


    useEffect(() => {

        match[DEFENSE_ZONE].map((card: Card, index: number) => {

            if (card.armsId?.includes(selectedWeapon.idx)) {
                setOptionCarrier(`${DEFENSE_ZONE}_${index}_${card.idx}`);
                setOptionZone(id);
            }

            return card;
        });

        match[ATTACK_ZONE].map((card: Card, index: number) => {

            if (card.armsId?.includes(selectedWeapon.idx)) {
                setOptionCarrier(`${ATTACK_ZONE}_${index}_${card.idx}`);
                setOptionZone(id);
            }

            return card;
        });

        opponentMatch[DEFENSE_ZONE].map((card: Card, index: number) => {

            if (card.armsId?.includes(selectedWeapon.idx)) {
                setOptionCarrier(`${DEFENSE_ZONE}_${index}_${card.idx}`);
                setOptionZone(opponentId as string);
            }

            return card;
        });

        opponentMatch[ATTACK_ZONE].map((card: Card, index: number) => {

            if (card.armsId?.includes(selectedWeapon.idx)) {
                setOptionCarrier(`${ATTACK_ZONE}_${index}_${card.idx}`);
                setOptionZone(opponentId as string);
            }

            return card;
        });

    }, [match, selectedWeapon, opponentId, id, opponentMatch]);


    const handleCancelModal = () => {
        dispatch(setWeaponAction(null));
        dispatch(closeModalAssignWeapon());
    };

    const updateBearerAndArm = (isMyMatch: boolean, zone: string, i: string, idx: string) => {

        const newMatch = { ...match };
        const newOpponentMatch = { ...opponentMatch };

        newMatch[ATTACK_ZONE] = newMatch[ATTACK_ZONE].map((card: Card) => {

            if (card.idx !== idx && card.armsId?.includes(selectedWeapon.idx)) {
                return {
                    ...card,
                    armsId: card.armsId.filter((armId: string) => armId !== selectedWeapon.idx)
                }
            }

            return card;
        });

        newMatch[DEFENSE_ZONE] = newMatch[DEFENSE_ZONE].map((card: Card) => {

            if (card.idx !== idx && card.armsId?.includes(selectedWeapon.idx)) {
                return {
                    ...card,
                    armsId: card.armsId.filter((armId: string) => armId !== selectedWeapon.idx)
                }
            }

            return card;
        });
        
        newOpponentMatch[ATTACK_ZONE] = newOpponentMatch[ATTACK_ZONE].map((card: Card) => {

            if (card.idx !== idx && card.armsId?.includes(selectedWeapon.idx)) {
                return {
                    ...card,
                    armsId: card.armsId.filter((armId: string) => armId !== selectedWeapon.idx)
                }
            }

            return card;
        });

        newOpponentMatch[DEFENSE_ZONE] = newOpponentMatch[DEFENSE_ZONE].map((card: Card) => {

            if (card.idx !== idx && card.armsId?.includes(selectedWeapon.idx)) {
                return {
                    ...card,
                    armsId: card.armsId.filter((armId: string) => armId !== selectedWeapon.idx)
                }
            }

            return card;
        });

        if (isMyMatch) {

            newMatch[zone] = newMatch[zone].map((card: Card, index: number) => {

                if (Number(i) === index) {

                    const arms = card.armsId ? card.armsId : [];

                    const newMessage: Message = {
                        id: myUserId as string,
                        username: username as string,
                        text: `Asignando arma "${selectedWeapon.name}" a mi aliado "${card.name}"`,
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

                    
                    return {
                        ...card,
                        armsId: [...arms, selectedWeapon.idx]
                    }
                }
    
                return card;
            });
    
            newMatch[SUPPORT_ZONE] = newMatch[SUPPORT_ZONE].map((card: Card) => {
    
                if (selectedWeapon.idx === card.idx) {
                    return {
                        ...card,
                        bearerId: idx
                    }
                }
    
                return card;
            });

        } else {

            newOpponentMatch[zone] = newOpponentMatch[zone].map((card: Card, index: number) => {

                if (Number(i) === index) {

                    const arms = card.armsId ? card.armsId : [];

                    const newMessage: Message = {
                        id: myUserId as string,
                        username: username as string,
                        text: `Asignando arma "${selectedWeapon.name}" a aliado "${card.name}" oponente`,
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

                    return {
                        ...card,
                        armsId: [...arms, selectedWeapon.idx]
                    }
                }
    
                return card;
            });

            const armCard = newMatch[SUPPORT_ZONE].find((card: Card) => card.idx === selectedWeapon.idx) as Card;
            armCard.bearerId = idx
            newMatch[SUPPORT_ZONE] = newMatch[SUPPORT_ZONE].filter((card: Card) => card.idx !== selectedWeapon.idx);
            newOpponentMatch[SUPPORT_ZONE] = [...newOpponentMatch[SUPPORT_ZONE], armCard];

        }

        dispatch(changeMatch(newMatch));
        dispatch(changOpponenteMatch(newOpponentMatch));

        socket?.emit('update-match-opponent', {
            match: newOpponentMatch,
            matchId
        });
    };

    const handleOkModal = () => {

        if (optionCarrier === '') {
            return;
        }

        const [zone, i, idx] = optionCarrier.split('_'); // del portador
        console.log(zone, i, idx)

        if (optionZone === id) {

            updateBearerAndArm(true, zone, i, idx);

        } else {

            updateBearerAndArm(false, zone, i, idx);
        }
        
        dispatch(setWeaponAction(null));
        dispatch(closeModalAssignWeapon());

    };

    const onChangeZone = (e: RadioChangeEvent) => {
        setOptionZone(e.target.value);
    };

    const onChangeCarrier = (e: RadioChangeEvent) => {
        setOptionCarrier(e.target.value);
    };


    return (
        <Modal centered title="Seleccionando portador..." visible={ modalOpenAssignWeapon } onOk={ handleOkModal } onCancel={ handleCancelModal } width={ 1000 } >
            <p>Seleccione la arena en donde quiere jugar esta Arma</p>
            <Radio.Group value={ optionZone } onChange={ onChangeZone } style={{paddingBottom: 20}} >

                <Space direction="vertical">
                    <Radio value={ id }>Mi Zona</Radio>
                    <Radio value={ opponentId }>Zona Oponente</Radio>
                </Space>
            </Radio.Group>                

                {
                    optionZone === id && (
                        <div style={{paddingTop: 20}} >
                                                        
                            {
                                match[ATTACK_ZONE].length > 0 && (
                                    <div className="zone-flex"  style={{display: 'block'}} >
                                        <Title level={4}>{ATTACK_ZONE}</Title>
                                        <Radio.Group value={ optionCarrier } onChange={ onChangeCarrier }>
                                            <Space direction="horizontal">
                                                {
                                                    match[ATTACK_ZONE].map((card: Card, index: number) => (
                                                        <Radio value={ ATTACK_ZONE + '_' + index + '_' + card.idx} key={ index }>
                                                            <Image
                                                                width={ 33 }
                                                                height={ 50 }
                                                                src={ card.img }
                                                            />
                                                        </Radio> 
                                                    ))
                                                }
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                )
                            }

                            {
                                match[DEFENSE_ZONE].length > 0 && (
                                    <div className="zone-flex"  style={{display: 'block'}} >
                                        <Title level={4}>{DEFENSE_ZONE}</Title>
                                        <Radio.Group value={ optionCarrier } onChange={ onChangeCarrier }>
                                            <Space direction="horizontal">
                                                {
                                                    match[DEFENSE_ZONE].map((card: Card, index: number) => (
                                                        <Radio value={ DEFENSE_ZONE + '_' + index + '_' + card.idx } key={ index }>
                                                            <Image
                                                                width={ 33 }
                                                                height={ 50 }
                                                                src={ card.img }
                                                            />
                                                        </Radio> 
                                                    ))
                                                }
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                )
                            }

                        </div>
                        
                    )
                }

                {
                    optionZone === opponentId && (
                        <div style={{paddingTop: 20}} >                            
                            {
                                opponentMatch[ATTACK_ZONE].length > 0 && (
                                    <div className="zone-flex"  style={{display: 'block'}} >
                                        <Title level={4}>{ATTACK_ZONE}</Title>
                                        <Radio.Group value={ optionCarrier } onChange={ onChangeCarrier }>
                                            <Space direction="horizontal">
                                                {
                                                    opponentMatch[ATTACK_ZONE].map((card: Card, index: number) => (
                                                        <Radio value={ ATTACK_ZONE + '_' + index + '_' + card.idx} key={ index }>
                                                            <Image
                                                                width={ 33 }
                                                                height={ 50 }
                                                                src={ card.img }
                                                            />
                                                        </Radio> 
                                                    ))
                                                }
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                )
                            }

                            {
                                opponentMatch[DEFENSE_ZONE].length > 0 && (
                                    <div className="zone-flex"  style={{display: 'block'}} >
                                        <Title level={4}>{DEFENSE_ZONE}</Title>
                                        <Radio.Group value={ optionCarrier } onChange={ onChangeCarrier }>
                                            <Space direction="horizontal">
                                                {
                                                    opponentMatch[DEFENSE_ZONE].map((card: Card, index: number) => (
                                                        <Radio value={ DEFENSE_ZONE + '_' + index + '_' + card.idx} key={ index }>
                                                            <Image
                                                                width={ 33 }
                                                                height={ 50 }
                                                                src={ card.img }
                                                            />
                                                        </Radio> 
                                                    ))
                                                }
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                )
                            }
                        </div>
                    )
                }

            
        </Modal>
    )
}

export default AssingWeaponModal;