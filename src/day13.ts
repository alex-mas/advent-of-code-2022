import { readInputFile } from "./utils";
type packet = (number | packet)[];
const parsePacket = (line: string) => {
  let packet = JSON.parse(`${line}`);
  if (!packet) { return undefined; }
  return packet;
}


const isCorrectOrder = (left: any, right: any): number => {
  let correctOrder = left.length === 0 && right.length > 0 ? 1 : 0;
  for (let i = 0; i < left.length; i++) {
    const leftVal = left[i];
    const rightVal = right[i];
    if (leftVal === undefined) {
      if (rightVal === undefined) {
        continue;
      } else {
        return 1;
      }
    } else if (rightVal === undefined) {
      return -1;
    }
    if (typeof leftVal === 'number' && typeof rightVal === 'number') {
      const diff = rightVal - leftVal;
      if (diff !== 0) {
        return diff;
      }
      continue;
    }

    if (Array.isArray(leftVal)) {
      if (Array.isArray(rightVal)) {
        const order = isCorrectOrder(leftVal, rightVal);
        if (order != 0) {
          return order;
        }
      } else {
        const order = isCorrectOrder(leftVal, [rightVal]);
        if (order != 0) {
          return order;
        }
      }
    } else if (Array.isArray(rightVal)) {
      const order = isCorrectOrder([leftVal], rightVal);
      if (order != 0) {
        return order;
      }
    }
  }
  if (right.length > left.length) {
    return 1;
  }
  return correctOrder;
}

export default async (file = './data/day13.txt', part?: number, ...args: string[]) => {

  const packets: packet[] = [];
  await readInputFile(file, ([row], index) => {
    if (row.trim().length === 0) {
      return;
    }
    const rowPacket = parsePacket(row);
    if (rowPacket) {
      packets.push(rowPacket);
    }
  }, 'noop');
  if (!part || part === 1) {
    const rightOrder: number[] = [];
    for (let i = 0; i < (packets.length / 2); i++) {
      const pair = i * 2;
      const left = packets[pair];
      const right = packets[pair + 1];
      if (isCorrectOrder(left, right) > 0) {
        rightOrder.push(i + 1);
      }
    }
    console.log(`Part 1: right sum ${rightOrder.reduce((a, b) => a + b, 0)} `)
  }
  if (!part || part === 2) {
    const divider1: any = [[2]];
    const divider2: any = [[6]];
    packets.push(divider1);
    packets.push(divider2);
    packets.sort((a, b) => {
      return isCorrectOrder(b, a);
    });
    const indexes: any[] = [];
    indexes.push(packets.indexOf(divider1) + 1);
    indexes.push(packets.indexOf(divider2) + 1);
    console.log(packets[0]);
    console.log(`Part 2: indexes(${indexes[0]}|${indexes[1]}) -> ${indexes[0] * indexes[1]}`)
  }
}