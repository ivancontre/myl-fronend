import { SpinActionTypes, spinHide, spinShow, SpinState } from "./types";


const initialState: SpinState = {
    show: false,
    text: ''
};

export const spinReducer = (state: typeof initialState = initialState, action: SpinActionTypes): SpinState => {

    switch (action.type) {

        case spinShow:
            return {
                ...state,
                show: true,
                text: action.payload
            };

        case spinHide:
            return {
                ...state,
                ...initialState
            };


        default:
            return state;

    }
};