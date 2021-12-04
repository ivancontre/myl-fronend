import { User } from "../auth/types";

export const setActiveUsers = '[play] Set active users';
export const resetPlay = '[play] Reset';

export type PlayState = {
    activeUsers: User[];
};

type PlaySetActiveUsers = {
    type: typeof setActiveUsers;
    payload: User[]
};

type PlayReset = {
    type: typeof resetPlay;
};

export type PlayActionTypes = PlaySetActiveUsers | PlayReset;