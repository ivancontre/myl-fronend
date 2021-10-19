import { Dispatch } from "react";
import { runFetch } from "../../helpers/fetch";
import { showSpin } from "../spinUI/action";
import { SpinActionTypes } from "../spinUI/types";
import { Card, CardActionTypes, cardAddNew, cardLoad, cardLoadUpdating, cardResetUpdating } from "./types";

export const startAddNewCard = (card: any) => {
    return async (dispatch: Dispatch<CardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/card', card, 'POST', token);
            let respJson = await resp.json();

            if (resp.status === 201) {
                dispatch(addNewCard(respJson));
            } else {
                console.log(resp)
            }

        } catch (error) {
            console.log(error);
        }
    }
};

export const startLoadCard = () => {
    return async (dispatch: Dispatch<CardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/card', {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(loadCards(respJson));
            } else {
                console.log(resp)
            }

        } catch (error) {
            console.log(error);
        }
    }
};

export const startLoadCardUpdating = (id: string) => {
    return async (dispatch: Dispatch<CardActionTypes | SpinActionTypes>) => {

        try {
            //dispatch(showSpin('Guadando carta...'));
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/card/' + id, {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(loadCardUpdating(respJson));
            } else {
                console.log(resp)
            }

        } catch (error) {
            console.log(error);
        }
    }
};

export const resetCardUpdating = () => {
    return {
        type: cardResetUpdating
    }
}


const loadCardUpdating = (card: Card): CardActionTypes => {
    return {
        type: cardLoadUpdating,
        payload: card
    }
}

const loadCards = (cards: Card[]): CardActionTypes => {
    return {
        type: cardLoad,
        payload: cards
    }
};

const addNewCard = (card: Card): CardActionTypes => {
    return {
        type: cardAddNew,
        payload: card
    }
};