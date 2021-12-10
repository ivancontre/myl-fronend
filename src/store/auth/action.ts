import { message, Modal } from "antd";
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
        authStartUpdateData, 
        User 
} from "./types";

export const startLogin = (username: string, password: string) => {
    return async (dispatch: Dispatch<AuthActionTypes> | any) => {

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

            } else if (resp.status === 401 && respJson.openModalForVerifyAccount) {

                Modal.confirm({
                    title: '¡Verificación de correo requerida!',
                    content: `El correo asociado al usuario "${username}" es "${respJson.email}" y aún no se encuentra verificado. Mientras no se verifique no podrá iniciar sesión. ¿Verificar?`,
                    onOk: () => { 
                        message.info('Enviando correo de verificación...', 5)
                        dispatch(startRetryVerify(respJson.email));

                                               
                     },
                    okText: 'Verificar',
                    cancelText: 'Salir'
                });

            } else {

                if (respJson.errors) {

                    for (let [, value] of Object.entries(respJson.errors)) {
                        message.warn((value as any).msg);
                        console.log((value as any).msg);
                    }

                } else {
                    message.warn(respJson.msg, 5);
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

                message.success('Registrado correctamente. Revisa tu bandeja de entrada de tu correo para verificar la cuenta', 5);

            } else {
                if (respJson.errors) {

                    for (let [, value] of Object.entries(respJson.errors)) {
                        message.warn((value as any).msg);
                        console.log((value as any).msg);
                    }

                } else {
                    message.warn(respJson.msg, 5);
                    console.log(respJson.msg);
                }
                
            }
        } catch (error) {
            message.error('Error interno, consulte con el administrador')
            console.log(error);
        }
        
    }
};

export const startVerifyToken = (token: string, history: any) => {
    return async (dispatch: Dispatch<any>) => {

        try {
            
            const resp = await runFetch('api/auth/verify-token', {}, 'GET', token);
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
                message.warn(respJson.msg);
                console.log(respJson.msg);     
                history.replace('/auth/login');
            }

        } catch (error) {
            message.error('Error interno, consulte con el administrador');
            console.log(error);
        }
        
    }
};

export const startRetryVerify = (email: string) => {
    return async (dispatch: Dispatch<AuthActionTypes>) => {

        try {

            const resp = await runFetch('api/auth/retry-verify', {email}, 'POST');
            const respJson = await resp.json();

            if (resp.status === 200) {

                message.success('Revisa tu bandeja de entrada de tu correo para verificar la cuenta', 5);

            } else {

                message.warn(respJson.msg, 7);
                console.log(respJson.msg);      

            }

        } catch (error) {
            message.error('Error interno, consulte con el administrador');
            console.log(error);
        }
        
    }
};

export const startChecking = () => {
    return async (dispatch: Dispatch<any>) => {

        try {
            const token = localStorage.getItem('token') || 'token';

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

export const startSetUpdateDataAction = (data: any) => {
    return async (dispatch: Dispatch<AuthActionTypes>) => {

        try {

            const token = localStorage.getItem('token') as string;
            const resp = await runFetch('api/auth/update', data, 'PUT', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                
                dispatch(setUpdateData(respJson.name as string, respJson.lastname as string));

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

const setUpdateData = (name: string, lastname: string): AuthActionTypes  => {
    return {
        type: authStartUpdateData,
        payload: {
            name,
            lastname
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