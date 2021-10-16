import { Dictionary, ICard } from '../../pages/MatchPage';

export const change = '[match] change';

export type MatchState = {
    match: Dictionary<ICard[] | []>;
};

type ChangeAction = {
    type: typeof change;
    payload: Dictionary<ICard[] | []>;
};

export type MatchActionTypes = ChangeAction;