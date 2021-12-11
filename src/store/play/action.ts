import { User } from "../auth/types";
import { PlayActionTypes, resetPlay, setActiveUsers, setUsers } from "./types";

export const playSetActiveUsersForPlay = (users: User[]): PlayActionTypes => {
    return {
        type: setActiveUsers,
        payload: users
    }
};

export const playSetUsers = (users: User[]): PlayActionTypes => {
    return {
        type: setUsers,
        payload: users
    }
};

export const playReset = (): PlayActionTypes => {
    return {
        type: resetPlay
    }
};