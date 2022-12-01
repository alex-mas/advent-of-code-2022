import { parse } from "csv-parse";
import { createReadStream } from "fs";
import { EOL } from "os";




export default () => {
  const elves = [
    0
  ]
  createReadStream('./data/day1.csv')
    .pipe(parse({ delimiter: EOL }))
    .on('data', function ([calories]) {
      if (calories === '') {
        elves.push(0);
      }
      const calNum = Number(calories);
      elves[elves.length - 1] += calNum;
    })
    .on('end', function () {
      elves.sort((a, b) => b - a);
      console.log('Part 1: ', elves[0]);
      console.log('Part 2: ', elves[0] + elves[1] + elves[2]);
    });
}