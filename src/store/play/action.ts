import { User } from "../auth/types";
import { resetPlay, setActiveUsers } from "./types";

export const playSetActiveUsers = (users: User[]) => {
    return {
        type: setActiveUsers,
        payload: users
    }
};

export const playReset = () => {
    return {
        type: resetPlay
    }
};