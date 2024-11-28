import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, clear: true, split: true }).map(
  (line) => line.split(" ") as [string, string],
);

type HandSet = {
  hand: string;
  bestHand: string;
  value: number;
};

// utils
const allCards = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
];

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

const getHandRank = (hand: string) =>
  resolvers.length - resolvers.findIndex((resolver) => resolver(hand));

const sortCards = (cardA: HandSet, cardB: HandSet) => {
  let { hand: firstHandBase, bestHand: firstHand } = cardA;
  let { hand: secondHandBase, bestHand: secondHand } = cardB;

  if (firstHandBase === secondHandBase) {
    return 0;
  }

  let firstHandRank = getHandRank(firstHand);
  let secondHandRank = getHandRank(secondHand);

  if (firstHandRank === secondHandRank) {
    for (let i = 0; i < firstHandBase.length; i++) {
      const firstHandLetter = firstHandBase.charAt(i);
      const secondHandLetter = secondHandBase.charAt(i);

      if (firstHandLetter !== secondHandLetter) {
        return (
          allCards.indexOf(firstHandLetter) - allCards.indexOf(secondHandLetter)
        );
      }
    }
  } else {
    return firstHandRank - secondHandRank;
  }

  return 0;
};

const getHighestJokerValueHand = (hand: string): string => {
  if (!hand.includes("J")) {
    return hand;
  }

  let bestHand = hand;
  let bestHandRank = getHandRank(hand);

  const lettersToTest = [
    ...new Set(hand.split("").filter((letter) => letter !== "J")),
  ];
  lettersToTest.forEach((letter) => {
    const newHand = hand.replaceAll("J", letter);
    const newHandRank = getHandRank(newHand);

    if (newHandRank >= bestHandRank) {
      bestHand = newHand;
      bestHandRank = newHandRank;
    }
  });

  return bestHand;
};

// solution
const orderedCards = input
  .map(
    ([hand, value]) =>
      ({
        hand,
        bestHand: getHighestJokerValueHand(hand),
        value: Number(value),
      }) satisfies HandSet,
  )
  .sort(sortCards);

const result = orderedCards
  .map(({ value }, index) => value * (index + 1))
  .reduce((a, b) => a + b, 0);
assertResult(5905, result);
