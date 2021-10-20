import { CardActionTypes, cardAddNew, cardLoad, CardState, cardLoadUpdating, cardResetUpdating, cardUpdate, Card } from "./types";

const initialState: CardState = {
    cards: [],
    cardUpdating: null
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

        default:
            return state;

    }
};