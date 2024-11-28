import { assertResult, readInput } from "../utils";

const input = readInput({ test: false, clear: true, split: true });

const allModules = input.map((row) => row.split(" -> "));

const BROADCASTER = "broadcaster";

const broadcasterOutputs =
  allModules.find((module) => module[0] === BROADCASTER)?.[1].split(", ") ?? [];

type PulseType = "high" | "low";

type Module =
  | {
      name: string;
      type: "flip-flop";
      outputs: string[];
      on: boolean;
    }
  | {
      name: string;
      type: "conjunction";
      outputs: string[];
      memory: Map<string, PulseType>;
    };

type Pulse = {
  from: string;
  to: string;
  type: PulseType;
};

const modules: Module[] = allModules
  .filter((module) => module[0] !== BROADCASTER)
  .map((module) => {
    const moduleType = module[0].charAt(0);
    const name = module[0].substring(1);
    const outputs = module[1].split(", ");

    if (moduleType === "%") {
      return {
        name,
        type: "flip-flop",
        outputs,
        on: false,
      };
    } else {
      return {
        name,
        type: "conjunction",
        outputs,
        memory: new Map(
          allModules
            .filter((module) =>
              module[1].split(", ").some((output) => output === name),
            )
            .map((module) => [
              module[0] === BROADCASTER ? module[0] : module[0].substring(1),
              "low",
            ]),
        ),
      };
    }
  });

const BUTTON_PRESSES = 1000;
let lowPulses = BUTTON_PRESSES;
let highPulses = 0;
for (let i = 0; i < BUTTON_PRESSES; i++) {
  let pulses: Pulse[] = broadcasterOutputs.map((output) => ({
    from: BROADCASTER,
    to: output,
    type: "low",
  }));

  while (pulses.length) {
    let newPulses: Pulse[] = [];

    // keep forwarding pulses
    pulses.forEach((pulse) => {
      if (pulse.type === "high") {
        highPulses++;
      } else {
        lowPulses++;
      }

      const outputModule = modules.find((module) => module.name === pulse.to);

      if (outputModule?.type === "flip-flop") {
        if (pulse.type === "high") {
          return;
        }
        // operate flip-flop
        outputModule.on = !outputModule.on;
        outputModule.outputs.forEach((output) =>
          newPulses.push({
            from: pulse.to,
            to: output,
            type: outputModule.on ? "high" : "low",
          }),
        );
      } else if (outputModule?.type === "conjunction") {
        // operate conjunction
        outputModule.memory.set(pulse.from, pulse.type);

        const type: PulseType = Array.from(outputModule.memory.values()).every(
          (pulse) => pulse === "high",
        )
          ? "low"
          : "high";
        outputModule.outputs.forEach((output) =>
          newPulses.push({
            from: pulse.to,
            to: output,
            type,
          }),
        );
      }
    });

    pulses = newPulses;
  }
}

const result = lowPulses * highPulses;
assertResult(11687500, result);
