import { Dispatch } from "react";
import { runFetch } from "../../helpers/fetch";
import { DescriptionCardActionTypes, RaceCard, TypeCard, typesCardLoad, racesCardLoad, FrecuencyCard, frecuenciesCardLoad, EditionCard, editionsCardLoad, resetDescription } from "./types";

export const startLoadTypeCard = () => {
    return async (dispatch: Dispatch<DescriptionCardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/type', {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(loadTypeCard(respJson));
            } else {
                console.log(resp)
            }

        } catch (error) {
            console.log(error);
        }
    }
};

export const startLoadFrecuencyCard = () => {
    return async (dispatch: Dispatch<DescriptionCardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/frecuency', {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(loadFrecuencyCard(respJson));
            } else {
                console.log(resp)
            }

        } catch (error) {
            console.log(error);
        }
    }
};

export const startLoadRaceCard = () => {
    return async (dispatch: Dispatch<DescriptionCardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/race', {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(loadRaceCard(respJson));
            } else {
                console.log(resp)
            }

        } catch (error) {
            console.log(error);
        }
    }
};

export const startLoadEditionCard = () => {
    return async (dispatch: Dispatch<DescriptionCardActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/edition', {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                dispatch(loadEditionCard(respJson));
            } else {
                console.log(resp)
            }

        } catch (error) {
            console.log(error);
        }
    }
};

export const resetAllDescription = () => {
    return {
        type: resetDescription
    }
}

const loadTypeCard = (typesCard: TypeCard[]): DescriptionCardActionTypes => {
    return {
        type: typesCardLoad,
        payload: typesCard
    }
};

const loadFrecuencyCard = (frecuenciesCard: FrecuencyCard[]): DescriptionCardActionTypes => {
    return {
        type: frecuenciesCardLoad,
        payload: frecuenciesCard
    }
};

const loadRaceCard = (racesCard: RaceCard[]): DescriptionCardActionTypes => {
    return {
        type: racesCardLoad,
        payload: racesCard
    }
};

const loadEditionCard = (editionsCard: EditionCard[]): DescriptionCardActionTypes => {
    return {
        type: editionsCardLoad,
        payload: editionsCard
    }
};

