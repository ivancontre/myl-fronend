import { ModalActionTypes, UiModalState, uiCloseModalThrowXcards, uiOpenModalThrowXcards, uiOpenModalViewCastle, uiCloseModalViewCastle } from "./types";

const initialState: UiModalState = {
    modalOpenThrowXcards: false,
    modalOpenViewCastle: false
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
    
        default:
            return state;
    }
};