export const uiOpenModalThrowXcards = '[ui-modal] Open modal ThrowXcards';
export const uiCloseModalThrowXcards = '[ui-modal] Close modal ThrowXcards';

export const uiOpenModalViewCastle = '[ui-modal] Open modal ViewCastle';
export const uiCloseModalViewCastle = '[ui-modal] Close modal ViewCastle';

export const uiOpenModalViewXCastle = '[ui-modal] Open modal ViewXCastle';
export const uiCloseModalViewXCastle = '[ui-modal] Close modal ViewXCastle';

export const uiOpenModalSelectXCastle = '[ui-modal] Open modal SelectXcards';
export const uiCloseModalSelectXCastle = '[ui-modal] Close modal SelectXcards';

export type UiModalState = {
    modalOpenThrowXcards: boolean;
    modalOpenViewCastle: boolean;
    modalOpenViewXcards: boolean;
    modalOpenSelectXcards: boolean;
};

type ModalThrowXcardsOpenAction = {
    type: typeof uiOpenModalThrowXcards;
};

type ModalThrowXcardsCloseAction = {
    type: typeof uiCloseModalThrowXcards;
};

type ModalViewCastleOpenAction = {
    type: typeof uiOpenModalViewCastle;
};

type ModalViewCastleCloseAction = {
    type: typeof uiCloseModalViewCastle;
};

type ModalViewXCastleOpenAction = {
    type: typeof uiOpenModalViewXCastle;
};

type ModalViewXCastleCloseAction = {
    type: typeof uiCloseModalViewXCastle;
};

type ModalSelectXCastleOpenAction = {
    type: typeof uiOpenModalSelectXCastle;
};

type ModalSelectXCastleCloseAction = {
    type: typeof uiCloseModalSelectXCastle;
};

export type ModalActionTypes = 
ModalThrowXcardsOpenAction | 
ModalThrowXcardsCloseAction | 
ModalViewCastleOpenAction | 
ModalViewCastleCloseAction | 
ModalViewXCastleOpenAction |
ModalViewXCastleCloseAction | 
ModalSelectXCastleOpenAction |
ModalSelectXCastleCloseAction;