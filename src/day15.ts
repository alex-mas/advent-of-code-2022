import { Vec2 } from "./types";
import { readInputFile } from "./utils";
import { manhattanDist } from "./utils/dist";


type SensorBeaconPair = {
  sensor: Vec2,
  beacon: Vec2,
  dist: number
}


const updateBounds = (point: Vec2, bounds: {
  x: Vec2<number | undefined>,
  y: Vec2<number | undefined>,
}) => {
  if (bounds.x[0] === undefined || point[0] < bounds.x[0]) {
    bounds.x[0] = point[0];
  }
  if (bounds.x[1] === undefined || point[0] > bounds.x[1]) {
    bounds.x[1] = point[0];
  }
  if (bounds.y[0] === undefined || point[1] < bounds.y[0]) {
    bounds.y[0] = point[1];
  }
  if (bounds.y[1] === undefined || point[1] > bounds.y[1]) {
    bounds.y[1] = point[1];
  }
}


const canPointContainBeacon = (point: Vec2, data: SensorBeaconPair[]) => {
  for (let pair of data) {
    if (pair.beacon[0] === point[0] && pair.beacon[1] === point[1]) {
      return true;
    }
    if (manhattanDist(point, pair.sensor) <= pair.dist) {
      return false;
    }
  }
  return true;
}

const getNearSensor = (point: Vec2, data: SensorBeaconPair[]) => {
  for (let pair of data) {
    const distToSensor = manhattanDist(point, pair.sensor);
    if (distToSensor <= pair.dist) {
      return [pair, distToSensor] as const;
    }
  }
  return [];
}

const findBeaconPositionInRow = (y: number, data: SensorBeaconPair[], xLen: number = 4000000) => {
  for (let x = 0; x <= xLen; x++) {
    const point: Vec2 = [x, y];
    const [nearSensor, distToSensor] = getNearSensor(point, data);
    if (!nearSensor) {
      return point;
    }
    x += Math.max(0, nearSensor.dist - distToSensor - 1);
  }
}



export default async (file = './data/day15.txt', part?: number, ...args: string[]) => {

  const y = Number(args[0]);
  if (args[0] === undefined) {
    throw new Error('No Y (number) arg passed to program, it is required');
  }
  const data: SensorBeaconPair[] = []
  let bounds = {
    x: [undefined, undefined],
    y: [undefined, undefined]
  } as {
    x: Vec2<number | undefined>,
    y: Vec2<number | undefined>,
  };
  let maxDist = 0;
  await readInputFile(file, (row, index) => {
    const [sensorDescription, beaconDescription] = row.map((a) => a.split('at')[1].trim());
    const sensor = sensorDescription.split(',').map((a) => Number(a.split('=')[1].trim())) as Vec2;
    const beacon = beaconDescription.split(',').map((a) => Number(a.split('=')[1].trim())) as Vec2;
    updateBounds(sensor, bounds);
    updateBounds(beacon, bounds);
    const dist = manhattanDist(beacon, sensor);
    if (maxDist <= dist) {
      maxDist = dist;
    }
    data.push({
      sensor,
      beacon,
      dist
    });
  }, ':');
  const computedBounds = bounds as {
    x: Vec2,
    y: Vec2,
  };
  console.log(bounds);
  if (!part || part === 1) {
    let cantContainBeaconCount = 0;
    const xMin = computedBounds.x[0];
    const xMax = computedBounds.x[1];
    for (let i = xMin + (maxDist * Math.sign(xMin)); i <= xMax + (maxDist * Math.sign(xMax)); i++) {
      if (!canPointContainBeacon([i, y], data)) {
        cantContainBeaconCount++;
      }
    }
    console.log(`Part 1: ${cantContainBeaconCount}`);
  }
  if (!part || part === 2) {
    const sideLength = y === 10 ? 20 : 4000000;
    for (let y = 0; y <= sideLength; y++) {
      const match = findBeaconPositionInRow(y, data, sideLength);
      if (match) {
        console.log(`Part 2: point(${match}), frequency: ${match[0] * 4000000 + match[1]}`);
        break;
      }
    }
  }
}
