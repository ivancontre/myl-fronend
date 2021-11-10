import { Divider, Image, Modal, Radio, Space, Typography } from 'antd';
import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { closeModalAssignWeapon } from '../../store/ui-modal/action';
import { ZONE_NAMES } from "../../constants";
import { Card } from '../../store/card/types';
import { changeMatch, setWeaponAction } from '../../store/match/action';

const { DEFENSE_ZONE, ATTACK_ZONE, SUPPORT_ZONE } = ZONE_NAMES;

const { Title } = Typography;

const AssingWeaponModal: FC = () => {


    const dispatch = useDispatch();

    const { modalOpenAssignWeapon } = useSelector((state: RootState) => state.uiModal);
    const { match, opponentMatch, opponentId, selectedWeapon } = useSelector((state: RootState) => state.match);
    const { id } = useSelector((state: RootState) => state.auth);

    const [optionZone, setOptionZone] = useState(id);
    const [optionCarrier, setOptionCarrier] = useState('');


    const handleCancelModal = () => {
        dispatch(setWeaponAction(null));
        dispatch(closeModalAssignWeapon());
    };

    const handleOkModal = () => {

        if (optionCarrier === '') {
            return;
        }

        const [zone, i] = optionCarrier.split('_');

        if (optionZone === id) {
            const newMatch = { ...match };
            newMatch[zone] = newMatch[zone].map((card: Card, index: number) => {
                if (Number(i) === index) {
                    const arms = card.armsId ? card.armsId : []
                    return {
                        ...card,
                        armsId: [...arms, selectedWeapon.id]
                    }
                } else {
                    return card;
                }
            });

            dispatch(changeMatch(newMatch));

        } else {

        }
        
        dispatch(setWeaponAction(null));


    };

    const onChangeZone = (e: any) => {
        setOptionZone(e.target.value)
    };

    const onChangeCarrier = (e: any) => {
        

        console.log(e.target.value)
        setOptionCarrier(e.target.value)
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
                                match[DEFENSE_ZONE].length > 0 && (
                                    <div className="zone-flex"  style={{display: 'block'}} >
                                        <Title level={4}>{DEFENSE_ZONE}</Title>
                                        <Radio.Group value={ optionCarrier } onChange={ onChangeCarrier }>
                                            <Space direction="horizontal">
                                                {
                                                    match[DEFENSE_ZONE].map((card: Card, index: number) => (
                                                        <Radio value={ DEFENSE_ZONE + '_' + index } key={ index }>
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
                                match[ATTACK_ZONE].length > 0 && (
                                    <div className="zone-flex"  style={{display: 'block'}} >
                                        <Title level={4}>{ATTACK_ZONE}</Title>
                                        <Radio.Group value={ optionCarrier } onChange={ onChangeCarrier }>
                                            <Space direction="horizontal">
                                                {
                                                    match[ATTACK_ZONE].map((card: Card, index: number) => (
                                                        <Radio value={ ATTACK_ZONE + '_' + index } key={ index }>
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
                                opponentMatch[DEFENSE_ZONE].length > 0 && (
                                    <div className="zone-flex"  style={{display: 'block'}} >
                                        <Title level={4}>{DEFENSE_ZONE}</Title>
                                        <Radio.Group value={ optionCarrier } onChange={ onChangeCarrier }>
                                            <Space direction="horizontal">
                                                {
                                                    opponentMatch[DEFENSE_ZONE].map((card: Card, index: number) => (
                                                        <Radio value={ DEFENSE_ZONE + '_' + index } key={ index }>
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
                                opponentMatch[ATTACK_ZONE].length > 0 && (
                                    <div className="zone-flex"  style={{display: 'block'}} >
                                        <Title level={4}>{ATTACK_ZONE}</Title>
                                        <Radio.Group value={ optionCarrier } onChange={ onChangeCarrier }>
                                            <Space direction="horizontal">
                                                {
                                                    opponentMatch[ATTACK_ZONE].map((card: Card, index: number) => (
                                                        <Radio value={ ATTACK_ZONE + '_' + index } key={ index }>
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