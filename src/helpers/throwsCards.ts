import { Card } from "../store/card/types";

export const throwXcards = (x: number, source: any, originZone: string, destinyZone: string) => {
    // if (!source[originZone].length) {
    //     message.warning(`No hay cartas en ${originZone}`);
    //     handleVisibleChange(false);
    //     return;
    // }

    const newMatch = { ...source };
    const newX = newMatch[originZone].length < x ? newMatch[originZone].length : x;
    const toDestiny = newMatch[originZone].slice(-newX);
    newMatch[originZone] = newMatch[originZone].filter((card: Card, index: number) => index < newMatch[originZone].length - newX);
    newMatch[destinyZone] = [...newMatch[destinyZone], ...toDestiny];

    return newMatch;
    //dispatch(changeMatch(newMatch));
    //handleVisibleChange(false);
    
};