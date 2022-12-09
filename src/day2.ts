import { parse } from "csv-parse";
import { createReadStream } from "fs";
import { EOL } from "os";

type OpponentValue = 'A' | 'B' | 'C';
type MyValue = 'X' | 'Y' | 'Z';

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;
const Choice = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS,
  X: ROCK,
  Y: PAPER,
  Z: SCISSORS
}
const RoundOutcome = {
  X: 0,
  Y: 3,
  Z: 6
}

export default (file = './data/day2.txt', part?: number, ...args: string[]) => {
  let totalScore1 = 0;
  let totalScore2 = 0;
  createReadStream(file)
    .pipe(parse({ delimiter: EOL }))
    .on('data', function ([rowText]) {
      const [opponentValue, myValue]: [OpponentValue, MyValue] = rowText.split(' ');
      const opponentChoice = Choice[opponentValue];
      //part 1
      const myChoice = Choice[myValue];
      let roundOutcome = 0;
      if (myChoice === opponentChoice) {
        roundOutcome = 3;
      } else if (myChoice - 1 === opponentChoice || myChoice + 2 === opponentChoice) {
        roundOutcome = 6;
      }
      const roundScore1 = myChoice + roundOutcome;
      totalScore1 += roundScore1;

      //part 2
      roundOutcome = RoundOutcome[myValue];
      let myChoiceScore = opponentChoice;
      if (roundOutcome === 0) {
        myChoiceScore -= 1;
        if (myChoiceScore === 0) {
          myChoiceScore = 3;
        }
      } else if (roundOutcome === 6) {
        myChoiceScore += 1;
        if (myChoiceScore === 4) {
          myChoiceScore = 1;
        }
      }
      const roundScore2 = roundOutcome + myChoiceScore;
      totalScore2 += roundScore2;
    })
    .on('end', function () {
      console.log('Part 1: ', totalScore1);
      console.log('Part 2: ', totalScore2);
    });
}