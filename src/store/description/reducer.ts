import { DescriptionCardActionTypes, DescriptionState, editionsCardLoad, erasCardLoad, frecuenciesCardLoad, racesCardLoad, resetDescription, typesCardLoad, erasCardsAvailableLoad } from "./types";


const initialState: DescriptionState = {
    types: [],
    frecuencies: [],
    races: [],
    editions: [],
    eras: [],
    cardsAvailabe: []
};

export const descriptionReducer = (state: typeof initialState = initialState, action: DescriptionCardActionTypes): DescriptionState => {

    switch (action.type) {

        case typesCardLoad:
            return {
                ...state,
                types: [...action.payload]
            };

        case frecuenciesCardLoad:
            return {
                ...state,
                frecuencies: [...action.payload]
            };

        case racesCardLoad:
            return {
                ...state,
                races: [...action.payload]
            };

        case editionsCardLoad:
            return {
                ...state,
                editions: [...action.payload]
            };

        case erasCardLoad:
            return {
                ...state,
                eras: [...action.payload]
            };

        case erasCardsAvailableLoad:
            return {
                ...state,
                cardsAvailabe: [...action.payload]
            };

        case resetDescription:
            return initialState;
    

        default:
            return state;

    }
};