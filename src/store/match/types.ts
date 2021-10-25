import { Dictionary, ICard } from '../../pages/MatchPage';
import { User } from '../auth/types';
import { Deck } from '../deck/types';

export const change = '[match] change';
export const setActiveUsers = '[match] set active users';
export const setMatchId = '[match] set matchId';
export const setDeck = '[match] set deck';
export const resetMatchValues = '[match] reset match';

export type MatchState = {
    matchId: string | null;
    match: Dictionary<ICard[] | []>;
    activeUsers: User[];
    deckByPlay: Deck | null;
};

type ChangeAction = {
    type: typeof change;
    payload: Dictionary<ICard[] | []>;
};

type MatchSetActiveUsers = {
    type: typeof setActiveUsers;
    payload: User[]
};

type MatchSetId = {
    type: typeof setMatchId,
    payload: string
};

type MatchSetDeck = {
    type: typeof setDeck,
    payload: Deck
};

type MatchReset = {
    type: typeof resetMatchValues
}

export type MatchActionTypes = ChangeAction | MatchSetActiveUsers | MatchSetId | MatchSetDeck | MatchReset;