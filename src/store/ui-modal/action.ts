import { ModalActionTypes, uiOpenModalThrowXcards, uiCloseModalThrowXcards, uiOpenModalViewCastle, uiCloseModalViewCastle, uiCloseModalViewXCastle, uiOpenModalViewXCastle, uiOpenModalSelectXCastle, uiCloseModalSelectXCastle } from './types';

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

export const openModalViewXCastle = (): ModalActionTypes => {
    return {
        type: uiOpenModalViewXCastle
    }
};

export const closeModalViewXCastle = (): ModalActionTypes => {
    return {
        type: uiCloseModalViewXCastle
    }
};

export const openModalSelectXcards = (): ModalActionTypes => {
    return {
        type: uiOpenModalSelectXCastle
    }
};

export const closeModalSelectXcards = (): ModalActionTypes => {
    return {
        type: uiCloseModalSelectXCastle
    }
};