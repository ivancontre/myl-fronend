import { message } from "antd";
import { Dispatch } from "react";
import { runFetch } from "../../helpers/fetch";
import { Deck, DeckActionTypes, deckAddNew, deckDelete, deckLoad, deckLoadUpdating, deckResetUpdating, deckUpdate, deckSetDefault, deckReset } from "./types";

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

export const startUpdateDeck = (id: string, deck: any) => {

    return async (dispatch: Dispatch<DeckActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/deck/' + id, deck, 'PUT', token);
            let respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(updateDeck(respJson));
                message.success(`Mazo "${respJson.name}" actualizado correctamente`);
            } else {
                console.log(resp);
                message.error('Error al actualizar mazo');
            }

        } catch (error) {
            console.log(error);
            message.error('Error al actualizar mazo!');

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

export const startDeleteDeck = (id: string) => {
    return async (dispatch: Dispatch<DeckActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/deck/'+ id, {}, 'DELETE', token);

            if (resp.status === 200) {
                dispatch(deleteDeck(id));
            } else {
                message.error('Error al eliminar mazos');
            }

        } catch (error) {
            console.log(error);
            message.error('Error al eliminar mazos!');
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

export const startSetDefaultDeck = (id: string, isDefault: boolean) => {
    
    return async (dispatch: Dispatch<DeckActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/deck/'+ id, { isDefault }, 'PATCH', token);

            if (resp.status === 200) {
                dispatch(setDefaultDeck(id, isDefault));
            } else {
                message.error('Error al actualizar mazo por defecto');
            }

        } catch (error) {
            console.log(error);
            message.error('Error al actualizar mazo por defecto!');
        }
    }
};

const setDefaultDeck = (id: string, isDefault: boolean): DeckActionTypes => {
    return {
        type: deckSetDefault,
        payload: {
            id,
            isDefault
        }
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

const updateDeck = (deck: Deck): DeckActionTypes => {
    return {
        type: deckUpdate,
        payload: deck
    }
}

export const deleteDeck = (id: string): DeckActionTypes => {
    return {
        type: deckDelete,
        payload: id
    }
};

export const resetDeck = (): DeckActionTypes => {
    return {
        type: deckReset
    }
};