import { Dictionary, ICard } from "../../pages/MatchPage";
import { change, MatchActionTypes} from "./types";

export const changeMatch = (match: Dictionary<ICard[] | []>): MatchActionTypes => {
    return {
        type: change,
        payload: match
    }
};