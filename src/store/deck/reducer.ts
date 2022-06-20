import { DeckState, DeckActionTypes, deckAddNew, deckLoad, Deck, deckLoadUpdating, deckResetUpdating, deckDelete, deckUpdate, deckSetDefault, deckReset, deckSet } from "./types";

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
                    if (e.id === action.payload.id) {
                        return {
                            ...e,
                            byDefault: action.payload.isDefault
                        }
                    }

                    return e;
                })  as Deck[],
                deckDefault: action.payload.isDefault ? state.decks?.find((e: Deck) => e.id === action.payload.id) as Deck : null
            };

        case deckSet:
            return {
                ...state,
                deckUpdating: action.payload
            };

        case deckReset:
            return initialState;
    

        default:
            return state;

    }
};