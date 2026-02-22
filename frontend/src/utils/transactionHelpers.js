import {
    SORT_DIRECTION_ASC,
    SORT_DIRECTION_DESC,
    SORT_GREATER,
    SORT_LESS
} from "./constants.js";

// Generic helper to sort data
export function sortTransactions(transactions, keyFunc, direction, setDirection) {
    const sorted = [...transactions].sort((a, b) => {
        const valA = keyFunc(a);
        const valB = keyFunc(b);

        if (valA < valB) return direction === SORT_DIRECTION_ASC ? SORT_LESS : SORT_GREATER;
        if (valA > valB) return direction === SORT_DIRECTION_ASC ? SORT_GREATER : SORT_LESS;
        return 0;
    });

    setDirection(direction === SORT_DIRECTION_ASC ? SORT_DIRECTION_DESC : SORT_DIRECTION_ASC);

    return sorted;
}
