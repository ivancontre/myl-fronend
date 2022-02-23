import { Card } from "../store/card/types";
import { ZONE_NAMES } from "../constants";
import { Dictionary } from "../store/match/types";

const { SUPPORT_ZONE, DEFENSE_ZONE, ATTACK_ZONE, CASTLE_ZONE } = ZONE_NAMES;


export const processArmsFromBearer = (cardToMove: Card, newCards: Dictionary<Card[] | []>, newCardsOpponent: Dictionary<Card[] | []>, zoneName: string, myUserId: string, orderType: string, sendMessage: Function) => {
    let haveOpponentArm = false;

    for (const armId of cardToMove.armsId as string[]) {

        const armCardInMyZone = newCards[SUPPORT_ZONE].find((card: Card) => card.idx === armId);

        if (armCardInMyZone) {

            newCards[SUPPORT_ZONE] = newCards[SUPPORT_ZONE].filter((card: Card) => card.idx !== armId);

            delete armCardInMyZone.bearerId;

            if (armCardInMyZone.user === myUserId) {

                if (zoneName === CASTLE_ZONE) {

                    if (orderType === 'SHUFFLE') {

                        newCards[zoneName] = [...newCards[zoneName], armCardInMyZone];
                        sendMessage(`Moviendo y barajando "${armCardInMyZone.name}" de "${SUPPORT_ZONE}" a "${zoneName}"`);

                    } else if (orderType === 'START') {

                        newCards[zoneName] = [...newCards[zoneName], armCardInMyZone];
                        sendMessage(`Moviendo "${armCardInMyZone.name}" de "${SUPPORT_ZONE}" al principio de "${zoneName}"`);

                    } else {

                        newCards[zoneName] = [armCardInMyZone, ...newCards[zoneName]];
                        sendMessage(`Moviendo "${armCardInMyZone.name}" de "${SUPPORT_ZONE}" al final de "${zoneName}"`);

                    }

                } else {

                    newCards[zoneName] = [...newCards[zoneName], armCardInMyZone];
                    sendMessage(`Moviendo "${armCardInMyZone.name}" de "${SUPPORT_ZONE}" a "${zoneName}"`);

                }                   
                

            } else {

                haveOpponentArm = true;

                if (zoneName === CASTLE_ZONE) {
                    
                    sendMessage(`Moviendo y barajando "${armCardInMyZone.name}" de "${SUPPORT_ZONE}" a "${zoneName}" oponente`);
                    newCardsOpponent[zoneName] = [...newCardsOpponent[zoneName], armCardInMyZone];

                } else {

                    sendMessage(`Moviendo "${armCardInMyZone.name}" de "${SUPPORT_ZONE}" a "${zoneName}" oponente`);
                    newCardsOpponent[zoneName] = [...newCardsOpponent[zoneName], armCardInMyZone];

                }                

            }

        }

    }

    return haveOpponentArm;
};

export const processArm = (cardToMove: Card, newCards: Dictionary<Card[] | []>) => {
    const bearerInMyDefenseZone = newCards[DEFENSE_ZONE].find((card: Card) => card.idx === cardToMove.bearerId);

    if (bearerInMyDefenseZone) {

        newCards[DEFENSE_ZONE] = newCards[DEFENSE_ZONE].map((card: Card) => {
            if (card.idx === bearerInMyDefenseZone.idx) {
                return {
                    ...card,
                    armsId: card.armsId?.filter((armId: string) => armId !== cardToMove.idx)
                }
            }

            return card;
        });

    } else {

        const bearerInMyAttackZone = newCards[ATTACK_ZONE].find((card: Card) => card.idx === cardToMove.bearerId);

        if (bearerInMyAttackZone) {
            newCards[ATTACK_ZONE] = newCards[ATTACK_ZONE].map((card: Card) => {
                if (card.idx === bearerInMyAttackZone.idx) {
                    return {
                        ...card,
                        armsId: card.armsId?.filter((armId: string) => armId !== cardToMove.idx)
                    }
                }

                return card;
            });
        }
    }
};