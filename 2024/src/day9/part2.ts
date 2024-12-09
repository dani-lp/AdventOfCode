import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: false }).split("").map(Number);
console.clear();

type FilesystemEntry =
  | {
      type: "file";
      size: number;
      id: number;
      visited: boolean;
    }
  | {
      type: "free-space";
      size: number;
      visited: boolean;
    };

const baseFilesystem: FilesystemEntry[] = [];
let id = 0;
input.forEach((char, i) => {
  if (i % 2 === 0) {
    baseFilesystem.push({
      type: "file",
      id: id++,
      size: char,
      visited: false,
    });
  } else {
    baseFilesystem.push({
      type: "free-space",
      size: char,
      visited: false,
    });
  }
});

const getStringFilesystem = (filesystem: FilesystemEntry[]): string => {
  let str = "";
  filesystem.forEach((entry) => {
    if (entry.type === "file") {
      str += entry.id.toString().repeat(entry.size);
    } else {
      str += ".".repeat(entry.size);
    }
  });
  return str;
};

const allFilesVisited = (filesystem: readonly FilesystemEntry[]): boolean => {
  const firstFreeSpaceIndex = filesystem.findIndex(
    (entry) => entry.type === "free-space" && entry.size > 0,
  );
  const lastUnvisitedFileIndex = filesystem.findLastIndex(
    (entry) => entry.type === "file" && entry.size > 0 && !entry.visited,
  );

  if (firstFreeSpaceIndex < 0) return true;
  return lastUnvisitedFileIndex > firstFreeSpaceIndex;
};

let filesystem = structuredClone(baseFilesystem);

while (allFilesVisited(filesystem)) {
  // find last un-visited file
  const lastFileIndex = filesystem.findLastIndex(
    (entry) => entry.type === "file" && entry.size > 0 && !entry.visited,
  );
  const lastFile = filesystem[lastFileIndex];
  if (lastFileIndex < 0 || !lastFile || lastFile.type !== "file") {
    break;
  }

  // search for a big enough free space
  const matchingFreeSpaceIndex = filesystem.findIndex(
    (entry) =>
      entry.type === "free-space" &&
      entry.size >= lastFile.size &&
      !entry.visited,
  );
  const matchingFreeSpace = filesystem[matchingFreeSpaceIndex];
  if (matchingFreeSpaceIndex < 0 || !matchingFreeSpace) {
    lastFile.visited = true;
    continue;
  }

  matchingFreeSpace.size -= lastFile.size;

  filesystem.splice(matchingFreeSpaceIndex, 0, {
    type: "file",
    id: lastFile.id,
    size: lastFile.size,
    visited: false,
  });

  const newLastFileIndex = filesystem.findLastIndex(
    (entry) => entry.type === lastFile.type && entry.id === lastFile.id,
  );
  if (newLastFileIndex >= 0) {
    filesystem[newLastFileIndex] = {
      type: "free-space",
      size: lastFile.size,
      visited: true,
    };
  } else {
    break;
  }

  filesystem = filesystem.filter((entry) => entry.size > 0);
  if (filesystem[filesystem.length - 1].type === "free-space") {
    filesystem.pop();
  }
}

const result = filesystem
  .flatMap((entry) => {
    if (entry.type === "free-space") {
      return Array.from({ length: entry.size }, () => ({ id: 0 }));
    }

    if (entry.size === 1) {
      return {
        id: entry.id,
      };
    } else {
      return Array.from({ length: entry.size }, () => ({ id: entry.id }));
    }
  })
  .map(({ id }, index) => id * index)
  .reduce((a, b) => a + b, 0);

assertResult(2858, result);
