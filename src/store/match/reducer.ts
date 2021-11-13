import { MatchState, MatchActionTypes, change, setActiveUsers, setMatchId, resetMatchValues, setOpponentId, changeOpponent, setCardsOrigin, setCardsDestiny, setAmountCardsView, setTakeControlOpponentCard, setWeapon } from "./types";

const initialState: MatchState = {
    matchId: null,
    match: {},
    emmitChange: true,
    opponentMatch: {},
    opponentId: null,
    activeUsers: [],
    viewCardsOrigin: [],
    viewCardsDestiny: [],
    amountCardsView: 1,
    takeControlOpponentCardIndex: -1,
    takeControlOpponentCardZone: '',
    selectedWeapon: null
};

export const matchReducer = (state: typeof initialState = initialState, action: MatchActionTypes): MatchState => {

    switch (action.type) {

        case change:
            return {
                ...state,
                match: action.payload.match,
                emmitChange: action.payload.emmitChange

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

        case setWeapon:
            return {
                ...state,
                selectedWeapon: action.payload
            }

        case resetMatchValues:
            return initialState;
    
        default:
            return state;
    }

};