const args = process.argv.slice(2);
const problem = Number(args[0]);
if (isNaN(problem)) {
  throw Error('Invalid problem name, please enter a number as the first parameter');
}
let file: string | undefined;
let part: number | undefined;
args.forEach((arg) => {
  if (arg.includes('--file')) {
    file = './data/' + arg.split('--file=')[1];
  } else if (arg.includes('--part')) {
    part = Number(arg.split('--part=')[1]);
  }
});

(async () => {
  const module = await import(`./day${problem}`);
  module.default(file, part, ...args);
})();
