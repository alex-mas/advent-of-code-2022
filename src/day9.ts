import { readInputFile } from "./utils";

type Vector2d = [number, number];

const computeNewPosition = (headKnot: Vector2d, tailKnot: Vector2d, dir?: string) => {
  if (dir === 'R') {
    headKnot[0] += 1;
  }
  if (dir === 'L') {
    headKnot[0] -= 1;
  }
  if (dir === 'U') {
    headKnot[1] += 1;
  }
  if (dir === 'D') {
    headKnot[1] -= 1;
  }

  const dist = [headKnot[0] - tailKnot[0], headKnot[1] - tailKnot[1]];
  const absDist = [Math.abs(dist[0]), Math.abs(dist[1])];
  const signX = Math.sign(dist[0]);
  const signY = Math.sign(dist[1]);
  if ((absDist[0] >= 1 && absDist[1] > 1) || (absDist[0] > 1 && absDist[1] >= 1)) {
    tailKnot[0] += signX * Math.max(1, absDist[0] - 1);
    tailKnot[1] += signY * Math.max(1, absDist[1] - 1);
  }
  else if (absDist[0] >= 2) {
    tailKnot[0] += signX * (absDist[0] - 1);
  }
  else if (absDist[1] >= 2) {
    tailKnot[1] += signY * (absDist[1] - 1);
  }
}

export default async (file = './data/day9.txt', part?: number, ...args: string[]) => {
  const movements: [string, number][] = []
  await readInputFile(file, ([row]) => {
    const [dir, amount] = row.split(' ');
    movements.push([dir, Number(amount)]);
  });
  if (!part || part === 1) {
    const visited: string[] = ['[0,0]'];
    const headPosition: Vector2d = [0, 0];
    const tailPosition: Vector2d = [0, 0];
    movements.forEach(([dir, amount]) => {
      for (let i = 0; i < amount; i++) {
        computeNewPosition(headPosition, tailPosition, dir);
        const newPos = JSON.stringify(tailPosition);
        if (!visited.includes(newPos)) {
          visited.push(newPos);
        }
      }
    });
    console.log(visited.length);
  }
  if (!part || part === 2) {
    const visited: string[] = ['[0,0]'];
    const rope: Vector2d[] = new Array(10).fill(0).map(() => [0, 0]);
    movements.forEach(([dir, amount]) => {
      for (let i = 0; i < amount; i++) {
        for (let j = 0; j < rope.length - 1; j++) {
          const headKnot = rope[j];
          const tailKnot = rope[j + 1];
          computeNewPosition(headKnot, tailKnot, j === 0 ? dir : undefined);
        }
        const tailPosition = JSON.stringify(rope[rope.length - 1]);
        if (!visited.includes(tailPosition)) {
          visited.push(tailPosition);
        }
      }
    });
    console.log(visited.length);
  }
}
