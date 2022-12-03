import day1 from "./day1";
import day2 from "./day2";
import day3 from "./day3";


const solutions = [
  () => { }, //NO OP
  day1,
  day2,
  day3
]


const args = process.argv.slice(2);

const problem = Number(args[0]);
const file = args[1];
const part = Number(args[2]);
const extraArgs = args.slice(3);

solutions[problem](file,part, ...extraArgs);