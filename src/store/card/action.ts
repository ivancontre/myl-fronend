import { message } from "antd";
import { Dispatch } from "react";
import { runFetch } from "../../helpers/fetch";
import { SpinActionTypes } from "../spinUI/types";
import { Card, CardActionTypes, cardAddNew, cardByEdition, cardLoad, cardLoadUpdating, cardResetUpdating, cardsResetMySelection, cardUpdate, selectMyCards } from "./types";

export const startAddNewCard = (card: any) => {
    return async (dispatch: Dispatch<CardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/card', card, 'POST', token);
            let respJson = await resp.json();

            if (resp.status === 201) {
                dispatch(addNewCard(respJson));                
                message.success(`Carta "${respJson.name}" creada correctamente`);
            } else {
                console.log(resp);
                message.error('Error al crear carta');
            }

        } catch (error) {
            console.log(error);
            message.error('Error al crear carta!');
        }
    }
};

export const startUpdateCard = (id: string, card: any) => {

    return async (dispatch: Dispatch<CardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/card/' + id, card, 'PUT', token);
            let respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(updateCard(respJson));
                message.success(`Carta "${respJson.name}" actualizada correctamente`);
            } else {
                console.log(resp);
                message.error('Error al actualizar carta');
            }

        } catch (error) {
            console.log(error);
            message.error('Error al actualizar carta!');

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
                message.error('Error al obtener cartas');
            }

        } catch (error) {
            console.log(error);
            message.error('Error al obtener cartas!');
        }
    }
};

export const startLoadCardUpdating = (id: string) => {
    return async (dispatch: Dispatch<CardActionTypes | SpinActionTypes>) => {

        try {
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

export const startLoadCardByEdition = (editionId: string) => {
    return async (dispatch: Dispatch<CardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/card/' + editionId + '/edition', {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(loadCardsByEdition(respJson));
            } else {
                message.error('Error al obtener cartas');
            }

        } catch (error) {
            console.log(error);
            message.error('Error al obtener cartas!');
        }
    }
};

export const resetCardUpdating = () => {
    return {
        type: cardResetUpdating
    }
}


export const loadCardUpdating = (id: string): CardActionTypes => {
    return {
        type: cardLoadUpdating,
        payload: id
    }
};

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

const updateCard = (card: Card): CardActionTypes => {
    return {
        type: cardUpdate,
        payload: card
    }
};

export const loadCardsByEdition = (cards: Card[]): CardActionTypes => {
    return {
        type: cardByEdition,
        payload: cards
    }
};

export const loadCardsMySelection = (cards: Card[]): CardActionTypes => {
    return {
        type: selectMyCards,
        payload: cards
    }
};

export const resetMySelection = () => {
    return {
        type: cardsResetMySelection
    }
};