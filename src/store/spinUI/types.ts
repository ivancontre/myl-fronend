export const spinShow = '[spin] Show';
export const spinHide = '[spin] Hide';

export type SpinState = {
    show: boolean;
    text: string;
};

type SpinShowAction = {
    type: typeof spinShow,
    payload: string
};

type SpinHideAction = {
    type: typeof spinHide
};

export type SpinActionTypes = SpinShowAction | SpinHideAction;