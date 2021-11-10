import { Divider, Image, Modal, Radio, Space } from 'antd';
import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { closeModalAssignWeapon } from '../../store/ui-modal/action';
import { ZONE_NAMES } from "../../constants";
import { Card } from '../../store/card/types';

const { DEFENSE_ZONE, ATTACK_ZONE } = ZONE_NAMES;

const AssingWeaponModal: FC = () => {


    const dispatch = useDispatch();

    const { modalOpenAssignWeapon } = useSelector((state: RootState) => state.uiModal);
    const { match, opponentMatch, opponentId } = useSelector((state: RootState) => state.match);
    const { id } = useSelector((state: RootState) => state.auth);

    const [optionZone, setOptionZone] = useState(id);


    const handleCancelModal = () => {
        dispatch(closeModalAssignWeapon());
    };

    const handleOkModal = () => {

    };

    const onChangeZone = (e: any) => {
        setOptionZone(e.target.value)
    }


    return (
        <Modal centered title="Seleccionando portador..." visible={ modalOpenAssignWeapon } onOk={ handleOkModal } onCancel={ handleCancelModal } width={1000} >
            <p>Seleccione la arena en donde quiere jugar esta Arma</p>
            <Radio.Group value={ optionZone } onChange={ onChangeZone }>

                <Space direction="vertical">
                    <Radio value={ id }>Mi Zona</Radio>
                    <Radio value={ opponentId }>Zona Oponente</Radio>
                </Space>

                {
                    optionZone === id && (
                        match[DEFENSE_ZONE].map((card: Card, index: number) => (
                            <Image
                                width={ 33 }
                                height={ 50 }
                                src={ card.img }
                            />    
                        ))
                    )
                }

                {
                    optionZone === opponentId && (
                        opponentMatch[DEFENSE_ZONE].map((card: Card, index: number) => (
                            <Image
                                width={ 33 }
                                height={ 50 }
                                src={ card.img }
                            />    
                        ))
                    )
                }

            </Radio.Group>
        </Modal>
    )
}

export default AssingWeaponModal;