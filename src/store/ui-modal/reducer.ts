import { 
    ModalActionTypes, 
    UiModalState, 
    uiCloseModalThrowXcards, 
    uiOpenModalThrowXcards, 
    uiOpenModalViewCastle, 
    uiCloseModalViewCastle, 
    uiOpenModalViewXCastle, 
    uiCloseModalViewXCastle, 
    uiOpenModalSelectXCastle, 
    uiCloseModalSelectXCastle, 
    uiCloseModalViewCastleOpponent, 
    uiOpenModalViewCastleOpponent, 
    uiOpenModalViewCementery, 
    uiCloseModalViewCementery, 
    uiOpenModalViewExile, 
    uiCloseModalViewExile, 
    uiOpenModalViewRemoval, 
    uiCloseModalViewRemoval, 
    uiCloseModalViewCementeryOpponent, 
    uiOpenModalViewExileOpponent, 
    uiOpenModalViewCementeryOpponent, 
    uiCloseModalViewExileOpponent, 
    uiOpenModalViewRemovalOpponent, 
    uiCloseModalViewRemovalOpponent,
    uiOpenModalViewHandOpponent,
    uiCloseModalViewHandOpponent,
    uiOpenModalTakeControlOpponentCard,
    uiCloseModalTakeControlOpponentCard,
    uiOpenModalAssignModal,
    uiCloseModalAssignModal,
    uiResetModal,
    uiOpenModalViewAuxiliary,
    uiCloseModalViewAuxiliary,
    uiOpenModalViewAuxiliaryOpponent,
    uiCloseModalViewAuxiliaryOpponent,
    uiCloseModalSelectXCastleOpponent,
    uiOpenModalSelectXCastleOpponent,
    uiOpenModalViewXCastleOpponent,
    uiCloseModalViewXCastleOpponent,
    uiCloseModalDiscardOpponent,
    uiOpenModalDiscardOpponent,
    uiOpenModalDestinyCastleOptions,
    uiCloseModalDestinyCastleOptions
} from "./types";


const initialState: UiModalState = {
    modalOpenThrowXcards: false,
    modalOpenViewCastle: false,
    modalOpenViewXcards: false,
    modalOpenSelectXcards: false,
    modalOpenSelectXcardsOpponent: false,
    modalOpenViewCastleToOpponent: false,
    modalOpenXViewCastleToOpponent: false,

    modalOpenViewCementery: false,
    modalOpenViewExile: false,
    modalOpenViewRemoval: false,
    modalOpenViewAuxiliary: false,

    modalOpenViewCementeryOpponent: false,
    modalOpenViewExileOpponent: false,
    modalOpenViewRemovalOpponent: false,
    modalOpenViewAuxiliaryOpponent: false,

    modalOpenViewHandOpponent: false,

    modalOpenTakeControlOpponentCard: false,

    modalOpenAssignWeapon: false,

    modalOpenDiscardOpponent: false,

    modalDestinyCastleOptions: false
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

        
        case uiOpenModalViewCastleOpponent:            
            return {
                ...state,
                modalOpenViewCastleToOpponent: true
            };

        case uiCloseModalViewCastleOpponent:        
            return {
                ...state,
                modalOpenViewCastleToOpponent: false
            };

        case uiOpenModalViewXCastleOpponent:            
            return {
                ...state,
                modalOpenXViewCastleToOpponent: true
            };

        case uiCloseModalViewXCastleOpponent:        
            return {
                ...state,
                modalOpenXViewCastleToOpponent: false
            };

        /** */
        case uiOpenModalViewCementery:        
            return {
                ...state,
                modalOpenViewCementery: true
            };
        
        case uiCloseModalViewCementery:        
            return {
                ...state,
                modalOpenViewCementery: false
            };

        case uiOpenModalViewExile:        
            return {
                ...state,
                modalOpenViewExile: true
            };
        
        case uiCloseModalViewExile:        
            return {
                ...state,
                modalOpenViewExile: false
            };

        case uiOpenModalViewRemoval:        
            return {
                ...state,
                modalOpenViewRemoval: true
            };
        
        case uiCloseModalViewRemoval:        
            return {
                ...state,
                modalOpenViewRemoval: false
            };

        case uiOpenModalViewAuxiliary:        
            return {
                ...state,
                modalOpenViewAuxiliary: true
            };
        
        case uiCloseModalViewAuxiliary:        
            return {
                ...state,
                modalOpenViewAuxiliary: false
            };

        /** */
        case uiOpenModalViewCementeryOpponent:        
            return {
                ...state,
                modalOpenViewCementeryOpponent: true
            };

        case uiCloseModalViewCementeryOpponent:        
            return {
                ...state,
                modalOpenViewCementeryOpponent: false
            };

        case uiOpenModalViewExileOpponent:        
            return {
                ...state,
                modalOpenViewExileOpponent: true
            };
        
        case uiCloseModalViewExileOpponent:        
            return {
                ...state,
                modalOpenViewExileOpponent: false
            };

        case uiOpenModalViewRemovalOpponent:        
            return {
                ...state,
                modalOpenViewRemovalOpponent: true
            };
        
        case uiCloseModalViewRemovalOpponent:        
            return {
                ...state,
                modalOpenViewRemovalOpponent: false
            };

        case uiOpenModalViewAuxiliaryOpponent:        
            return {
                ...state,
                modalOpenViewAuxiliaryOpponent: true
            };
        
        case uiCloseModalViewAuxiliaryOpponent:        
            return {
                ...state,
                modalOpenViewAuxiliaryOpponent: false
            };

        case uiOpenModalViewHandOpponent:        
            return {
                ...state,
                modalOpenViewHandOpponent: true
            };
        
        case uiCloseModalViewHandOpponent:        
            return {
                ...state,
                modalOpenViewHandOpponent: false
            };


        case uiOpenModalTakeControlOpponentCard:        
            return {
                ...state,
                modalOpenTakeControlOpponentCard: true
            };
        
        case uiCloseModalTakeControlOpponentCard:        
            return {
                ...state,
                modalOpenTakeControlOpponentCard: false
            };

        case uiOpenModalAssignModal:
            return {
                ...state,
                modalOpenAssignWeapon: true
            };

        case uiCloseModalAssignModal:
            return {
                ...state,
                modalOpenAssignWeapon: false
            };

        case uiCloseModalSelectXCastleOpponent: {
            return {
                ...state,
                modalOpenSelectXcardsOpponent: false
            }
        }

        case uiOpenModalSelectXCastleOpponent: {
            return {
                ...state,
                modalOpenSelectXcardsOpponent: true
            }
        }

        case uiCloseModalDiscardOpponent: {
            return {
                ...state,
                modalOpenDiscardOpponent: false
            }
        }

        case uiOpenModalDiscardOpponent: {
            return {
                ...state,
                modalOpenDiscardOpponent: true
            }
        }

        case uiOpenModalDestinyCastleOptions: {
            return {
                ...state,
                modalDestinyCastleOptions: true
            }
        }

        case uiCloseModalDestinyCastleOptions: {
            return {
                ...state,
                modalDestinyCastleOptions: false
            }
        }

        case uiResetModal:
            return initialState;

        default:
            return state;
    }
};