import moment from "moment";
import { Deck } from "../deck/types";

export const authLogin = '[auth] Login';
export const authStartRegister = '[auth] Start Register';
export const authChecking = '[auth] Cheking login state';
export const authCheckingFinish = '[auth] Finish checking login state';
export const authLogout = '[auth] Logout';
export const authStartRenewToken = '[auth] Start renew token';
export const authStartSetDetail = '[auth] Start get detail'; // playing, defeats, victories
export const authStartUpdateData = '[auth] Start Update data';
export const authStartVerifyToken = '[auth] Start Verify token';

export type User = {
    id: string;
    name: string;
    lastname: string;
    email: string;
    username: string;
    google: boolean;
    role: string;
    status: boolean;
    online?: boolean;
    lastTimeOnline?: moment.Moment;
    verify?: boolean;
    playing?: boolean;
    lastTimePlaying?: moment.Moment;
    victories?: number;
    defeats?: number;
    decks?: Deck[];
    era?: string;
};

export type AuthState = Partial<User> & {
    checking: boolean;
    logged: boolean;
};

type AuthLogin = {    
    type: typeof authLogin,
    payload: User
};

type AuthCheckingFinish = {    
    type: typeof authCheckingFinish
};

type AuthLogout = {    
    type: typeof authLogout
};

type AuthStartSetDetail = {
    type: typeof authStartSetDetail,
    payload: any
};

type AuthStartUpdateData = {
    type: typeof authStartUpdateData,
    payload: any
};

type AuthStartVerifyToken = {
    type: typeof authStartVerifyToken,
    payload: string
};

export type AuthActionTypes = AuthLogin | AuthCheckingFinish | AuthLogout | AuthStartSetDetail | AuthStartUpdateData | AuthStartVerifyToken;