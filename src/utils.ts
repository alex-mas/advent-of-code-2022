import { createReadStream } from "fs";
import { EOL } from "os";


export const readInputFile = async (path: string, onRow: (row: string[]) => void, separator: string = ',') => {
  return new Promise((resolve, reject) => {
    createReadStream(path)
      //.pipe(parse({ delimiter, record_delimiter: EOL }))
      .on('data', function (rowText) {
        const str = rowText.toString();
        const rows = str.split(EOL);
        rows.forEach((row) => {
          onRow(row.split(separator));
        })
      })
      .on('end', () => {
        resolve(undefined);
      })
  })
}