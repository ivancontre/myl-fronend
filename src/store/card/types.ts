export const cardAddNew = '[card] Add new';
export const cardLoad = '[card] Load';
export const cardLoadUpdating = '[card] Load updating';
export const cardResetUpdating = '[card] Reset updating';
export const cardUpdate = '[card] Update';
export const cardDelete = '[card] Delete';
export const cardByEdition = '[card] By edition';
export const selectMyCards = '[card] My select';
export const cardsToMySelection = '[card] To my selection';
export const cardsToOrigin = '[card] To origin';
export const cardsResetMySelection = '[card] Reset my selection';

export type Card = {
    id?: string;
    idx?: string;
    num: number;
    name: string;
    ability?: string;
    legend: string;
    type: string;
    frecuency: string;
    edition: string;
    era: string;
    race?: string;
    cost?: number;
    strength?: string;
    isMachinery: boolean;
    img: string;
    isUnique: boolean;
    user: string;

    isOpponent?: boolean;    
    armsId?: string[];
    bearerId?: string;
    vibrate?: boolean;
};

export type CardState = {
    cards: Card[];
    cardUpdating: Card | null;
    cardsByEdition: Card[];
    selectMyCards: Card[];
};

type CardAddNewAction = {    
    type: typeof cardAddNew,
    payload: Card
};

type CardUpdateAction = {    
    type: typeof cardUpdate,
    payload: Card
};

type CardDeleteAction = {    
    type: typeof cardDelete,
    payload: string
};

type CardLoadAction = {    
    type: typeof cardLoad,
    payload: Card[]
};

type CardLoadUpdatingAction = {    
    type: typeof cardLoadUpdating,
    payload: string
};

type CardResetUpdatingAction = {    
    type: typeof cardResetUpdating
};

type CardByEditionAction = {    
    type: typeof cardByEdition,
    payload: Card[]
};

type SelectMyCardsAction = {    
    type: typeof selectMyCards,
    payload: Card[]
};

type CardsToMySelection = {    
    type: typeof cardsToMySelection,
    payload: Card[]
};

type CardsToOrigin = {    
    type: typeof cardsToOrigin,
    payload: Card[]
};

type CardResetMySelectionAction = {    
    type: typeof cardsResetMySelection
};


export type CardActionTypes = 

CardAddNewAction | 
CardLoadAction | 
CardLoadUpdatingAction | 
CardResetUpdatingAction | 
CardUpdateAction | 
CardByEditionAction | 
SelectMyCardsAction |
CardsToMySelection |
CardsToOrigin | 
CardResetMySelectionAction |
CardDeleteAction;