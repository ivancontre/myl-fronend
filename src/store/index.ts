import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import thunk from 'redux-thunk';

import { authReducer } from './auth/reducer';
import { matchReducer } from './match/reducer';
//import { socketReducer } from './socket/reducer';

import { MatchState } from './match/types';
//import { SocketState } from './socket/types';
import { AuthState } from './auth/types';

declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
};

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export interface RootState {
    match: MatchState;
    //socket: SocketState;
    auth: AuthState;
}

export const rootReducer = combineReducers({
    match: matchReducer,
    //socket: socketReducer,
    auth: authReducer
});

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);