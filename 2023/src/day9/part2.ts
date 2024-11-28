import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, clear: true, split: true }).map((line) =>
  line.split(" ").map((num) => Number(num)),
);

const result = input
  .map((sequence) => {
    // 1.- Compute every sequence
    const subsequences: number[][] = [sequence];
    while (
      subsequences[subsequences.length - 1]?.some((number) => number !== 0)
    ) {
      const lastSequence = subsequences[subsequences.length - 1];
      if (!lastSequence) {
        console.error("No sequence found.");
        process.exit(1);
      }
      const newSequence = [];
      for (let i = 1; i < lastSequence.length; i++) {
        const element = lastSequence[i];
        const prevElement = lastSequence[i - 1];

        if (element === undefined || prevElement === undefined) {
          console.error("No sequence elements found");
          process.exit(1);
        }

        newSequence.push(element - prevElement);
      }
      subsequences.push(newSequence);
    }
    return subsequences;
  })
  .map((baseSequenceList) => {
    // 2.- Compute the next value
    const sequenceList = [...baseSequenceList];
    const lastSubsequence = sequenceList[sequenceList.length - 1];
    if (!lastSubsequence) {
      console.error("No subsequence found");
      process.exit(1);
    }
    lastSubsequence.unshift(0);

    // work the way up
    for (let i = sequenceList.length - 1; i > 0; i--) {
      const baseSubsequence = sequenceList[i];
      const targetSubsequence = sequenceList[i - 1];
      if (!baseSubsequence || !targetSubsequence) {
        console.error("No target sequences found");
        process.exit(1);
      }

      const firstBaseSequenceValue = baseSubsequence[0];
      const firstTargetSequenceValue = targetSubsequence[0];
      if (
        firstBaseSequenceValue === undefined ||
        firstTargetSequenceValue === undefined
      ) {
        console.error("No target value found");
        process.exit(1);
      }

      targetSubsequence.unshift(
        firstTargetSequenceValue - firstBaseSequenceValue,
      );
    }

    return sequenceList;
  })
  .map((sequenceList) => {
    // 3.- Compute sum
    const firstList = sequenceList[0];
    if (!firstList) {
      console.error("No first element found");
      process.exit(0);
    }

    return firstList[0]!;
  })
  .reduce((a, b) => a + b, 0);
assertResult(2, result);
