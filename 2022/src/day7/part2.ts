console.clear();

// file reading 
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// type declarations
const TOTAL_SPACE = 70000000;
const NEEDED_SPACE = 30000000;

type File = {
  size: number;
  name: string;
};

type Dir = {
  name: string;
  files: File[];
  dirs: Dir[];
  parent?: Dir;
};

// helper functions
const isInstruction = (line: string): boolean => line.startsWith('$');
const isFile = (line: string): boolean => !line.includes('dir');

// parsing
const dirTree: Dir = { name: '/', files: [], dirs: [] };
let currentDir: Dir = dirTree;

input.forEach((line) => {
  if (isInstruction(line)) {
    const [, type, dir] = line.split(' ');
    if (type === 'cd') {
      if (dir === '..' && currentDir.parent) {
        currentDir = currentDir.parent;
      } else if (dir !== '/') {
        currentDir = currentDir.dirs.find((d) => d.name === dir);
      }
    }
  } else {
    if (isFile(line)) {
      const [size, name] = line.split(' ');
      const file: File = { size: parseInt(size), name };
      currentDir.files.push(file);
    } else {
      const dir: Dir = {
        name: line.split(' ')[1],
        dirs: [],
        files: [],
        parent: currentDir,
      };
      currentDir.dirs.push(dir);
    }
  }
});

// result
const validDirs: number[] = [];
const getDirSize = (dir: Dir): number => {
  let size = 0;
  dir.files.forEach(file => size += file.size);
  dir.dirs.forEach(d => size += getDirSize(d));
  validDirs.push(size);
  return size;
};

const toEmpty = NEEDED_SPACE - (TOTAL_SPACE - getDirSize(dirTree));

const result = Math.min(...validDirs.filter((dir) => dir > toEmpty));

console.assert(result === 24933642, 'Expected 24933642, got ' + result);