import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, clear: true, split: true }).map(
  (line) => line.split(" ") as [string, string],
);

// utils
const cards = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

// over-engineering because I'm afraid of part 2
const getOccurenceCount = (card: string): Record<string, number> =>
  card.split("").reduce<Record<string, number>>((obj, value) => {
    obj[value] === undefined ? (obj[value] = 1) : obj[value]++;
    return obj;
  }, {});

const isFiveOfAKind = (card: string) => /^([2-9AKQJT])\1{4}$/.test(card);
const isFourOfAKind = (card: string) => {
  const occurences = getOccurenceCount(card);
  return Object.values(occurences).some((amount) => amount === 4);
};
const isFullHouse = (card: string) => {
  const occurences = getOccurenceCount(card);
  const occurenceValues = Object.values(occurences);
  return (
    occurenceValues.length === 2 &&
    occurenceValues.some((amount) => amount === 3) &&
    occurenceValues.some((amount) => amount === 2)
  );
};
const isThreeOfAKind = (card: string) => {
  const occurences = getOccurenceCount(card);
  const occurenceValues = Object.values(occurences);
  return (
    occurenceValues.length === 3 &&
    occurenceValues.some((amount) => amount === 3) &&
    occurenceValues.filter((amount) => amount === 1).length === 2
  );
};
const isTwoPair = (card: string) => {
  const occurences = getOccurenceCount(card);
  const occurenceValues = Object.values(occurences);
  return (
    occurenceValues.length === 3 &&
    occurenceValues.filter((amount) => amount === 2).length === 2 &&
    occurenceValues.filter((amount) => amount === 1).length === 1
  );
};
const isOnePair = (card: string) => {
  const occurences = getOccurenceCount(card);
  const occurenceValues = Object.values(occurences);
  return (
    occurenceValues.length === 4 &&
    occurenceValues.filter((amount) => amount === 2).length === 1 &&
    occurenceValues.filter((amount) => amount === 1).length === 3
  );
};
const isHighCard = (card: string) => {
  const occurences = getOccurenceCount(card);
  return Object.values(occurences).length === 5;
};

const resolvers = [
  isFiveOfAKind,
  isFourOfAKind,
  isFullHouse,
  isThreeOfAKind,
  isTwoPair,
  isOnePair,
  isHighCard,
];

// solution
const orderedCards = [...input].sort((a, b) => {
  const [firstHand] = a;
  const [secondHand] = b;

  if (firstHand === secondHand) {
    return 0;
  }

  const firstHandRank =
    resolvers.length - resolvers.findIndex((resolver) => resolver(firstHand));
  const secondHandRank =
    resolvers.length - resolvers.findIndex((resolver) => resolver(secondHand));

  if (firstHandRank !== secondHandRank) {
    return firstHandRank - secondHandRank;
  }

  for (let i = 0; i < firstHand.length; i++) {
    const firstHandLetter = firstHand.charAt(i);
    const secondHandLetter = secondHand.charAt(i);

    if (firstHandLetter !== secondHandLetter) {
      return cards.indexOf(firstHandLetter) - cards.indexOf(secondHandLetter);
    }
  }

  return 0;
});

const result = orderedCards
  .map(([, value], index) => Number(value) * (index + 1))
  .reduce((a, b) => a + b, 0);
assertResult(6440, result);
