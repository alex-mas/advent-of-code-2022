import { Vec2 } from "./types";
import { readInputFile } from "./utils";




function reconstruct_path(cameFrom: Map<string, string>, currentNode: string) {
  const totalPath = [currentNode];
  let current = currentNode;
  while (cameFrom.has(current)) {
    current = cameFrom.get(current) as string;
    if (totalPath.includes(current)) {
      break;
    }
    totalPath.push(current);
  }
  return totalPath;
}

const hsh = (v: Vec2) => JSON.stringify(v);


function astar(start: Vec2, goal: Vec2, h: (from: Vec2) => number, map: number[][]) {
  const startHash = hsh(start);
  let openSet = [startHash];

  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>();
  gScore.set(startHash, 0);

  const fScore = new Map<string, number>();
  fScore.set(startHash, h(start));

  while (openSet.length > 0) {
    let current: Vec2 = [Infinity, Infinity];
    let currentHash = 'TBD';
    openSet.forEach((openHash) => {
      const val = fScore.get(openHash);
      if (val && val < current[1]) {
        current = JSON.parse(openHash);
        currentHash = openHash;
      }
    });

    const [x, y] = current;
    const currentVal = map[y][x];

    //console.log(x, y);
    if (x === goal[0] && y === goal[1]) {
      return reconstruct_path(cameFrom, currentHash)
    }

    openSet = openSet.filter((v) => v !== currentHash);

    const neighbors: Vec2[] = [
      [x, y + 1],
      [x, y - 1],
      [x + 1, y],
      [x - 1, y]
    ];
    for (let neighbor of neighbors) {
      const row = map[neighbor[1]];
      if (!row) { continue; }
      const nVal = row[neighbor[0]];
      if (nVal === undefined) { continue; }
      if (nVal > (currentVal + 1)) { continue; }
      const nHash = hsh(neighbor);
      const tentative_gScore = gScore.get(currentHash) as number + 1 // (currentVal - nVal);
      const nScore = gScore.get(nHash);
      if (!nScore || tentative_gScore < nScore) {
        //console.log('pushing into cameFrom', currentHash, nHash)
        //console.log('chp', x, y);
        cameFrom.set(nHash, currentHash)
        gScore.set(nHash, tentative_gScore)
        fScore.set(nHash, tentative_gScore + h(neighbor))
        if (!openSet.includes(nHash)) {
          openSet.push(nHash);
        }
      }
    }
  }

  // Open set is empty but goal was never reached
  return undefined
}


const getDist = (from: Vec2, to: Vec2) => {
  const [fromX, fromY] = from;
  const [toX, toY] = to;
  return Math.ceil(Math.hypot(toX - fromX, toY - fromY));
}

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
    console.log(`Start:${start} End:${end} `)
    const path = astar(start, end, (from) => {
      return 1;
    }, heightmap);
    if (path) {
      baselineL = path.length - 1;
      //console.log(JSON.stringify(path));
      console.log(`Part 1: ${path.length - 1} - [${start}]`);
    }

  }
  if (!part || part === 2) {
    const aSpots: Vec2[] = [];
    heightmap.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          aSpots.push([cellIndex, rowIndex]);
        }
      })
    });
    aSpots.sort((a, b) => {
      return getDist(a, end) - getDist(b, end)
    });
    let minLen = baselineL;
    let spot = start;
    let noCount = 0;
    for (let cSpot of aSpots) {
      const path = astar(cSpot, end, (from) => {
        return 1;
      }, heightmap);
      if (!path) { continue; }
      const len = path.length - 1;
      if (len <= minLen) {
        minLen = len;
        spot = cSpot;
      } else {
        noCount++;
      }
    }
    console.log(`Part 2: ${minLen} - [${spot}]`);
  }
}