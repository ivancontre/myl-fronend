
  
import { AuthActionTypes, authCheckingFinish, authLogin, authLogout, authStartSetDetail, authStartUpdateData, AuthState } from "./types";

const initialState: AuthState = {
    checking: true,
    logged: false
};

export const authReducer = (state: typeof initialState = initialState, action: AuthActionTypes): AuthState => {

    switch (action.type) {
        case authLogin:
            return {
                ...state,
                ...action.payload,
                checking: false,
                logged: true           
            };

        case authCheckingFinish:
            return {
                ...state,
                checking: false
            };
        
        case authLogout:
            return {
                checking: false,
                logged: false
            };

        case authStartSetDetail:
            return {
                ...state,
                playing: action.payload.playing,
                victories: action.payload.victories,
                defeats: action.payload.defeats
            };

        case authStartUpdateData:
            return {
                ...state,
                name: action.payload.name,
                lastname: action.payload.lastname,
                username: action.payload.username
            };
    
        default:
            return state;
    }
};