import * as fs from 'fs'
import * as csv from 'fast-csv' 
import categoryMapping from './mappings/categoryMapping.json'

const formatOutput = (mapping: { [key: string]: string }, category: string, amount: string | undefined): string => {
    const target = mapping[category] || "Unknown"
    return `${target} [ ${amount ? `${parseFloat(amount).toFixed(2)}` : "0.00"} ] ${category}`
}

const output: string[] = []

fs.createReadStream('./internalCsvFiles/grouped_combined_data.csv')
    .pipe(csv.parse({ headers: true }))
    .on("data", row => {
        const category = row["Category"]
        const amount = row["Amount"]
        const formattedOutput = formatOutput(categoryMapping, category, amount)
        output.push(formattedOutput)
    })
    .on("end", () => {
        fs.writeFile("sankey.txt", output.sort().join("\n"), err => {
            if (err) throw err
            console.log("Results written to snakey.txt")
        })
    })
