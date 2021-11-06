import { MatchState, MatchActionTypes, change, setActiveUsers, setMatchId, resetMatchValues, setOpponentId, changeOpponent, setCardsOrigin, setCardsDestiny, setAmountCardsView, setTakeControlOpponentCard } from "./types";

const initialState: MatchState = {
    matchId: null,
    match: {},
    opponentMatch: {},
    opponentId: null,
    activeUsers: [],
    viewCardsOrigin: [],
    viewCardsDestiny: [],
    amountCardsView: 1,
    takeControlOpponentCardIndex: -1,
    takeControlOpponentCardZone: ''
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
            };

        case setOpponentId:
            return {
                ...state,
                opponentId: action.payload
            };

        case setCardsOrigin:
            return {
                ...state,
                viewCardsOrigin: [...action.payload]
            };

        case setCardsDestiny:
            return {
                ...state,
                viewCardsDestiny: [...action.payload]
            };

        case setAmountCardsView:
            return {
                ...state,
                amountCardsView: action.payload
            };

        case setTakeControlOpponentCard:
            return {
                ...state,
                takeControlOpponentCardIndex: action.payload.index,
                takeControlOpponentCardZone: action.payload.zone
            };

        case resetMatchValues:
            return initialState;
    
        default:
            return state;
    }

};