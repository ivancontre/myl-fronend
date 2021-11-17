import { User } from "../auth/types";

export const setActiveUsers = '[play] set active users';

export type PlayState = {
    activeUsers: User[];
};

type PlaySetActiveUsers = {
    type: typeof setActiveUsers;
    payload: User[]
};

export type PlayActionTypes = PlaySetActiveUsers;