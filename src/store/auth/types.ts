export const authLogin = '[auth] Login';
export const authStartRegister = '[auth] Start Register';
export const authChecking = '[auth] Cheking login state';
export const authCheckingFinish = '[auth] Finish checking login state';
export const authLogout = '[auth] Logout';
export const authStartRenewToken = '[auth] Start renew token';

export type User = {
    id: string;
    name: string;
    lastname: string;
    email: string;
    username: string;
    role: string;
    status: boolean;
    online?: boolean;
    playing?: boolean;
    victories?: number;
    defeats?: number;
};

export type AuthState = Partial<User> & {
    checking: boolean;
    logged: boolean;
}


/*(User & {
    checking: boolean;
    logged: boolean;
}) | {
    checking: boolean;
    logged: boolean;
};*/

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

export type AuthActionTypes = AuthLogin | AuthCheckingFinish | AuthLogout;