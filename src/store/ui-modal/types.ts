export const uiOpenModalThrowXcards = '[ui-modal] Open modal ThrowXcards';
export const uiCloseModalThrowXcards = '[ui-modal] Close modal ThrowXcards';

export const uiOpenModalViewCastle = '[ui-modal] Open modal ViewCastle';
export const uiCloseModalViewCastle = '[ui-modal] Close modal ViewCastle';

export type UiModalState = {
    modalOpenThrowXcards: boolean;
    modalOpenViewCastle: boolean;
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

export type ModalActionTypes = ModalThrowXcardsOpenAction | ModalThrowXcardsCloseAction | ModalViewCastleOpenAction | ModalViewCastleCloseAction;