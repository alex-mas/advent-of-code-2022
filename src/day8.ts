import { readInputFile } from "./utils";

export default async (file = './data/day8.csv', part?: number, ...args: string[]) => {
  const grid: number[][] = [];
  await readInputFile(file, ([row]) => {
    grid.push(row.split('').map((tree) => Number(tree)));
  });
  if (!part || part == 1) {
    let visible = grid[0].length * 2 + (grid.length - 2) * 2;
    grid.forEach((row, rowIndex) => {
      if (rowIndex === 0 || rowIndex === grid.length - 1) {
        return;
      }
      row.forEach((tree, treeIndex) => {
        if (treeIndex === 0 || treeIndex === row.length - 1) { return; }
        let visibleLeft = true;
        let visibleRight = true;
        let visibleTop = true;
        let visibleBottom = true;
        for (let i = 0; i < treeIndex; i++) {
          const otherTree = row[i];
          if (otherTree >= tree) {
            visibleLeft = false;
          }
        }
        if (visibleLeft) {
          visible++;
          return;
        }
        for (let i = treeIndex + 1; i < row.length; i++) {
          const otherTree = row[i];
          if (otherTree >= tree) {
            visibleRight = false;
          }
        }
        if (visibleRight) {
          visible++;
          return;
        }
        for (let i = 0; i < rowIndex; i++) {
          const otherTree = grid[i][treeIndex]
          if (otherTree >= tree) {
            visibleTop = false;
          }
        }
        if (visibleTop) {
          visible++;
          return;
        }
        for (let i = rowIndex + 1; i < grid.length; i++) {
          const otherTree = grid[i][treeIndex];
          if (otherTree >= tree) {
            visibleBottom = false;
          }
        }
        if (visibleBottom) {
          visible++;
          return;
        }
      });
    });
    console.log(visible);
  }
  if (!part || part == 2) {
    let maxTreeScore = 0;
    let position: number[] = [];
    grid.forEach((row, rowIndex) => {
      if (rowIndex === 0 || rowIndex === grid.length - 1) {
        return;
      }
      row.forEach((tree, treeIndex) => {
        if (treeIndex === 0 || treeIndex === row.length - 1) { return; }
        let visibleLeft = 0;
        let visibleRight = 0;
        let visibleTop = 0;
        let visibleBottom = 0;
        for (let i = treeIndex - 1; i >= 0; i--) {
          const otherTree = row[i];
          visibleLeft++;
          if (otherTree >= tree) {
            break;
          }
        }
        for (let i = treeIndex + 1; i < row.length; i++) {
          const otherTree = row[i];
          visibleRight++;
          if (otherTree >= tree) {
            break;
          }
        }
        for (let i = rowIndex - 1; i >= 0; i--) {
          const otherTree = grid[i][treeIndex];
          visibleTop++;
          if (otherTree >= tree) {
            break;
          }
        }
        for (let i = rowIndex + 1; i < grid.length; i++) {
          const otherTree = grid[i][treeIndex];
          visibleBottom++;
          if (otherTree >= tree) {
            break;
          }
        }
        const score = visibleBottom * visibleTop * visibleLeft * visibleRight;
        if (score > maxTreeScore) {
          maxTreeScore = score;
          position = [rowIndex, treeIndex];
        }
      });
    });
    console.log('Position: ', position, ' Score: ', maxTreeScore);
  }
}