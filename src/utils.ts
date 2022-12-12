import { createReadStream } from "fs";
import { EOL } from "os";


export const readInputFile = async (path: string, onRow: (row: string[], index: number) => void, separator: string = ',') => {
  return new Promise((resolve, reject) => {
    createReadStream(path)
      .on('data', function (rowText) {
        const str = rowText.toString();
        const rows = str.split(EOL);
        rows.forEach((row, i) => {
          onRow(row.split(separator), i);
        })
      })
      .on('end', () => {
        resolve(undefined);
      })
  })
}