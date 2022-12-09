import { readInputFile } from "./utils";


const isCompleteOverlap = (elf1: number[], elf2: number[]) => {
  const diff1 = elf1[0] - elf2[0];
  const diff2 = elf1[1] - elf2[1];
  return Math.sign(diff1) !== Math.sign(diff2) || diff1 === 0 && diff2 === 0;
}

const isPartialOverlap = (elf1: number[], elf2: number[]) => {
  const diff1 = elf1[0] - elf2[0];
  const diff2 = elf1[1] - elf2[1];
  const diff3 = elf1[0] - elf2[1];
  const diff4 = elf1[1] - elf2[0];
  return (diff3 <= 0 && diff1 >= 0) ||
    (diff4 >= 0 && diff2 <= 0)
}
export default async (file = './data/day4.txt', part?: number, ...args: string[]) => {
  const data: number[][][] = [];
  await readInputFile(file, (row) => {
    const rowData: number[][] = [];
    row.forEach((value) => {
      const ranges = value.split('-').map((value) => Number(value));
      rowData.push(ranges);
    });
    data.push(rowData);
  });
  if (!part || part === 1) {
    let fullyContainedPairs = 0;
    data.forEach(([elf1, elf2]) => {
      if (isCompleteOverlap(elf1, elf2)) {
        fullyContainedPairs++;
      }
    });
    console.log("Part1: ", fullyContainedPairs);
  }
  if (!part || part === 2) {
    let overlappingPairs = 0;
    data.forEach(([elf1, elf2]) => {
      if (
        (isCompleteOverlap(elf1, elf2)) ||
        isPartialOverlap(elf1, elf2)
      ) {
        overlappingPairs++;
      }
    });
    console.log("Part2: ", overlappingPairs);
  }
}