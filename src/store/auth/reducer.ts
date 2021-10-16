
  
import { AuthActionTypes, authCheckingFinish, authLogin, authLogout, AuthState } from "./types";

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
    
        default:
            return state;
    }
};