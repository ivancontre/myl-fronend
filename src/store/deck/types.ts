import { Card } from "../card/types";

export const deckAddNew = '[deck] Add new';
export const deckLoad = '[deck] Load';
export const deckUpdating = '[deck] Load';
export const deckLoadUpdating = '[deck] Load updating';
export const deckResetUpdating = '[deck] Reset updating';
export const deckDelete = '[deck] Delete';
export const deckUpdate = '[deck] Update';
export const deckSetDefault = '[deck] Set default';
export const deckReset = '[deck] Reset';

export type Deck = {
    id?: string;
    name: string;
    cards: Card[];
    era?: string;
    byDefault: boolean;
};

export type DeckState = {
    decks: null | Deck[];
    deckUpdating: Deck | null;
    deckDefault: Deck | null;
};

type DeckAddNewAction = {    
    type: typeof deckAddNew,
    payload: Deck
};

type DeckLoadAction = {    
    type: typeof deckLoad,
    payload: Deck[]
};

type DeckLoadUpdatingAction = {    
    type: typeof deckLoadUpdating,
    payload: string
};

type DeckResetUpdatingAction = {    
    type: typeof deckResetUpdating
};

type DeckDeleteAction = {    
    type: typeof deckDelete,
    payload: string
};

type DeckUpdateAction = {
    type: typeof deckUpdate,
    payload: Deck
};

type DeckSetDefaultAction = {    
    type: typeof deckSetDefault,
    payload: any
};

type DeckResetAction = {
    type: typeof deckReset
};

export type DeckActionTypes = 
DeckAddNewAction | 
DeckLoadAction |
DeckLoadUpdatingAction |
DeckResetUpdatingAction |
DeckDeleteAction |
DeckUpdateAction |
DeckSetDefaultAction |
DeckResetAction;