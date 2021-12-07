import { Card } from "../card/types";
import { change, MatchActionTypes, setMatchId, resetMatchValues, Dictionary, setOpponentId, changeOpponent, setCardsOrigin, setCardsDestiny, setAmountCardsView, setTakeControlOpponentCard, setWeapon, setOpponentUsername } from "./types";

export const changeMatch = (match: Dictionary<Card[] | []>, emmitChange: boolean = true): MatchActionTypes => {
    return {
        type: change,
        payload: {
            match,
            emmitChange
        }
    }
};

export const changOpponenteMatch = (match: Dictionary<Card[] | []>): MatchActionTypes => {
    return {
        type: changeOpponent,
        payload: match
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

export const matchSetOpponentUsername = (username: string) => {
    return {
        type: setOpponentUsername,
        payload: username
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

export const setTakeControlOpponentCardAction = (index: number, zone: string, controlType: string) => {
    return {
        type: setTakeControlOpponentCard,
        payload: {
            index,
            zone,
            controlType
        }
    }
};

export const setWeaponAction = (data: any) => {
    return {
        type: setWeapon,
        payload: data
    }
};