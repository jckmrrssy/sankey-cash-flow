import * as fs from 'fs';
import * as csv from 'fast-csv';
import * as path from 'path'
import { stripDollarSign } from './utils/sanitizeInputs'

const directoryPath: string = './csvFiles'
const outputFile: string = 'grouped_data.csv'

interface Data {
    [key: string]: number
}

const data: Data = {}

fs.readdir(directoryPath, (err: NodeJS.ErrnoException | null, files: string[]) => {
    if (err) {
        console.error(err)
    } else {
        const csvFiles = files.filter(file => path.extname(file) === ('.csv'))
        
        csvFiles.forEach(file => {
            const filePath = path.join(directoryPath, file)
            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true }))
                .on('data', (row: any) => {
                    // TODO: extend support to similar column names 
                    if (!data[row.Category]) {
                        data[row.Category] = 0
                    }
                    data[row.Category] += parseFloat(stripDollarSign(row['Amount (USD)']))
                })
                .on('end', () => {
                    console.log(`Finished processing ${file}`)
                    if (file === csvFiles[csvFiles.length - 1]) {
                        const csvString = Object.entries(data).map(([category, totalAmount]) => `${category},${totalAmount}\n`).join('')
                        fs.writeFile(outputFile, csvString, (err: NodeJS.ErrnoException | null ) => {
                            if (err) {
                                console.error(err)
                            } else {
                                console.log('Finished writing grouped data to file')
                            }
                        })
                    }
                })
        })
    }
    
})