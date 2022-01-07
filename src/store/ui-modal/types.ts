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
export const uiOpenModalViewXCastleOpponent = '[ui-modal] Open modal ViewCastle X Opponent';
export const uiCloseModalViewXCastleOpponent = '[ui-modal] Close modal ViewCastle X Opponent';

export const uiOpenModalViewCementery = '[ui-modal] Open modal ViewCementery';
export const uiCloseModalViewCementery = '[ui-modal] Close modal ViewCementery';
export const uiOpenModalViewExile = '[ui-modal] Open modal ViewExile';
export const uiCloseModalViewExile = '[ui-modal] Close modal ViewExile';
export const uiOpenModalViewRemoval = '[ui-modal] Open modal ViewRemoval';
export const uiCloseModalViewRemoval = '[ui-modal] Close modal ViewRemoval';
export const uiOpenModalViewAuxiliary = '[ui-modal] Open modal ViewAuxiliary';
export const uiCloseModalViewAuxiliary = '[ui-modal] Close modal ViewAuxiliary';

export const uiOpenModalViewCementeryOpponent = '[ui-modal] Open modal ViewCementery Opponent';
export const uiCloseModalViewCementeryOpponent = '[ui-modal] Close modal ViewCementery Opponent';
export const uiOpenModalViewExileOpponent = '[ui-modal] Open modal ViewExile Opponent';
export const uiCloseModalViewExileOpponent = '[ui-modal] Close modal ViewExile Opponent';
export const uiOpenModalViewRemovalOpponent = '[ui-modal] Open modal ViewRemoval Opponent';
export const uiCloseModalViewRemovalOpponent = '[ui-modal] Close modal ViewRemoval Opponent';
export const uiOpenModalViewAuxiliaryOpponent = '[ui-modal] Open modal ViewAuxiliary Opponent';
export const uiCloseModalViewAuxiliaryOpponent = '[ui-modal] Close modal ViewAuxiliary Opponent';

export const uiOpenModalViewHandOpponent = '[ui-modal] Open modal ViewHand Opponent';
export const uiCloseModalViewHandOpponent = '[ui-modal] Close modal ViewHand Opponent';

export const uiOpenModalTakeControlOpponentCard = '[ui-modal] Open modal Take Control Opponent Card';
export const uiCloseModalTakeControlOpponentCard = '[ui-modal] Close modal Take Control Opponent Card';

export const uiOpenModalAssignModal = '[ui-modal] Open modal Assign Weapon';
export const uiCloseModalAssignModal = '[ui-modal] Close modal Assign Weapon';

export const uiOpenModalSelectXCastleOpponent = '[ui-modal] Open modal SelectXcards Opponent';
export const uiCloseModalSelectXCastleOpponent = '[ui-modal] Close modal SelectXcards Opponent';

export const uiOpenModalDiscardOpponent = '[ui-modal] Open modal DiscardOpponent';
export const uiCloseModalDiscardOpponent = '[ui-modal] Close modal DiscardOpponent';

export const uiResetModal = '[ui-modal] Reset modals';

export type UiModalState = {
    modalOpenThrowXcards: boolean;
    modalOpenViewCastle: boolean;
    modalOpenViewXcards: boolean;
    modalOpenSelectXcards: boolean;
    modalOpenSelectXcardsOpponent: boolean;
    modalOpenViewCastleToOpponent: boolean;
    modalOpenXViewCastleToOpponent: boolean;

    modalOpenViewCementery: boolean;
    modalOpenViewExile: boolean;
    modalOpenViewRemoval: boolean;
    modalOpenViewAuxiliary: boolean;

    modalOpenViewCementeryOpponent: boolean;
    modalOpenViewExileOpponent: boolean;
    modalOpenViewRemovalOpponent: boolean;
    modalOpenViewAuxiliaryOpponent: boolean;

    modalOpenViewHandOpponent: boolean;

    modalOpenTakeControlOpponentCard: boolean;

    modalOpenAssignWeapon: boolean;

    modalOpenDiscardOpponent: boolean;
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

type ModalSelectXCastleOpenOpponentAction = {
    type: typeof uiOpenModalSelectXCastleOpponent;
};

type ModalSelectXCastleCloseOpponentAction = {
    type: typeof uiCloseModalSelectXCastleOpponent;
};

type ModalViewCastleOpponentOpenAction = {
    type: typeof uiOpenModalViewCastleOpponent;
};

type ModalViewCastleOpponentCloseAction = {
    type: typeof uiCloseModalViewCastleOpponent;
};

type ModalViewXCastleOpponentOpenAction = {
    type: typeof uiOpenModalViewXCastleOpponent;
};

type ModalViewXCastleOpponentCloseAction = {
    type: typeof uiCloseModalViewXCastleOpponent;
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

type ModalViewAuxiliaryOpenAction = {
    type: typeof uiOpenModalViewAuxiliary;
};

type ModalViewAuxiliaryCloseAction = {
    type: typeof uiCloseModalViewAuxiliary;
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

type ModalViewAuxiliaryOpponentOpenAction = {
    type: typeof uiOpenModalViewAuxiliaryOpponent;
};

type ModalViewAuxiliaryOpponentCloseAction = {
    type: typeof uiCloseModalViewAuxiliaryOpponent;
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

type ModalAssignWeaponOpenAction = {
    type: typeof uiOpenModalAssignModal
};

type ModalAssignWeaponCloseAction = {
    type: typeof uiCloseModalAssignModal
};

type ModalDiscardOpponentOpenAction = {
    type: typeof uiOpenModalDiscardOpponent
};

type ModalDiscardOpponentCloseAction = {
    type: typeof uiCloseModalDiscardOpponent
};

type ModalResetAction = {
    type: typeof uiResetModal
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
ModalSelectXCastleOpenOpponentAction |
ModalSelectXCastleCloseOpponentAction |
ModalViewCastleOpponentOpenAction |
ModalViewCastleOpponentCloseAction |
ModalViewXCastleOpponentOpenAction |
ModalViewXCastleOpponentCloseAction |

ModalViewCementeryOpenAction |
ModalViewCementeryCloseAction |
ModalViewExileOpenAction |
ModalViewExileCloseAction |
ModalViewRemovalOpenAction |
ModalViewRemovalCloseAction |
ModalViewAuxiliaryOpenAction |
ModalViewAuxiliaryCloseAction |

ModalViewCementeryOpponentOpenAction |
ModalViewCementeryOpponentCloseAction |
ModalViewExileOpponentOpenAction |
ModalViewExileOpponentCloseAction |
ModalViewRemovalOpponentOpenAction |
ModalViewRemovalOpponentCloseAction |
ModalViewAuxiliaryOpponentOpenAction |
ModalViewAuxiliaryOpponentCloseAction |

ModalViewHandOpponentOpenAction |
ModalViewHandOpponentCloseAction |
ModalTakeControlOpponentCardOpenAction |
ModalTakeControlOpponentCardCloseAction |
ModalAssignWeaponOpenAction |
ModalAssignWeaponCloseAction |
ModalDiscardOpponentOpenAction |
ModalDiscardOpponentCloseAction |
ModalResetAction;