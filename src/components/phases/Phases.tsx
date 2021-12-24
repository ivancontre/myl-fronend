import { Row, Col } from 'antd'
import React, { FC, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../context/SocketContext';
import { ZONE_NAMES } from '../../constants';

import '../../css/phases.css';
import { scrollToBottom } from '../../helpers/scrollToBottom';
import { RootState } from '../../store';
import { addMessageAction } from '../../store/chat/action';
import { Message } from '../../store/chat/types';
import { changeMatch } from '../../store/match/action';

const { DEFENSE_ZONE, ATTACK_ZONE, GOLDS_PAID_ZONE, UNPAID_GOLD_ZONE } = ZONE_NAMES;

const Phases: FC = () => {

    const dispatch = useDispatch();
    const { socket } = useContext(SocketContext);
    const { id: myUserId, username } = useSelector((state: RootState) => state.auth);
    const { matchId, match } = useSelector((state: RootState) => state.match);
    const [active, setActive] = useState('');

    useEffect(() => {
        
        socket?.on('setting-phase-opponent', (phase) => {
            setActive(phase);
        });

        return () => {
            socket?.off('setting-phase-opponent');
        }
        
    }, [socket]);

    const sendMessage = (text: string) => {
        
        const newMessage: Message = {
            id: myUserId as string,
            username: username as string,
            text,
            isAction: true
        };

        socket?.emit('personal-message', {
            matchId,
            message: newMessage
        }, (data: any) => {
            newMessage.date = data;
            dispatch(addMessageAction(newMessage));
            scrollToBottom('messages');
        });

    };

    const groupCards = () => {

        let newMatch = { ...match };        
        if (newMatch[ATTACK_ZONE].length) {
            newMatch[DEFENSE_ZONE] = [...newMatch[DEFENSE_ZONE], ...newMatch[ATTACK_ZONE]];        
            newMatch[ATTACK_ZONE] = [];
        }

        if (newMatch[GOLDS_PAID_ZONE].length) {
            newMatch[UNPAID_GOLD_ZONE] = [...newMatch[UNPAID_GOLD_ZONE], ...newMatch[GOLDS_PAID_ZONE]];        
            newMatch[GOLDS_PAID_ZONE] = [];
        }
        

        

        dispatch(changeMatch(newMatch));
    };

    const sendPhase = (phase: string) => {
        socket?.emit('setting-phase', {
            matchId,
            phase
        });
    };

    const onClick = (phase: string, textToSend: string) => {
        setActive(phase);
        sendMessage(textToSend);
        sendPhase(phase);
    };

    return (
        <>
            <Row gutter={[1, 1]} style={{ paddingTop: 2}}>
                <Col span={ 3 } className={ 'phase-1' === active ? 'phase active-phase animate__animated animate__heartBeat' : 'phase' } onClick={ () => {
                    onClick('phase-1', 'Pasando a <strong>Fase Agrupación</strong>');
                    groupCards();
                    
                }}>
                    <div className="div-button">
                        Fase Agrupación
                    </div>                    
                </Col>
                <Col span={ 3 } className={ 'phase-2' === active ? 'phase active-phase animate__animated animate__heartBeat' : 'phase' } onClick={ () => onClick('phase-2', 'Pasando a <strong>Fase Vigilia</strong>')}>
                    <div className="div-button">
                        Fase Vigilia
                    </div>
                </Col>
                <Col span={ 3 } className={ 'phase-3' === active ? 'phase active-phase animate__animated animate__heartBeat' : 'phase' } onClick={ () => onClick('phase-3', 'Pasando a <strong>Fase Ataque</strong>')}>
                    <div className="div-button">
                        Fase Ataque
                    </div>
                </Col>
                <Col span={ 3 } className={ 'phase-4' === active ? 'phase active-phase animate__animated animate__heartBeat' : 'phase' } onClick={ () => onClick('phase-4', 'Pasando a <strong>Fase Bloqueo</strong>')}>
                    <div className="div-button">
                        Fase Bloqueo
                    </div>
                </Col>
                <Col span={ 3 } className={ 'phase-5' === active ? 'phase active-phase animate__animated animate__heartBeat' : 'phase' } onClick={ () => onClick('phase-5', 'Pasando a <strong>Fase Guerrra Talismanes</strong>')}>
                    <div className="div-button">
                        Fase Guerrra Talismanes
                    </div>
                </Col>
                <Col span={ 3 } className={ 'phase-6' === active ? 'phase active-phase animate__animated animate__heartBeat' : 'phase' } onClick={ () => onClick('phase-6', 'Pasando a <strong>Fase Asignación de Daño</strong>')}>
                    <div className="div-button">
                        Fase Asignación de Daño
                    </div>                    
                </Col>
                <Col span={ 3 } className={ 'phase-7' === active ? 'phase active-phase animate__animated animate__heartBeat' : 'phase' } onClick={ () => onClick('phase-7', 'Pasando a <strong>Fase Final</strong>')}>
                    <div className="div-button">
                        Fase Final
                    </div>                    
                </Col>
                <Col span={ 3 } className={ 'phase-8' === active ? 'phase active-phase animate__animated animate__heartBeat' : 'phase' } onClick={ () => onClick('phase-8', 'TU TURNO!!!')}>
                    <div className="div-button">
                        Tu turno!
                    </div>
                    
                </Col>
            </Row>
        </>
    )
}

export default Phases;