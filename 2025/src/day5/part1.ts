import { assertResult, readInput } from "../utils";

const [ranges, ingredients] = readInput({
  test: false,
  split: false,
  clear: true,
})
  .split("\n\n")
  .map((block) => block.split("\n"));

const freshIngredients = ingredients.filter((ingredientStr) => {
  const ingredient = Number(ingredientStr);

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const [start, end] = range.split("-").map(Number);

    if (ingredient >= start && ingredient <= end) {
      return true;
    }
  }
  return false;
});

assertResult(3, freshIngredients.length);
