import { DeckState, DeckActionTypes, deckAddNew, deckLoad, Deck, deckLoadUpdating, deckResetUpdating } from "./types";

const initialState: DeckState = {
    decks: [],
    deckUpdating: null
};

export const deckReducer = (state: typeof initialState = initialState, action: DeckActionTypes): DeckState => {

    switch (action.type) {

        case deckAddNew:
            return {
                ...state,
                decks: [...state.decks,  action.payload]
            };

        case deckLoad:
            return {
                ...state,
                decks: [...action.payload]
            };

        case deckLoadUpdating:
            return {
                ...state,
                deckUpdating: state.decks.find((e: Deck) => e.id === action.payload) as Deck
            };

        case deckResetUpdating:
            return {
                ...state,
                deckUpdating: null
            };

        default:
            return state;

    }
};