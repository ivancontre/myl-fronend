import { DescriptionCardActionTypes, DescriptionState, editionsCardLoad, frecuenciesCardLoad, racesCardLoad, typesCardLoad } from "./types";


const initialState: DescriptionState = {
    types: [],
    frecuencies: [],
    races: [],
    editions: []
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
    

        default:
            return state;

    }
};