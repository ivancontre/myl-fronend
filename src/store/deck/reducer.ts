import { DeckState, DeckActionTypes, deckAddNew, deckLoad, Deck, deckLoadUpdating, deckResetUpdating, deckDelete, deckUpdate, deckSetDefault, deckReset } from "./types";

const initialState: DeckState = {
    decks: null,
    deckUpdating: null,
    deckDefault: null
};

export const deckReducer = (state: typeof initialState = initialState, action: DeckActionTypes): DeckState => {

    switch (action.type) {

        case deckAddNew:
            return {
                ...state,
                decks: [...state.decks as Deck[],  action.payload]
            };

        case deckLoad:
            return {
                ...state,
                decks: [...action.payload],
                deckDefault: action.payload.find((e: Deck) => e.byDefault === true ) as Deck
            };

        case deckLoadUpdating:
            return {
                ...state,
                deckUpdating: state.decks?.find((e: Deck) => e.id === action.payload) as Deck
            };

        case deckResetUpdating:
            return {
                ...state,
                deckUpdating: null
            };

        case deckDelete:
            return {
                ...state,
                decks: state.decks?.filter((e: Deck) => e.id !== action.payload) as Deck[],
                deckDefault: state.deckDefault?.id === action.payload ? null : state.deckDefault
            };

        case deckUpdate:
            return {
                ...state,
                decks: state.decks?.map(
                    (e: Deck) => (e.id === action.payload.id) ? action.payload : e
                )  as Deck[]
            }
        
        case deckSetDefault:
            return {
                ...state,
                decks: state.decks?.map((e: Deck) => {
                    if (e.id === action.payload) {
                        return {
                            ...e,
                            byDefault: true
                        }
                    }

                    return e;
                })  as Deck[],
                deckDefault: state.decks?.find((e: Deck) => e.id === action.payload) as Deck
            };

        case deckReset:
            return initialState;
    

        default:
            return state;

    }
};