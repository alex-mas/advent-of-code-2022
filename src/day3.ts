import { parse } from "csv-parse";
import { createReadStream } from "fs";
import { EOL } from "os";


const getObjectPriority = (object: string) => {
  const charCode = object.charCodeAt(0);
  return charCode >= 97 ? charCode - 96 : charCode - 38
}

export default (file = './data/day3.csv', part?: number, ...args: string[]) => {
  const data: string[][] = [
  ];
  createReadStream(file)
    .pipe(parse({ delimiter: EOL }))
    .on('data', function ([rowText]: string[]) {
      const charArr = rowText.split('');
      data.push(charArr);
    })
    .on('end', () => {
      if (!part || part === 1) {
        let priorities: number[] = [];
        data.forEach((charArr) => {
          const firstPart = charArr.slice(0, charArr.length / 2).sort();
          const secondPart = charArr.slice(charArr.length / 2).sort();
          const match = firstPart.find((char) => secondPart.includes(char));
          priorities.push(getObjectPriority(match!))
        });
        console.log('Part 1: ', priorities.reduce((a, b) => a + b, 0))

      }
      if (!part || part === 2) {
        let currentGroupItems = new Map<string, number>();
        const badges: string[] = [];
        for (let i = 0; i < data.length; i++) {
          let backpackContents = data[i].sort();
          let uniqueItems: string[] = [];
          for (let j = 0; j < backpackContents.length; j++) {
            const item = backpackContents[j];
            if (!uniqueItems.includes(item)) {
              uniqueItems.push(item);
              if (currentGroupItems.has(item)) {
                const newCount = currentGroupItems.get(item)! + 1;
                currentGroupItems.set(item, newCount);
                if (newCount === 3) {
                  badges.push(item);
                }
              } else {
                currentGroupItems.set(item, 1);
              }
            }
          }

          if (((i + 1) % 3) === 0) {
            currentGroupItems.clear();
          }
        }
        console.log('Part 2: ', badges.reduce((a, b) => a + getObjectPriority(b), 0))
      }
    })
}