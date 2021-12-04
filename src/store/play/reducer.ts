import { PlayActionTypes, PlayState, resetPlay, setActiveUsers } from "./types";

const initialState: PlayState = {
    activeUsers: []
};

export const playReducer = (state: typeof initialState = initialState, action: PlayActionTypes): PlayState => {

    switch (action.type) {
        case setActiveUsers:
            return {
                ...state,
                activeUsers: [...action.payload]
            };

        case resetPlay:
            return initialState;

        default:
            return state;
    }
    
};