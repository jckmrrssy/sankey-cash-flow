export const stripDollarSign = (amount: string): string => {
    if (amount.startsWith('-$')) {
        return amount.slice(2);
    } else {
        return `-${amount.slice(1)}`
    }
}

export const normalize = (filePath: string, amount: string): any => {
    if (filePath === "csvFiles/AppleTransactions2022.csv") {
       return amount
    } else {
        return stripDollarSign(amount)
    }
}