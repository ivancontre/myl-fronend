import { User } from "../auth/types";
import { Card } from "../card/types";
import { change, MatchActionTypes, setActiveUsers, setMatchId, resetMatchValues, Dictionary, setOpponentId, changeOpponent, setCardsOrigin, setCardsDestiny, setAmountCardsView, setTakeControlOpponentCard, setWeapon } from "./types";

export const changeMatch = (match: Dictionary<Card[] | []>): MatchActionTypes => {
    return {
        type: change,
        payload: match
    }
};

export const changOpponenteMatch = (match: Dictionary<Card[] | []>): MatchActionTypes => {
    return {
        type: changeOpponent,
        payload: match
    }
};

export const matchSetActiveUsers = (users: User[]) => {
    return {
        type: setActiveUsers,
        payload: users
    }
};

export const matchSetMatchId = (id: string) => {
    return {
        type: setMatchId,
        payload: id
    }
};

export const matchSetOpponentId = (id: string) => {
    return {
        type: setOpponentId,
        payload: id
    }
};

export const resetMatch = () => {
    return {
        type: resetMatchValues
    }
};

export const setViewCardsOrigin = (cards: Card[]) => {
    return {
        type: setCardsOrigin,
        payload: cards
    }
};

export const setViewCardsDestiny = (cards: Card[]) => {
    return {
        type: setCardsDestiny,
        payload: cards
    }
};

export const setAmountCardsViewAction = (amount: number) => {
    return {
        type: setAmountCardsView,
        payload: amount
    }
};

export const setTakeControlOpponentCardAction = (index: number, zone: string) => {
    return {
        type: setTakeControlOpponentCard,
        payload: {
            index,
            zone
        }
    }
};

export const setWeaponAction = (data: any) => {
    return {
        type: setWeapon,
        payload: data
    }
};