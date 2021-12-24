import { CardActionTypes, cardAddNew, cardLoad, CardState, cardLoadUpdating, cardResetUpdating, cardUpdate, Card, cardByEdition, selectMyCards, cardsResetMySelection, cardDelete } from "./types";

const initialState: CardState = {
    cards: [],
    cardUpdating: null,
    cardsByEdition: [],
    selectMyCards: []
};

export const cardReducer = (state: typeof initialState = initialState, action: CardActionTypes): CardState => {

    switch (action.type) {

        case cardAddNew:
            return {
                ...state,
                cards: [...state.cards,  action.payload],
                cardUpdating: action.payload
            };

        case cardUpdate:
            return {
                ...state,
                cards: state.cards.map(
                    (e: Card) => (e.id === action.payload.id) ? action.payload : e
                )
            };

        case cardDelete:
            return {
                ...state,
                cards: state.cards.filter((e: Card) => e.id !== action.payload) as Card[],
            };

        case cardLoad:
            return {
                ...state,
                cards: [...action.payload]
            };

        case cardLoadUpdating:
            return {
                ...state,
                cardUpdating: state.cards.find((e: Card) => e.id === action.payload) as Card
            };

        case cardResetUpdating:
            return {
                ...state,
                cardUpdating: null
            };

        case cardByEdition:
            return {
                ...state,
                cardsByEdition: [...action.payload]
            };

        case selectMyCards:
            return {
                ...state,
                selectMyCards: [...action.payload]
            };

        case cardsResetMySelection:
            return {
                ...state,
                cardsByEdition: [],
                selectMyCards: []
            }
    

        default:
            return state;

    }
};