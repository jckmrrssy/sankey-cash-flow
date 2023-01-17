import * as fs from 'fs';
import * as path from 'path'

export const getCsvFiles = (directoryPath: string) => {
    fs.readdir(directoryPath, (err: NodeJS.ErrnoException | null, files: string[]) => {
        if (err) {
            console.error(err)
        } else {
            return files.filter(file => path.extname(file) === '.csv')
        }
    })
}
