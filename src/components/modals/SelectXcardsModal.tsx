import { InputNumber, Modal } from 'antd';
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ZONE_NAMES } from "../../constants";
import { closeModalSelectXcards, openModalViewXCastle } from '../../store/ui-modal/action';
import { setAmountCardsViewAction } from '../../store/match/action';

const { CASTLE_ZONE } = ZONE_NAMES;

const SelectXcardsModal: FC = () => {

    const { match } = useSelector((state: RootState) => state.match);

    const { modalOpenSelectXcards } = useSelector((state: RootState) => state.uiModal);

    const dispatch = useDispatch();

    const handleOkModal = () => {
        dispatch(closeModalSelectXcards());
        dispatch(openModalViewXCastle());
    };

    const onChangeInputAmount = (value: number) => {
        dispatch(setAmountCardsViewAction(value))
    };    

    const handleCancelModal = () => {
        dispatch(closeModalSelectXcards());
        dispatch(setAmountCardsViewAction(1))
    };

    return (
        <Modal centered title="Ver Cartas" visible={ modalOpenSelectXcards } onOk={ handleOkModal } onCancel={ handleCancelModal } >
            <p>Indique la cantidad de cartas que desea ver</p>                
            <InputNumber min={ 1 } max={ match[CASTLE_ZONE].length } defaultValue={ 1 } onChange={ onChangeInputAmount }/>
        </Modal>
    )
}

export default SelectXcardsModal;