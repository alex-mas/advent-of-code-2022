import { parse } from "csv-parse";
import { createReadStream } from "fs";
import { EOL } from "os";


export const readInputFile = async (path: string, onRow: (row: string[]) => void) => {
  return new Promise((resolve, reject) => {
    createReadStream(path)
      .pipe(parse({ delimiter: ',', record_delimiter: EOL }))
      .on('data', function (rowText: string[]) {
        onRow(rowText)
      })
      .on('end', () => {
        resolve(undefined);
      })
  })
}
