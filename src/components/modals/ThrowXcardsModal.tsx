import { InputNumber, Modal } from 'antd';
import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ZONE_NAMES } from "../../constants";
import { throwXcards } from '../../helpers/throwsCards';
import { changeMatch } from '../../store/match/action';
import { closeModalThrowXcards } from '../../store/ui-modal/action';

const { CASTLE_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CEMETERY_ZONE, EXILE_ZONE, REMOVAL_ZONE, SUPPORT_ZONE, HAND_ZONE } = ZONE_NAMES;

const ThrowXcardsModal: FC = () => {

    const { match } = useSelector((state: RootState) => state.match);

    const { modalOpenThrowXcards } = useSelector((state: RootState) => state.uiModal);

    const [amountThrowXcards, setAmountModalThrowXcards] = useState(1);

    const dispatch = useDispatch();

    const handleOkModal = () => {
        const newMatch = throwXcards(amountThrowXcards, match, CASTLE_ZONE, CEMETERY_ZONE);
        dispatch(changeMatch(newMatch));
        dispatch(closeModalThrowXcards());
    };

    const onChangeInputAmount = (value: number) => {
        setAmountModalThrowXcards(value);
    };    

    const handleCancelModal = () => {
        dispatch(closeModalThrowXcards());
    };

    return (
        <Modal centered title="Botar Cartas" visible={ modalOpenThrowXcards } onOk={ handleOkModal } onCancel={ handleCancelModal }>
            <p>Indique la cantidad de cartas que desea botar desde el {CASTLE_ZONE} al {CEMETERY_ZONE}</p>                
            <InputNumber min={ 1 } max={ match[CASTLE_ZONE].length } defaultValue={ 1 } onChange={ onChangeInputAmount }/>
        </Modal>
    )
}

export default ThrowXcardsModal;