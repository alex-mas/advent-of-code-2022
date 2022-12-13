import { astar } from "./astar";
import { readInputFile } from "./utils";


export default async (file = './data/day12.txt', part?: number, ...args: string[]) => {
  const heightmap: number[][] = [];
  const start: [number, number] = [0, 0];
  const end: [number, number] = [0, 0]
  await readInputFile(file, ([row], index) => {
    const heightRow = row.split('').map((char, i) => {
      if (char === 'S') {
        start[0] = i;
        start[1] = index;
        return 0;
      }
      if (char === 'E') {
        end[0] = i;
        end[1] = index;
        return 25;
      }
      return char.charCodeAt(0) - 97;
    });
    heightmap.push(heightRow);
  });
  let baselineL = 0;
  if (!part || part === 1) {
    const descentOrOneUp = (origin: number, target: number) => {
      return target <= (origin + 1)
    };
    console.log(`Start:${start} End:${end} `)
    const path = astar(
      start,
      end,
      (from) => {
        return Math.abs((end[0] - from[0]) + (end[1] - from[1]))
      },
      heightmap,
      descentOrOneUp,
      1
    );
    if (path) {
      baselineL = path.length;
      //console.log(JSON.stringify(path));
      console.log(`Part 1: ${baselineL} - [${start}]`);
    }

  }
  if (!part || part === 2) {
    const ascentOrDown1 = (origin: number, target: number) => {
      return (target + 1) >= origin;
    };
    const path = astar(
      end,
      (node) => heightmap[node[1]][node[0]] === 0, (from) => {
        return heightmap[from[1]][from[0]];
      },
      heightmap,
      ascentOrDown1,
      1
    );
    if (path) {
      baselineL = path.length;
      //console.log(JSON.stringify(path));
      console.log(`Part 2: ${baselineL} - [${start}]`);
    }
  }
}