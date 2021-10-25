import { Dictionary, ICard } from "../../pages/MatchPage";
import { User } from "../auth/types";
import { Deck } from "../deck/types";
import { change, MatchActionTypes, setActiveUsers, setDeck, setMatchId, resetMatchValues } from "./types";

export const changeMatch = (match: Dictionary<ICard[] | []>): MatchActionTypes => {
    return {
        type: change,
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

export const matchSetDeck = (deck: Deck) => {
    return {
        type: setDeck,
        payload: deck
    }
};

export const resetMatch = () => {
    return {
        type: resetMatchValues
    }
}