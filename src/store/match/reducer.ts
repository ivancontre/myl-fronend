import { MatchState, MatchActionTypes, change } from "./types";

const initialState: MatchState = {
    match: {}
};

export const matchReducer = (state: typeof initialState = initialState, action: MatchActionTypes): MatchState => {

    switch (action.type) {

        case change:
            return {
                ...state,
                match: {...action.payload}

            };
    
        default:
            return state;
    }

};