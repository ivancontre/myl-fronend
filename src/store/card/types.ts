export const cardStartAddNew = '[card] Start add new';
export const cardAddNew = '[card] Add new';

export type Card = {
    id?: string;
    name: string;
    ability: Date;
    legend: string;
    type: string;
    frecuency: string;
    race: string;
    cost: number;
    strength: number;
    isMachinery: boolean;
    img: string;
};

type CardAddNewAction = {    
    type: typeof cardAddNew,
    payload: Card
};

export type CardActionTypes = CardAddNewAction;