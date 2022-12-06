import day1 from "./day1";
import day2 from "./day2";
import day3 from "./day3";
import day4 from "./day4";
import day5 from "./day5";
import day6 from "./day6";


const solutions = [
  () => { }, //NO OP
  day1,
  day2,
  day3,
  day4,
  day5,
  day6
]


const args = process.argv.slice(2);
const problem = Number(args[0]);
let file: string | undefined;
let part: number | undefined;
args.forEach((arg) => {
  if (arg.includes('--file')) {
    file = './data/' + arg.split('--file=')[1];
  } else if (arg.includes('--part')) {
    part = Number(arg.split('--part=')[1]);
  }
});

solutions[problem](file, part, ...args);