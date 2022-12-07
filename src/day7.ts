import { readInputFile } from "./utils";


type TreeNode = { name: string, size: number, parent?: TreeNode, children: TreeNode[] }



const iterateFilesystem = (node: TreeNode, callback: (node: TreeNode) => void) => {
  node.children.forEach((n) => iterateFilesystem(n, callback));
  callback(node);
}

const resolveFilesystemSize = (node: TreeNode) => {
  const childrenSize: number = node.children.reduce((a, n) => a + resolveFilesystemSize(n), 0);
  node.size += childrenSize;
  return node.size;
}

const createTreeNode = (name: string, parent?: TreeNode, size: number = 0) => {
  return {
    name,
    size,
    parent,
    children: []
  }
}

export default async (file = './data/day7.csv', part?: number, ...args: string[]) => {
  let fileSystem: TreeNode = {
    name: 'root',
    size: 0,
    parent: undefined,
    children: []
  }
  fileSystem.parent = fileSystem;
  let currentFile = fileSystem;
  await readInputFile(file, ([row]) => {
    const isCommand = row[0] === '$';
    if (isCommand) {
      const command = row.slice(2, 4);
      const param = row.slice(5);
      if (command === 'cd' && param !== '/') {
        if (param == '..') {
          currentFile = currentFile.parent!;
        } else {
          const folder = currentFile.children.find((node) => {
            return node.name === param;
          })
          if (folder) {
            currentFile = folder;
          }
        }
      }
    } else {
      const [size, file] = row.split(' ');
      if (size === 'dir') {
        currentFile.children.push(createTreeNode(file, currentFile));
      } else {
        currentFile.children.push(createTreeNode(file, currentFile, Number(size)));
      }
    }
  });
  resolveFilesystemSize(fileSystem);
  if (!part || part === 1) {
    const folderSizes: TreeNode[] = [];
    iterateFilesystem(fileSystem, (node) => {
      if (node.size <= 100000 && node.children.length > 0) {
        folderSizes.push(node);
      }
    });
    console.log(folderSizes.reduce((a, b) => a + b.size, 0));
  }
  if (!part || part === 2) {
    const available = 70000000 - fileSystem.size;
    const required = 30000000 - available;
    let min = fileSystem;
    iterateFilesystem(fileSystem, (node) => {
      if (node.size >= required && node.size <= min.size && node.children.length > 0) {
        min = node;
      }
    });
    console.log(min.name, min.size);

  }
}