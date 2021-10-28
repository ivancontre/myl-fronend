import React, { FC } from 'react'
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { ZONE_NAMES } from "../../constants";
import { RootState } from '../../store';
import { Card } from '../../store/card/types';
import { closeModalViewCastle } from '../../store/ui-modal/action';

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE } = ZONE_NAMES;

const ViewCastleModal: FC = () => {

    const { match } = useSelector((state: RootState) => state.match);

    const { modalOpenViewCastle } = useSelector((state: RootState) => state.uiModal);

    const dispatch = useDispatch();


    const handleCancelModal = () => {
        dispatch(closeModalViewCastle());
    };

    const handleOkModal = () => {

    };  

    return (
        <Modal width={1000} centered title={`Viendo ${CASTLE_ZONE}`} visible={ modalOpenViewCastle } onOk={ handleOkModal } onCancel={ handleCancelModal }>
            <p>Indique la cantidad de cartas desea botar desde el {CASTLE_ZONE} al {CEMETERY_ZONE}</p> 
                     
            
        </Modal>
    )
}

export default ViewCastleModal;