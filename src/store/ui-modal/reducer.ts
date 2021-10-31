import { ModalActionTypes, UiModalState, uiCloseModalThrowXcards, uiOpenModalThrowXcards, uiOpenModalViewCastle, uiCloseModalViewCastle, uiOpenModalViewXCastle, uiCloseModalViewXCastle, uiOpenModalSelectXCastle, uiCloseModalSelectXCastle } from "./types";

const initialState: UiModalState = {
    modalOpenThrowXcards: false,
    modalOpenViewCastle: false,
    modalOpenViewXcards: false,
    modalOpenSelectXcards: false
};

export const uiModalReducer = (state: typeof initialState = initialState, action: ModalActionTypes): UiModalState => {

    switch (action.type) {
        case uiOpenModalThrowXcards:            
            return {
                ...state,
                modalOpenThrowXcards: true
            };

        case uiCloseModalThrowXcards:        
            return {
                ...state,
                modalOpenThrowXcards: false
            };

        case uiOpenModalViewCastle:            
            return {
                ...state,
                modalOpenViewCastle: true
            };

        case uiCloseModalViewCastle:        
            return {
                ...state,
                modalOpenViewCastle: false
            };

        case uiOpenModalViewXCastle:            
            return {
                ...state,
                modalOpenViewXcards: true
            };

        case uiCloseModalViewXCastle:        
            return {
                ...state,
                modalOpenViewXcards: false
            };

        case uiOpenModalSelectXCastle:            
            return {
                ...state,
                modalOpenSelectXcards: true
            };

        case uiCloseModalSelectXCastle:
            return {
                ...state,
                modalOpenSelectXcards: false
            };

        default:
            return state;
    }
};