import day1 from "./day1";


const solutions = [
  () => { }, //NO OP
  day1
]


const args = process.argv.slice(2);

const problem = Number(args[0]);


solutions[problem]();