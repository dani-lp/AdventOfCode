import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, clear: true, split: true });

const range = (length: number, from: number) =>
  Array.from({ length }, (_, i) => i + from);

type Deck = {
  [id: string]: {
    matches: number;
    amount: number;
  };
};

const deck: Deck = input.reduce((deck, line) => {
  const [card, numbers] = line.split(":") as [string, string];
  const cardId = card.substring(4).trim();
  const [winningStr, ownStr] = numbers.split(" | ") as [string, string];
  const winning = winningStr
    .trim()
    .split(" ")
    .filter((num) => num !== "");
  const own = ownStr
    .trim()
    .split(" ")
    .filter((num) => num !== "");

  const matches = own.filter((num) => winning.includes(num)).length;
  if (!cardId) return deck;
  return {
    ...deck,
    [cardId]: {
      matches,
      amount: 1,
    },
  };
}, {});

Object.keys(deck).forEach((cardIdStr) => {
  const card = deck[cardIdStr];
  if (!card) return;
  const matches = Number(card.matches);
  const amount = Number(card.amount);
  const cardId = Number(cardIdStr);

  range(matches, cardId + 1)
    .map((num) => num.toString())
    .forEach((newCardId) => {
      const card = deck[newCardId];
      if (card) {
        card.amount += amount;
      }
    });
});

const result = Object.values(deck)
  .map((card) => card.amount)
  .reduce((a, b) => a + b, 0);
assertResult(30, result);
