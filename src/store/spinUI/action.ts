import { SpinActionTypes, spinHide, spinShow} from "./types";

export const showSpin = (text: string): SpinActionTypes => {
    return {
        type: spinShow,
        payload: text
    }
};

export const hideSpin = (): SpinActionTypes => {
    return {
        type: spinHide
    }
};