export const cardAddNew = '[card] Add new';
export const cardLoad = '[card] Load';
export const cardLoadUpdating = '[card] Load updating';
export const cardResetUpdating = '[card] Reset updating';

export type Card = {
    id?: string;
    num: number;
    name: string;
    ability: string;
    legend: string;
    type: string;
    frecuency: string;
    edition: string;
    race: string;
    cost: number;
    strength: number;
    isMachinery: boolean;
    img: string;
    isUnique: boolean;
};

export type CardState = {
    cards: Card[];
    cardUpdating: Card | null
};

type CardAddNewAction = {    
    type: typeof cardAddNew,
    payload: Card
};

type CardLoadAction = {    
    type: typeof cardLoad,
    payload: Card[]
};

type CardLoadUpdatingAction = {    
    type: typeof cardLoadUpdating,
    payload: Card
};

type CardResetUpdatingAction = {    
    type: typeof cardResetUpdating
};

export type CardActionTypes = CardAddNewAction | CardLoadAction | CardLoadUpdatingAction | CardResetUpdatingAction;