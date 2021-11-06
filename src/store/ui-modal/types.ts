export const uiOpenModalThrowXcards = '[ui-modal] Open modal ThrowXcards';
export const uiCloseModalThrowXcards = '[ui-modal] Close modal ThrowXcards';

export const uiOpenModalViewCastle = '[ui-modal] Open modal ViewCastle';
export const uiCloseModalViewCastle = '[ui-modal] Close modal ViewCastle';

export const uiOpenModalViewXCastle = '[ui-modal] Open modal ViewXCastle';
export const uiCloseModalViewXCastle = '[ui-modal] Close modal ViewXCastle';

export const uiOpenModalSelectXCastle = '[ui-modal] Open modal SelectXcards';
export const uiCloseModalSelectXCastle = '[ui-modal] Close modal SelectXcards';

export const uiOpenModalViewCastleOpponent = '[ui-modal] Open modal ViewCastle Opponent';
export const uiCloseModalViewCastleOpponent = '[ui-modal] Close modal ViewCastle Opponent';

export const uiOpenModalViewCementery = '[ui-modal] Open modal ViewCementery';
export const uiCloseModalViewCementery = '[ui-modal] Close modal ViewCementery';
export const uiOpenModalViewExile = '[ui-modal] Open modal ViewExile';
export const uiCloseModalViewExile = '[ui-modal] Close modal ViewExile';
export const uiOpenModalViewRemoval = '[ui-modal] Open modal ViewRemoval';
export const uiCloseModalViewRemoval = '[ui-modal] Close modal ViewRemoval';

export const uiOpenModalViewCementeryOpponent = '[ui-modal] Open modal ViewCementery Opponent';
export const uiCloseModalViewCementeryOpponent = '[ui-modal] Close modal ViewCementery Opponent';
export const uiOpenModalViewExileOpponent = '[ui-modal] Open modal ViewExile Opponent';
export const uiCloseModalViewExileOpponent = '[ui-modal] Close modal ViewExile Opponent';
export const uiOpenModalViewRemovalOpponent = '[ui-modal] Open modal ViewRemoval Opponent';
export const uiCloseModalViewRemovalOpponent = '[ui-modal] Close modal ViewRemoval Opponent';

export const uiOpenModalViewHandOpponent = '[ui-modal] Open modal ViewHand Opponent';
export const uiCloseModalViewHandOpponent = '[ui-modal] Close modal ViewHand Opponent';

export const uiOpenModalTakeControlOpponentCard = '[ui-modal] Open modal Take Control Opponent Card';
export const uiCloseModalTakeControlOpponentCard = '[ui-modal] Close modal Take Control Opponent Card';


export type UiModalState = {
    modalOpenThrowXcards: boolean;
    modalOpenViewCastle: boolean;
    modalOpenViewXcards: boolean;
    modalOpenSelectXcards: boolean;
    modalOpenViewCastleToOpponent: boolean;

    modalOpenViewCementery: boolean;
    modalOpenViewExile: boolean;
    modalOpenViewRemoval: boolean;

    modalOpenViewCementeryOpponent: boolean;
    modalOpenViewExileOpponent: boolean;
    modalOpenViewRemovalOpponent: boolean;

    modalOpenViewHandOpponent: boolean;

    modalOpenTakeControlOpponentCard: boolean;
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

type ModalViewCastleOpponentOpenAction = {
    type: typeof uiOpenModalViewCastleOpponent;
};

type ModalViewCastleOpponentCloseAction = {
    type: typeof uiCloseModalViewCastleOpponent;
};

/** **/
type ModalViewCementeryOpenAction = {
    type: typeof uiOpenModalViewCementery;
};

type ModalViewCementeryCloseAction = {
    type: typeof uiCloseModalViewCementery;
};

type ModalViewExileOpenAction = {
    type: typeof uiOpenModalViewExile;
};

type ModalViewExileCloseAction = {
    type: typeof uiCloseModalViewExile;
};

type ModalViewRemovalOpenAction = {
    type: typeof uiOpenModalViewRemoval;
};

type ModalViewRemovalCloseAction = {
    type: typeof uiCloseModalViewRemoval;
};

/** **/
type ModalViewCementeryOpponentOpenAction = {
    type: typeof uiOpenModalViewCementeryOpponent;
};

type ModalViewCementeryOpponentCloseAction = {
    type: typeof uiCloseModalViewCementeryOpponent;
};

type ModalViewExileOpponentOpenAction = {
    type: typeof uiOpenModalViewExileOpponent;
};

type ModalViewExileOpponentCloseAction = {
    type: typeof uiCloseModalViewExileOpponent;
};

type ModalViewRemovalOpponentOpenAction = {
    type: typeof uiOpenModalViewRemovalOpponent;
};

type ModalViewRemovalOpponentCloseAction = {
    type: typeof uiCloseModalViewRemovalOpponent;
};


type ModalViewHandOpponentOpenAction = {
    type: typeof uiOpenModalViewHandOpponent;
};

type ModalViewHandOpponentCloseAction = {
    type: typeof uiCloseModalViewHandOpponent;
};

type ModalTakeControlOpponentCardOpenAction = {
    type: typeof uiOpenModalTakeControlOpponentCard
};

type ModalTakeControlOpponentCardCloseAction = {
    type: typeof uiCloseModalTakeControlOpponentCard
};

export type ModalActionTypes = 
ModalThrowXcardsOpenAction | 
ModalThrowXcardsCloseAction | 
ModalViewCastleOpenAction | 
ModalViewCastleCloseAction | 
ModalViewXCastleOpenAction |
ModalViewXCastleCloseAction | 
ModalSelectXCastleOpenAction |
ModalSelectXCastleCloseAction |
ModalViewCastleOpponentOpenAction |
ModalViewCastleOpponentCloseAction |
ModalViewCementeryOpenAction |
ModalViewCementeryCloseAction |
ModalViewExileOpenAction |
ModalViewExileCloseAction |
ModalViewRemovalOpenAction |
ModalViewRemovalCloseAction |
ModalViewCementeryOpponentOpenAction |
ModalViewCementeryOpponentCloseAction |
ModalViewExileOpponentOpenAction |
ModalViewExileOpponentCloseAction |
ModalViewRemovalOpponentOpenAction |
ModalViewRemovalOpponentCloseAction |
ModalViewHandOpponentOpenAction |
ModalViewHandOpponentCloseAction |
ModalTakeControlOpponentCardOpenAction |
ModalTakeControlOpponentCardCloseAction;