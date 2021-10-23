import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import thunk from 'redux-thunk';

import { authReducer } from './auth/reducer';
import { matchReducer } from './match/reducer';
//import { socketReducer } from './socket/reducer';
import { descriptionReducer } from './description/reducer';

import { MatchState } from './match/types';
//import { SocketState } from './socket/types';
import { AuthState } from './auth/types';
import { DescriptionState } from './description/types';
import { cardReducer } from './card/reducer';
import { CardState } from './card/types';
import { SpinState } from './spinUI/types';
import { spinReducer } from './spinUI/reducer';
import { DeckState } from './deck/types';
import { deckReducer } from './deck/reducer';

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
    description: DescriptionState,
    cards: CardState,
    spin: SpinState,
    decks: DeckState
}

export const rootReducer = combineReducers({
    match: matchReducer,
    //socket: socketReducer,
    auth: authReducer,
    description: descriptionReducer,
    cards: cardReducer,
    spin: spinReducer,
    decks: deckReducer
});

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);