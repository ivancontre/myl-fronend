import { ModalActionTypes, uiOpenModalThrowXcards, uiCloseModalThrowXcards, uiOpenModalViewCastle, uiCloseModalViewCastle } from './types';

export const openModalThrowXcards = (): ModalActionTypes => {
    return {
        type: uiOpenModalThrowXcards
    }
};

export const closeModalThrowXcards = (): ModalActionTypes => {
    return {
        type: uiCloseModalThrowXcards
    }
};

export const openModalViewCastle = (): ModalActionTypes => {
    return {
        type: uiOpenModalViewCastle
    }
};

export const closeModalViewCastle = (): ModalActionTypes => {
    return {
        type: uiCloseModalViewCastle
    }
};