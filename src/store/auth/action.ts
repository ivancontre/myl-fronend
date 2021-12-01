import { message } from "antd";
import { Dispatch } from "react";
import { runFetch } from "../../helpers/fetch";
import { AuthActionTypes,
        authLogin, 
        authLogout, 
        User 
} from "./types";

export const startLogin = (username: string, password: string) => {
    return async (dispatch: Dispatch<AuthActionTypes>) => {

        try {
            const resp = await runFetch('api/auth/login', { username, password }, 'POST');
            const respJson = await resp.json();

            if (resp.status === 200) {
                localStorage.setItem('token', respJson.token);
                localStorage.setItem('token-init-date', new Date().getTime().toString());

                dispatch(login({
                    id: respJson.user.id,
                    name: respJson.user.name,
                    lastname: respJson.user.lastname,
                    email: respJson.user.email,
                    username: respJson.user.username,
                    role: respJson.user.role,
                    status: respJson.user.status,
                    online: respJson.user.online,
                    playing: respJson.user.playing,
                    defeats: respJson.user.defeats
                }));

            } else {
                message.warn(respJson.msg);
                console.log(respJson.msg);
            }
            
        } catch (error) {
            message.error('Error interno, consulte con el administrador')
            console.log(error);
        }
        
    }
};

export const startRegister = (name: string, lastname: string, email: string, username: string, password: string) => {
    return async (dispatch: Dispatch<AuthActionTypes>) => {

        try {
            const resp = await runFetch('api/auth/register', { name, lastname, email, username, password }, 'POST');
            const respJson = await resp.json();

            if (resp.status === 201) {
                localStorage.setItem('token', respJson.token);
                localStorage.setItem('token-init-date', new Date().getTime().toString());

                dispatch(login({
                    id: respJson.user.id,
                    name: respJson.user.name,
                    lastname: respJson.user.lastname,
                    email: respJson.user.email,
                    username: respJson.user.username,
                    role: respJson.user.role,
                    status: respJson.user.status,
                    online: respJson.user.online,
                    playing: respJson.user.playing,
                    defeats: respJson.user.defeats
                }));

            } else {
                if (respJson.errors) {

                    for (let [, value] of Object.entries(respJson.errors)) {
                        message.warn((value as any).msg);
                        console.log((value as any).msg);
                    }

                } else {
                    message.warn(respJson.msg);
                    console.log(respJson.msg);
                }
                
            }
        } catch (error) {
            message.error('Error interno, consulte con el administrador')
            console.log(error);
        }
        
    }
};

export const startChecking = () => {
    return async (dispatch: Dispatch<AuthActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;

            if (!token) {
                dispatch(logout());
            }

            const resp = await runFetch('api/auth/renew-token',  {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                localStorage.setItem('token', respJson.token);

                dispatch(login({
                    id: respJson.user.id,
                    name: respJson.user.name,
                    lastname: respJson.user.lastname,
                    email: respJson.user.email,
                    username: respJson.user.username,
                    role: respJson.user.role,
                    status: respJson.user.status,
                    online: respJson.user.online,
                    playing: respJson.user.playing,
                    defeats: respJson.user.defeats
                }));

            } else {
                dispatch(logout());
            }
        } catch (error) {
            console.log(error);
        }        

    }   
};

export const startLogout = () => {
    return (dispatch: Dispatch<AuthActionTypes>) => {
        localStorage.removeItem('token');
        dispatch(logout());
    }
};

const login = (user: User): AuthActionTypes => {
    return {
        type: authLogin,
        payload: user
    }
};

const logout = (): AuthActionTypes => {
    return {
        type: authLogout
    }
};