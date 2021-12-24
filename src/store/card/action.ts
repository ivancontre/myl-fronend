import { message } from "antd";
import { Dispatch } from "react";
import { runFetch } from "../../helpers/fetch";
import { Card, CardActionTypes, cardAddNew, cardByEdition, cardDelete, cardLoad, cardLoadUpdating, cardResetUpdating, cardsResetMySelection, cardUpdate, selectMyCards } from "./types";

export const startAddNewCard = (card: any) => {
    return async (dispatch: Dispatch<CardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/card', card, 'POST', token);
            let respJson = await resp.json();

            if (resp.status === 201) {

                dispatch(addNewCard(respJson));                
                message.success(`Carta "${respJson.name}" creada correctamente`);

            } else if (respJson.errors) {

                for (let [, value] of Object.entries(respJson.errors)) {
                    message.warn((value as any).msg);
                    console.log((value as any).msg);
                }

            } else {
                message.warn(respJson.msg, 5);
                console.log(respJson.msg);
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

            } else if (respJson.errors) {

                for (let [, value] of Object.entries(respJson.errors)) {
                    message.warn((value as any).msg);
                    console.log((value as any).msg);
                }

            } else {
                message.warn(respJson.msg, 5);
                console.log(respJson.msg);
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

export const startDeleteCard = (id: string) => {
    return async (dispatch: Dispatch<CardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/card/'+id, {}, 'DELETE', token);
            //const respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(deleteCard(id));
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
    return async (dispatch: Dispatch<CardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/card/' + id, {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {

                dispatch(loadCardUpdating(respJson));

            } else if (respJson.errors) {

                for (let [, value] of Object.entries(respJson.errors)) {
                    message.warn((value as any).msg);
                    console.log((value as any).msg);
                }

            } else {
                message.warn(respJson.msg, 5);
                console.log(respJson.msg);
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
                
            } else if (respJson.errors) {

                for (let [, value] of Object.entries(respJson.errors)) {
                    message.warn((value as any).msg);
                    console.log((value as any).msg);
                }

            } else {
                message.warn(respJson.msg, 5);
                console.log(respJson.msg);
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

const deleteCard = (id: string): CardActionTypes => {
    return {
        type: cardDelete,
        payload: id
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

export const resetMySelection = (): CardActionTypes => {
    return {
        type: cardsResetMySelection
    }
};