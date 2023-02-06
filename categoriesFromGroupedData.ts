import * as fs from 'fs'
import * as csv from 'fast-csv'

interface Mapping {
    [key: string]: [string, string]
}

const generateCategoryMapping = async (filePath: string): Promise<Mapping> => {
    const categoryMapping: Mapping = {}

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('data', row => {
                const category = row["Category"]
                categoryMapping[category] = ["Source", "Target"]
                console.log(row)
            })
            .on('end', () => {
                console.log('end', categoryMapping)
                resolve(categoryMapping)
            })
            .on('error', error => {
                console.log("error", error)
                reject(error)
            })
    })
}

generateCategoryMapping('./internalCsvFiles/grouped_combined_data.csv')
    .then(categoryMapping => {
        fs.writeFileSync('mappings/categoryMapping.json', JSON.stringify(categoryMapping, null, 2))
        console.log("Category Mapping JSON file written successfully.")
    })
    .catch(error => {
        console.error(error)
    })