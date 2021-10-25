import { MatchState, MatchActionTypes, change, setActiveUsers, setMatchId, setDeck, resetMatchValues } from "./types";

const initialState: MatchState = {
    matchId: null,
    match: {},
    activeUsers: [],
    deckByPlay: null
};

export const matchReducer = (state: typeof initialState = initialState, action: MatchActionTypes): MatchState => {

    switch (action.type) {

        case change:
            return {
                ...state,
                match: {...action.payload}

            };

        case setActiveUsers:
            return {
                ...state,
                activeUsers: [...action.payload]
            }

        case setMatchId:
            return {
                ...state,
                matchId: action.payload
            }

        case setDeck:
            return {
                ...state,
                deckByPlay: {...action.payload}
            }

        case resetMatchValues:
            return initialState;
    
        default:
            return state;
    }

};