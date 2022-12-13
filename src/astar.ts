import { Vec2 } from "./types";

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
  totalPath.pop();
  return totalPath;
}

const hsh = (v: Vec2) => JSON.stringify(v);


enum MovementType {
  FOUR_WAY = 1,
  EIGHT_WAY = 2
}

export const astar = (
  start: Vec2,
  goal: Vec2 | ((point: Vec2) => boolean),
  h: (from: Vec2) => number,
  map: number[][],
  walkable: (a: number, b: number) => boolean,
  movementType: MovementType = 1
) => {
  const startHash = hsh(start);
  let openSet = [startHash];

  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>();
  gScore.set(startHash, 0);

  const fScore = new Map<string, number>();
  fScore.set(startHash, h(start));

  while (openSet.length > 0) {
    let current: Vec2 = JSON.parse(openSet[0]);
    let currentHash = openSet[0];

    const [x, y] = current;
    const currentVal = map[y][x];

    //console.log(x, y);
    if (typeof goal === 'function' ? goal(current) : x === goal[0] && y === goal[1]) {
      return reconstruct_path(cameFrom, currentHash)
    }

    openSet = openSet.filter((v) => v !== currentHash);

    const neighbors: Vec2[] = [
      [x, y + 1],
      [x, y - 1],
      [x + 1, y],
      [x - 1, y]
    ];
    if (movementType === MovementType.EIGHT_WAY) {
      neighbors.push([x + 1, y - 1]);
      neighbors.push([x + 1, y + 1]);
      neighbors.push([x - 1, y - 1]);
      neighbors.push([x - 1, y + 1]);
    }
    for (let neighbor of neighbors) {
      const row = map[neighbor[1]];
      if (!row) { continue; }
      const nVal = row[neighbor[0]];
      if (nVal === undefined) { continue; }
      if (!walkable(currentVal, nVal)) { continue; }
      const nHash = hsh(neighbor);
      const tentative_gScore = gScore.get(currentHash) as number + 1;
      const nScore = gScore.get(nHash);
      if (!nScore || tentative_gScore < nScore) {
        //console.log('pushing into cameFrom', currentHash, nHash)
        //console.log('chp', x, y);
        cameFrom.set(nHash, currentHash)
        gScore.set(nHash, tentative_gScore)
        const newNScore = tentative_gScore + h(neighbor);
        fScore.set(nHash, newNScore);
        if (!openSet.includes(nHash)) {
          const val = fScore.get(openSet[0]) || Infinity;
          if (val < newNScore) {
            openSet.push(nHash);
          } else {
            openSet.unshift(nHash);
          }
        }
      }
    }
  }

  // Open set is empty but goal was never reached
  return undefined;
}