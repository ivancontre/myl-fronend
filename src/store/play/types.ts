import { User } from "../auth/types";

export const setActiveUsers = '[play] Set active users for play';
export const setUsers = '[play] Set users';
export const resetPlay = '[play] Reset';

export type PlayState = {
    activeUsersForPlay: User[] | null;
    users: User[] | null;
};

type PlaySetActiveUsers = {
    type: typeof setActiveUsers;
    payload: User[]
};

type PlaySetUsers = {
    type: typeof setUsers;
    payload: User[]
};

type PlayReset = {
    type: typeof resetPlay;
};

export type PlayActionTypes = PlaySetActiveUsers | PlaySetUsers | PlayReset;