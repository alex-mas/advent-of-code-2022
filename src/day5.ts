import { readInputFile } from "./utils";



//modifies the columns in place 
const applyCommands = (commands: number[][], columns: string[][], reversePut = false) => {
  commands.forEach(([ammount, from, to]) => {
    const fromColumn = columns[from];
    const toColumn = columns[to];
    const moved = reversePut ? fromColumn.splice(0, ammount).reverse() : fromColumn.splice(0, ammount);
    columns[to] = [...moved, ...toColumn]
  });
}

export default async (file = './data/day5.txt', part?: number, ...args: string[]) => {
  const columns: string[][] = new Array(10);
  const commands: number[][] = [];
  let parsingCommands = false;
  await readInputFile(file, (row) => {
    const rowData = row[0].split(' ');
    if (rowData.length === 1 && rowData[0] === '') {
      parsingCommands = true;
    }
    if (!parsingCommands) {
      let column = 0;
      let spaces = 0;
      for (let i = 0; i < rowData.length; i++) {
        const value = rowData[i];
        if (value === '') {
          spaces++;
        } else {
          column++;
          if (!isNaN(value as any)) {
            break;
          }
          if (columns[column]) {
            columns[column].push(value);
          } else {
            columns[column] = [value];
          }
        }
        if (spaces === 4) {
          column++;
          spaces = 0;
        }
      }
    } else if (rowData.length > 1) {
      commands.push([Number(rowData[1]), Number(rowData[3]), Number(rowData[5])]);
    }
  });
  if (!part || part === 1) {
    const columnsCopy: string[][] = columns.map((col) => [...col]);
    applyCommands(commands, columnsCopy, true);
    console.log(columnsCopy.filter((col) => col.length > 0).map((col) => col[0].split('[')[1].split(']')[0]).join(''));
  }
  if (!part || part === 2) {
    const columnsCopy: string[][] = columns.map((col) => [...col]);
    applyCommands(commands, columnsCopy, false);
    console.log(columnsCopy.filter((col) => col.length > 0).map((col) => col[0].split('[')[1].split(']')[0]).join(''));
  }

}