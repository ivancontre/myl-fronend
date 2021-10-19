import { CardActionTypes, cardAddNew, cardLoad, CardState, cardLoadUpdating, cardResetUpdating } from "./types";

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


        case cardLoad:
            return {
                ...state,
                cards: [...action.payload]
            };

        case cardLoadUpdating:
            return {
                ...state,
                cardUpdating: action.payload
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