import { Dictionary, Item } from "../../pages/Match";
import { change, MatchActionTypes} from "./types";

export const changeMatch = (match: Dictionary<Item[] | []>): MatchActionTypes => {
    return {
        type: change,
        payload: match
    }
};