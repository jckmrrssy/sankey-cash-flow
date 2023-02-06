export const stripDollarSign = (amount: string): string => {
    if (amount.startsWith('-$')) {
        return amount.slice(2);
    } else {
        return amount.slice(1)
    }
}

export const normalize = (filePath: string, amount: string): any => {
    // TODO: genericize
    if (filePath === "inputCsvFiles/Transactions_For_Spending_From_Jan_2022_to_Dec_2022.csv") {
       return stripDollarSign(amount)
    } else {
        return amount
    }
}