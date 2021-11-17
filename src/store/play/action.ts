import { User } from "../auth/types";
import { setActiveUsers } from "./types";

export const playSetActiveUsers = (users: User[]) => {
    return {
        type: setActiveUsers,
        payload: users
    }
};