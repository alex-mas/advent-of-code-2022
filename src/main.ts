import day1 from "./day1";
import day2 from "./day2";


const solutions = [
  () => { }, //NO OP
  day1,
  day2
]


const args = process.argv.slice(2);

const problem = Number(args[0]);
const file = args[1];
const part = Number(args[2]);
const extraArgs = args.slice(3);

solutions[problem](file,part, ...extraArgs);