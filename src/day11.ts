import { readInputFile } from "./utils";



const runMonkeyTurn = (
  monkeys: Monkey[],
  worryFnc = (val: number) => val,
  onInspect: (monkey: Monkey, inspected: number[]) => void = () => { }
) => {
  for (let monkey of monkeys) {
    const mappedItems = monkey.items.map((i) => worryFnc(monkey.operation(i)));
    onInspect(monkey, mappedItems);
    monkey.items = [];
    mappedItems.forEach((item) => {
      if (item % monkey.test === 0) {
        monkeys[monkey.ifTrue].items.push(item);
      } else {
        monkeys[monkey.ifFalse].items.push(item);
      }
    })
  }
}

type Monkey = {
  name: string,
  items: number[],
  operation: (num: number) => number,
  test: number,
  ifTrue: number,
  ifFalse: number
}
export default async (file = './data/day11.txt', part?: number, ...args: string[]) => {
  const monkeys: Monkey[] = [];
  await readInputFile(file, ([part, data]) => {
    if (data) {
      data = data.trim();
    }
    if (part.includes('Monkey')) {
      monkeys.push({
        name: part,
        items: [],
        operation: (old: number) => old,
        test: 0,
        ifTrue: 0,
        ifFalse: 0
      });
      return;
    }
    const monkey = monkeys[monkeys.length - 1];
    if (part.includes('Starting items')) {
      const items = data.split(',').map((v) => Number(v));
      monkey.items = items;
    }
    if (part.includes('Operation')) {
      const funcParts = data.split('=');
      monkey.operation = (old: number) => eval(funcParts[1]);
    }
    if (part.includes('Test')) {
      monkey.test = Number(data.split('by')[1].trim());
    }
    if (part.includes('If true')) {
      monkey.ifTrue = Number(data.split('monkey')[1].trim());
    }
    if (part.includes('If false')) {
      monkey.ifFalse = Number(data.split('monkey')[1].trim());
    }
  }, ':');
  if (!part || part === 1) {
    let monkeysCopy = monkeys.map((m) => ({
      ...m,
      items: [...m.items]
    }))
    const inspected: { id: string, inspected: number }[] = monkeys.map((m) => ({ id: m.name, inspected: 0 }));
    for (let i = 0; i < 20; i++) {
      runMonkeyTurn(
        monkeysCopy,
        (val: number) => Math.floor(val / 3),
        (monkey, inspectedItems) => {
          const inspectedCount = inspected.find((m) => m.id === monkey.name);
          if (inspectedCount) { inspectedCount.inspected += inspectedItems.length; }
        }
      )
    }
    inspected.sort((a, b) => b.inspected - a.inspected);
    console.log(inspected[0].inspected * inspected[1].inspected);
  }
  if (!part || part === 2) {
    let monkeysCopy = monkeys.map((m) => ({
      ...m,
      items: [...m.items]
    }))
    const inspected: { id: string, inspected: number }[] = monkeys.map((m) => ({ id: m.name, inspected: 0 }));
    const worryFactor = monkeys.reduce((a, b) => a * b.test, 1);
    for (let i = 0; i < 10000; i++) {
      runMonkeyTurn(monkeysCopy,
        (v) => {
          return v % worryFactor;
        },
        (monkey, inspectedItems) => {
          const inspectedCount = inspected.find((m) => m.id === monkey.name);
          if (inspectedCount) { inspectedCount.inspected += inspectedItems.length; }
        });
    }
    inspected.sort((a, b) => b.inspected - a.inspected);
    console.log(inspected);
    console.log(inspected[0].inspected * inspected[1].inspected);
  }
}
