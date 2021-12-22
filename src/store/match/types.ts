import { Card } from '../card/types';

export const change = '[match] change';
export const changeOpponent = '[match] change opponent';
export const setMatchId = '[match] set matchId';
export const setOpponentId = '[match] set opponentId';
export const setOpponentUsername = '[match] set opponentUsername';
export const resetMatchValues = '[match] reset match';
export const setCardsOrigin = '[match] set view cards origin';
export const setCardsDestiny = '[match] set view cards destiny';
export const setAmountCardsView = '[match] set x cards view';

export const setTakeControlOpponentCard = '[match] set control opponent card';

export const setWeapon = '[match] set weapon';

export const setPlayOpenHand = '[match] set play open hand';

export type MatchState = {
    matchId: string | null;
    match: Dictionary<Card[] | []>;
    emmitChange: boolean;
    opponentMatch: Dictionary<Card[] | []>;
    opponentId: string | null;
    opponentUsername: string | null;
    viewCardsOrigin: Card[];
    viewCardsDestiny: Card[];
    amountCardsView: number;
    takeControlOpponentCardIndex: number;
    takeControlOpponentCardZone: string;
    takeControlOpponentCardControlType: string;
    selectedWeapon: any;
    playOpenHand: boolean;
};

export type Dictionary<TValue> = {
    [id: string]: TValue;
};

export type DragCard = Partial<Card> & {
    index: number;
    zone: string;
};

type ChangeAction = {
    type: typeof change;
    payload: any;
};

type MatchChangeOpponentAction = {
    type: typeof changeOpponent;
    payload: Dictionary<Card[] | []>;
};

type MatchSetId = {
    type: typeof setMatchId,
    payload: string
};

type MatchSetOpponentId = {
    type: typeof setOpponentId,
    payload: string
};

type MatchSetOpponentUsername = {
    type: typeof setOpponentUsername,
    payload: string
};

type MatchReset = {
    type: typeof resetMatchValues
};

type MatchViewCardsOrigin = {    
    type: typeof setCardsOrigin,
    payload: Card[]
};

type MatchViewCardsDestiny = {    
    type: typeof setCardsDestiny,
    payload: Card[]
};

type MatchAmountCardsView = {
    type: typeof setAmountCardsView,
    payload: number
};

type MatchControlOpponentCard = {
    type: typeof setTakeControlOpponentCard,
    payload: any
};

type MatchSetWeapon = {
    type: typeof setWeapon,
    payload: any
};

type MatchSetPlayOpenHand = {
    type: typeof setPlayOpenHand,
    payload: boolean
};

export type MatchActionTypes = 
ChangeAction | 
MatchSetId | 
MatchReset | 
MatchSetOpponentId |
MatchSetOpponentUsername |
MatchChangeOpponentAction | 
MatchViewCardsOrigin | 
MatchViewCardsDestiny | 
MatchAmountCardsView |
MatchControlOpponentCard |
MatchSetWeapon |
MatchSetPlayOpenHand;