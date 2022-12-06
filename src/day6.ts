import { readInputFile } from "./utils";


export const processUntilUniqueCharSequence = (input: string[], length: number) => {
  let stack: string[] = [];
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (stack.includes(char)) {
      stack = stack.slice(stack.indexOf(char) + 1)
    }
    stack.push(char);
    if (stack.length === length) {
      return i + 1;
    }
  }
  return -1;
}

export default async (file = './data/day6.csv', part?: number, ...args: string[]) => {
  let rows: string[][] = [];
  await readInputFile(file, ([row]) => {
    rows.push(row.split(''));
  });
  if (!part || part === 1) {
    let starts: number[] = [];
    rows.forEach((row) => {
      starts.push(processUntilUniqueCharSequence(row, 4));
    });
    console.log('Part 1: ', starts);
  }
  if (!part || part === 2) {
    let starts: number[] = [];
    rows.forEach((row) => {
      starts.push(processUntilUniqueCharSequence(row, 14));
    });
    console.log('Part 2: ', starts);
  }
}