import { Card } from "../card/types";

export const deckAddNew = '[deck] Add new';
export const deckLoad = '[deck] Load';
export const deckUpdating = '[deck] Load';
export const deckLoadUpdating = '[deck] Load updating';
export const deckResetUpdating = '[deck] Reset updating';

export type Deck = {
    id?: string;
    name: string;
    cards: Card[];
};

export type DeckState = {
    decks: Deck[];
    deckUpdating: Deck | null;
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

export type DeckActionTypes = 
DeckAddNewAction | 
DeckLoadAction |
DeckLoadUpdatingAction |
DeckResetUpdatingAction;