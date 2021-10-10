import { Dictionary, Item } from '../../pages/Match';

export const change = '[match] change';

export type MatchState = {
    match: Dictionary<Item[] | []>;
};

type ChangeAction = {
    type: typeof change;
    payload: Dictionary<Item[] | []>;
};

export type MatchActionTypes = ChangeAction;