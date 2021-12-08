import { message } from "antd";
import { Dispatch } from "react";
import { runFetch } from "../../helpers/fetch";
import { resetCardUpdating } from "../card/action";
import { resetChatAction } from "../chat/action";
import { resetDeck, resetDeckUpdating } from "../deck/action";
import { resetAllDescription } from "../description/action";
import { resetMatch } from "../match/action";
import { playReset } from "../play/action";
import { resetModal } from "../ui-modal/action";
import { AuthActionTypes,
        authLogin, 
        authLogout, 
        authStartSetDetail, 
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
                    defeats: respJson.user.defeats,
                    victories: respJson.user.victories
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
                    defeats: respJson.user.defeats,
                    victories: respJson.user.victories
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
    return async (dispatch: Dispatch<any>) => {

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
                    defeats: respJson.user.defeats,
                    victories: respJson.user.victories
                }));

            } else {
                dispatch(logout());
                dispatch(resetDeckUpdating());
                dispatch(resetCardUpdating());
                dispatch(resetMatch());
                dispatch(resetAllDescription());
                dispatch(resetChatAction());
                dispatch(resetDeck());
                dispatch(resetModal());
                dispatch(playReset());
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

export const startSetDetailAction = () => {
    return async (dispatch: Dispatch<AuthActionTypes>) => {

        try {

            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/auth/detail', {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                
                dispatch(setDetail(respJson.playing, respJson.victories ? respJson.victories : 0, respJson.defeats ? respJson.defeats: 0));

            } else {
                message.warn(respJson.msg);
                console.log(respJson.msg);                
            }

        } catch (error) {
            message.error('Error interno, consulte con el administrador');
            console.log(error);
        }
        
    }
};

export const startRecoveryPasswordAction = (email: string) => {
    return async (dispatch: Dispatch<AuthActionTypes>) => {

        try {

            const resp = await runFetch('api/auth/recovery-password', { email }, 'POST');
            const respJson = await resp.json();

            if (resp.status === 200) {
                message.success('Se enviará la nueva contraseña a su correo');
            } else {
                message.warn(respJson.msg);
                console.log(respJson.msg);                
            }

        } catch (error) {
            message.error('Error interno, consulte con el administrador');
            console.log(error);
        }
        
    }
};

const setDetail = (playing: boolean, victories: number, defeats: number): AuthActionTypes => {
    return {
        type: authStartSetDetail,
        payload: {
            playing,
            victories,
            defeats
        }
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