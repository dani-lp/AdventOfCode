import { assertResult, readInput } from "../utils";

const codes = readInput({ test: false, clear: true, split: false }).split(",");

const hash = (code: string) =>
  code
    .split("")
    .reduce((acc, curr) => ((acc + curr.charCodeAt(0)) * 17) % 256, 0);

type Lens = {
  code: string;
  power: number;
};

type Box = {
  key: number;
  lenses: Lens[];
};

const boxes: Box[] = Array.from({ length: 256 }, (_, i) => ({
  key: i,
  lenses: [],
}));

codes.forEach((code) => {
  if (code.includes("-")) {
    const [key] = code.split("-");
    if (!key) return;
    const box = boxes[hash(key)];
    if (!box) return;

    const toRemoveIndex = box.lenses.findIndex((lens) => lens.code === key);
    if (toRemoveIndex >= 0) {
      box.lenses.splice(toRemoveIndex, 1);
    }
  } else if (code.includes("=")) {
    const [key, power] = code.split("=");
    if (!key || !power) return;
    const box = boxes[hash(key)];
    if (!box) return;

    const lenseInBoxIndex = box.lenses.findIndex((lens) => lens.code === key);
    if (lenseInBoxIndex >= 0) {
      box.lenses[lenseInBoxIndex]!.code = key;
      box.lenses[lenseInBoxIndex]!.power = Number(power);
    } else {
      box.lenses.push({ code: key, power: Number(power) });
    }
  }
});

const result = boxes
  .map((box, boxIndex) => {
    return box.lenses
      .map((lens, lensIndex) => (1 + boxIndex) * (1 + lensIndex) * lens.power)
      .reduce((a, b) => a + b, 0);
  })
  .reduce((a, b) => a + b, 0);
assertResult(145, result);
