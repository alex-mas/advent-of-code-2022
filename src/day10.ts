import { readInputFile } from "./utils";


type VmConfig = {
  operations: {
    [x: string]: (memory: number[], args: string) => Generator<number[], any, unknown>
  },
  initialMemory: number[]
}

const defaultVm: VmConfig = {
  operations: {
    noop: function* (memory: number[], args: string) {
      yield memory;
    },
    addx: function* (memory: number[], args: string) {
      yield memory;
      memory[0] += Number(args);
      yield memory;
    }
  },
  initialMemory: [1]
}

const vm = ({
  operations,
  initialMemory
}: VmConfig) => function* (src: [string, string][]) {
  const memory = [...initialMemory];
  let head = 0;
  while (head < src.length) {
    const [instruction, args] = src[head];
    const currentOP = yield* operations[instruction](memory, args);
    head++;
  }
  return memory;
}

export default async (file = './data/day10.txt', part?: number, ...args: string[]) => {
  const instructions: [string, string][] = []
  await readInputFile(file, ([row]) => {
    const [instr, param] = row.split(' ');
    instructions.push([instr, param]);
  });
  if (!part || part === 1) {
    const cpu = vm(defaultVm);
    const program = cpu(instructions);
    let op = 1;
    let sum = 0;
    for (let memory of program) {
      op++;
      console.log(memory);
      if (op % 40 === 20) {
        sum += op * memory[0];
        console.log(memory);
      }
    }
    console.log('Sum:', sum);
  }
  if (!part || part === 2) {
    const screen = Array(6).fill('').map((arr) => Array(40).fill('.'));
    const cpu = vm(defaultVm);
    const program = cpu(instructions);
    let col = 1;
    let row = 0;
    //sync render to the "current" value before end of cycle execution by appending first result manually
    screen[0][0] = "#";
    for (let memory of program) {
      if (Math.abs(memory[0] - col) < 2) {
        screen[row][col] = '#';
      }
      col++;
      if (col === 40) {
        row++;
        col = 0;
      }
    }
    screen.forEach((row) => console.log(row.join('')));
  }
}
