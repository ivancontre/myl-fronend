import { User } from "../auth/types";
import { Card } from "../card/types";
import { change, MatchActionTypes, setActiveUsers, setMatchId, resetMatchValues, Dictionary, setOpponentId, changeOpponent } from "./types";

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
}