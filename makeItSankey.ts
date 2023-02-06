import * as fs from 'fs'
import * as csv from 'fast-csv'
// Input: 
// Category,Amount
//
// Output: 
// Source [Amount] Target
// import { categoryMapping } from './categoryMapping' 

const formatOutput = (mapping: Mapping, category: string, amount: string): string => {
    const [source, target] = mapping[category] || ["Unknown", "Unknown"]
    return `${source} [ ${amount} ] ${target}`
}

interface Mapping {
    [key: string]: [string, string]
}

const categoryMapping: Mapping = {
    "Income": ["", ""],
    "Employer Paid Benefits": ["", ""]

}

const output: string[] = []

fs.createReadStream('.internalCsvFiles/grouped_combined_data.csv')
    .pipe(csv.parse({ headers: true }))
    .on("data", row => {
        const category = row["Category"]
        const amount = row["Amount"]
        const formattedOutput = formatOutput(categoryMapping, category, amount)
        output.push(formattedOutput)
    })
    .on("end", () => {
        fs.writeFile("sankey.txt", output.join("\n"), err => {
            if (err) throw err
            console.log("Results written to snakey.txt")
        })
    })