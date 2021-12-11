import { PlayActionTypes, PlayState, resetPlay, setActiveUsers, setUsers } from "./types";

const initialState: PlayState = {
    activeUsersForPlay: null,
    users: null
};

export const playReducer = (state: typeof initialState = initialState, action: PlayActionTypes): PlayState => {

    switch (action.type) {
        case setActiveUsers:
            return {
                ...state,
                activeUsersForPlay: [...action.payload]
            };
        
        case setUsers:
            return {
                ...state,
                users: [...action.payload]
            };

        case resetPlay:
            return initialState;

        default:
            return state;
    }
    
};