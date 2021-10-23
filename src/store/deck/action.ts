import { message } from "antd";
import { Dispatch } from "react";
import { runFetch } from "../../helpers/fetch";
import { Deck, DeckActionTypes, deckAddNew, deckLoad, deckLoadUpdating, deckResetUpdating } from "./types";

export const startAddNewDeck = (deck: any) => {
    return async (dispatch: Dispatch<DeckActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/deck', deck, 'POST', token);
            let respJson = await resp.json();

            if (resp.status === 201) {
                dispatch(addNewDeck(respJson));                
                message.success(`Mazo "${respJson.name}" creado correctamente`);
            } else {
                console.log(resp);
                message.error('Error al crear mazo');
            }

        } catch (error) {
            console.log(error);
            message.error('Error al crear mazo!');
        }
    }
};

export const startLoadDeck = () => {
    return async (dispatch: Dispatch<DeckActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/deck', {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(loadDecks(respJson));
            } else {
                message.error('Error al obtener mazos');
            }

        } catch (error) {
            console.log(error);
            message.error('Error al obtener mazos!');
        }
    }
};

export const loadDeckUpdating = (id: string): DeckActionTypes => {
    return {
        type: deckLoadUpdating,
        payload: id
    }
};

export const resetDeckUpdating = () => {
    return {
        type: deckResetUpdating
    }
};

const loadDecks = (deck: Deck[]): DeckActionTypes => {
    return {
        type: deckLoad,
        payload: deck
    }
};


const addNewDeck = (deck: Deck): DeckActionTypes => {
    return {
        type: deckAddNew,
        payload: deck
    }
};