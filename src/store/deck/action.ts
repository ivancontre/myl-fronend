import { message } from "antd";
import { Dispatch } from "react";
import { runFetch } from "../../helpers/fetch";
import { resetMySelection } from "../card/action";
import { CardActionTypes } from "../card/types";
import { Deck, DeckActionTypes, deckAddNew, deckDelete, deckLoad, deckLoadUpdating, deckResetUpdating, deckUpdate, deckSetDefault, deckReset } from "./types";

export const startAddNewDeck = (deck: any, history: any, showLoading: Function, hideLoading: Function) => {
    return async (dispatch: Dispatch<DeckActionTypes | CardActionTypes>) => {

        showLoading();

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/deck', deck, 'POST', token);
            let respJson = await resp.json();

            if (resp.status === 201) {
                hideLoading();
                dispatch(addNewDeck(respJson));
                dispatch(resetMySelection());
                message.success(`Mazo "${respJson.name}" creado correctamente`);
                history.push('/decks');

            } else if (respJson.errors) {

                for (let [, value] of Object.entries(respJson.errors)) {
                    message.warn((value as any).msg);
                    console.log((value as any).msg);
                }

                hideLoading();

            } else {
                message.warn(respJson.msg, 5);
                console.log(respJson.msg);
                hideLoading();
            }
            

        } catch (error) {
            console.log(error);
            message.error('Error al crear mazo!');
            hideLoading();
        }
    }
};

export const startUpdateDeck = (id: string, deck: any, isDefault: boolean, lengthSelectMyCards: number, showLoading: Function, hideLoading: Function) => {

    return async (dispatch: Dispatch<DeckActionTypes | Function>) => {

        showLoading();

        try {

            const token = localStorage.getItem('token') as string;            
            const resp = await runFetch('api/deck/' + id, deck, 'PUT', token);
            let respJson = await resp.json();

            if (resp.status === 200) {

                dispatch(updateDeck(respJson));

                if (isDefault) {

                    if (lengthSelectMyCards < 50) {
                    
                        // tengo que setear el deafault en null y en bd quitarle la marca como defecto
                        dispatch(startSetDefaultDeck(id as string, false));
                    } else {
    
                        dispatch(startSetDefaultDeck(id as string, true));
    
                    }
    
                }

                hideLoading();
                message.success(`Mazo "${respJson.name}" actualizado correctamente`);

            } else if (respJson.errors) {

                for (let [, value] of Object.entries(respJson.errors)) {
                    message.warn((value as any).msg);
                    console.log((value as any).msg);
                }

                hideLoading();

            } else {
                message.warn(respJson.msg, 5);
                console.log(respJson.msg);
                hideLoading();
            }
            

        } catch (error) {
            console.log(error);
            message.error('Error al actualizar mazo!');
            hideLoading();
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
                message.warn(respJson.msg, 7);
                console.log(respJson.msg);  
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
            let respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(deleteDeck(id));
            } else {
                message.warn(respJson.msg, 7);
                console.log(respJson.msg);  
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