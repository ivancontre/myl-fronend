import { MatchState, MatchActionTypes, change, setActiveUsers, setMatchId, resetMatchValues, setOpponentId, changeOpponent } from "./types";

const initialState: MatchState = {
    matchId: null,
    match: {},
    opponentMatch: {},
    opponentId: null,
    activeUsers: [],
};

export const matchReducer = (state: typeof initialState = initialState, action: MatchActionTypes): MatchState => {

    switch (action.type) {

        case change:
            return {
                ...state,
                match: {...action.payload}

            };

        case changeOpponent:
            return {
                ...state,
                opponentMatch: {...action.payload}

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
        case setOpponentId:
            return {
                ...state,
                opponentId: action.payload
            }

        case resetMatchValues:
            return initialState;
    
        default:
            return state;
    }

};