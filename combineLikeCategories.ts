import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
// import likeCategories from './mappings/likeCategories.json'

async function combineCategories(inputFile: string, outputFile: string, combineCases: Array<[string, string]>) {
  const categories: Map<string, number> = new Map();

  fs.createReadStream(inputFile)
    .pipe(fastCsv.parse({ headers: true }))
    .on('data', (data) => {
      let category = data.Category;
      for (const [src, dest] of combineCases) {
        if (category === src) {
          category = dest;
          break;
        }
      }
      const amount = parseFloat(data.Amount);
      if (categories.has(category)) {
        // this check should be sufficient but TS doesn't like it because we are adding 
        // a number a potentially undefined value
        // so here we go
        const safeCategoryAmount = categories.get(category) ?? 0
        categories.set(category, safeCategoryAmount + amount);
      } else {
        categories.set(category, amount);
      }
    })
    .on('end', () => {
      const output = fs.createWriteStream(outputFile);
      fastCsv
        .write(Array.from(categories.entries()).map(([Category, Amount]) => ({ Category, Amount })), { headers: true })
        .pipe(output);
    });
}

combineCategories('./internalCsvFiles/grouped_data.csv', './internalCsvFiles/grouped_combined_data.csv', [
  ['Grocery', 'Groceries'],
]);
