import { readInputFile } from "./utils";

const CellValue = {
  ROCK: 1,
  EMPTY: 0,
  SAND: 2,
  SAND_SOURCE: 3
}



const simulateSandFall = (data: number[][]) => {
  let fallenSandCount = 0;
  let currentSand = [2000, 0];
  while (true) {
    const down = currentSand[1] + 1;
    const left = currentSand[0] - 1;
    const right = currentSand[0] + 1;
    let downCell = data[down] ? data[down][currentSand[0]] : undefined;
    if (downCell === undefined) {
      break;
    }
    let downLeftCell = data[down][left];
    let downRightCell = data[down][right];
    if (downCell === CellValue.EMPTY) {
      currentSand[1] = down;
    } else if (downLeftCell === CellValue.EMPTY) {
      currentSand = [left, down];
    } else if (downRightCell === CellValue.EMPTY) {
      currentSand = [right, down];
    } else {
      const currentVal = data[currentSand[1]][currentSand[0]];
      if (currentVal === CellValue.SAND) {
        break;
      }
      fallenSandCount++;
      data[currentSand[1]][currentSand[0]] = CellValue.SAND;
      currentSand = [2000, 0];
    }
  }
  return fallenSandCount;
}

const SIM_WIDTH = 2500;
const SAND_SOURCE_X = 2000;




export default async (file = './data/day14.txt', part?: number, ...args: string[]) => {
  const data: number[][] = []
  for (let i = 0; i < 500; i++) {
    data.push(Array(2500).fill(CellValue.EMPTY));
  }
  data[0][2000] = CellValue.SAND_SOURCE;
  let maxY = 0;
  await readInputFile(file, (row, index) => {
    let lastVertex: number[] | undefined = undefined;
    row.forEach((vertex, i) => {
      const parsedVertex = vertex.trim().split(',').map(Number);
      if (!lastVertex) {
        lastVertex = parsedVertex;
        return;
      }


      const diff = lastVertex.map((a, i) => parsedVertex[i] - a);

      //Assumes only one direction has diff > 0 so we get the relevant data for the axis with differences
      const [dSign, delta, axis] = diff[0] !== 0 ?
        [Math.sign(diff[0]), diff[0], 0]
        :
        [Math.sign(diff[1]), diff[1], 1];

      data[lastVertex[1]][1500 + lastVertex[0]] = CellValue.ROCK;

      for (let i = 0; i !== delta; i += dSign) {
        const pointDelta = i + dSign;
        const point = [lastVertex[0] + (axis === 0 ? pointDelta : 0), lastVertex[1] + (axis === 1 ? pointDelta : 0)];
        if (point[1] > maxY) {
          maxY = point[1];
        }
        data[point[1]][1500 + point[0]] = CellValue.ROCK;
      }
      lastVertex = parsedVertex;
    });
  }, '->');
  if (!part || part === 1) {
    const part1Data = JSON.parse(JSON.stringify(data));
    let fallenSandCount = simulateSandFall(part1Data)
    console.log(`Part 1: ${fallenSandCount}`);
  }
  if (!part || part === 2) {
    const part2Data: typeof data = JSON.parse(JSON.stringify(data));
    maxY += 2;
    part2Data[maxY] = part2Data[maxY].map((a) => {
      return CellValue.ROCK;
    });
    let fallenSandCount = simulateSandFall(part2Data)
    console.log(`Part 2: ${fallenSandCount}`);
  }
}