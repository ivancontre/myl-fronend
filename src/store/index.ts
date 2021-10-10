import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import thunk from 'redux-thunk';

import { matchReducer } from './match/reducer';
import { MatchState } from './match/types';
import { socketReducer } from './socket/reducer';
import { SocketState } from './socket/types';

declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
};

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export interface RootState {
    match: MatchState;
    socket: SocketState;
};

export const rootReducer = combineReducers({
    match: matchReducer,
    socket: socketReducer
});

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);