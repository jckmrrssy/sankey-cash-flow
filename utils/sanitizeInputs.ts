export const stripDollarSign = (amount: string): string => {
    if (amount.startsWith('-$')) {
        return amount.slice(2);
    }
    return amount;
}