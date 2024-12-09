import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, split: false }).split("").map(Number);
console.clear();

type FilesystemEntry =
  | {
      type: "file";
      size: number;
      id: number;
    }
  | {
      type: "free-space";
      size: number;
    };

const baseFilesystem: FilesystemEntry[] = [];
let id = 0;
input.forEach((char, i) => {
  if (i % 2 === 0) {
    baseFilesystem.push({
      type: "file",
      id: id++,
      size: char,
    });
  } else {
    baseFilesystem.push({
      type: "free-space",
      size: char,
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

const filesystemHasFreeSpace = (
  filesystem: readonly FilesystemEntry[],
): boolean => {
  const freeSpaceIndex = filesystem.findLastIndex(
    (entry) => entry.type === "free-space" && entry.size > 0,
  );
  const lastFileIndex = filesystem.findLastIndex(
    (entry) => entry.type === "file" && entry.size > 0,
  );

  if (freeSpaceIndex < 0) return false;
  return lastFileIndex > freeSpaceIndex;
};

let filesystem = structuredClone(baseFilesystem);
while (filesystemHasFreeSpace(filesystem)) {
  const lastFileIndex = filesystem.findLastIndex(
    (entry) => entry.type === "file" && entry.size > 0,
  );
  const firstFreeSpaceIndex = filesystem.findIndex(
    (entry) => entry.type === "free-space" && entry.size > 0,
  );

  if (lastFileIndex < 0 || firstFreeSpaceIndex < 0) {
    break;
  }
  const lastFile = filesystem[lastFileIndex];
  const firstFreeSpace = filesystem[firstFreeSpaceIndex];
  if (lastFile.type !== "file" || firstFreeSpace.type !== "free-space") {
    break;
  }
  lastFile.size--;
  firstFreeSpace.size--;

  filesystem.splice(firstFreeSpaceIndex, 0, {
    type: "file",
    id: lastFile.id,
    size: 1,
  });

  filesystem = filesystem.filter((entry) => entry.size > 0);
  if (filesystem[filesystem.length - 1].type === "free-space") {
    filesystem.pop();
  }
}

const result = filesystem
  .filter((entry) => entry.type === "file")
  .flatMap((entry) => {
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

assertResult(1928, result);
