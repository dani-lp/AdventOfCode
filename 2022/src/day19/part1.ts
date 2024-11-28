console.clear();
import fs from 'fs';
const filename = 'input.txt';

const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
const input = rawInput.split('\n');

// types and consts
const TIME_LIMIT = 24;

type ResourceType = 'ore' | 'clay' | 'obsidian' | 'geode';

type Blueprint = {
  id: number;
  openableGeodes: number;
  costs: { [key in ResourceType]: { [key in ResourceType]: number } };
}

type Collection = {
  [key in ResourceType]: number;
}

// parsing
const blueprints: Blueprint[] = input.map((blueprint, i) => {
  const splitBlueprint = blueprint.split(' ');

  const oreRobotOreCost = parseInt(splitBlueprint[6]);
  const clayRobotOreCost = parseInt(splitBlueprint[12]);
  const obsidianRobotOreCost = parseInt(splitBlueprint[18]);
  const obsidianRobotClayCost = parseInt(splitBlueprint[21]);
  const geodeRobotOreCost = parseInt(splitBlueprint[27]);
  const geodeRobotObsidianCost = parseInt(splitBlueprint[30]);

  return {
    id: i + 1,
    openableGeodes: 0,
    costs: {
      ore: { ore: oreRobotOreCost },
      clay: { ore: clayRobotOreCost },
      obsidian: { ore: obsidianRobotOreCost, clay: obsidianRobotClayCost },
      geode: { ore: geodeRobotOreCost, obsidian: geodeRobotObsidianCost },
    }
  } as Blueprint;
});

// functions
const getBlueprintQuality = (blueprint: Blueprint) => blueprint.id * blueprint.openableGeodes;

const getBuildableRobots = (blueprint: Blueprint, materials: Collection): ResourceType[] => {
  const buildable: ResourceType[] = [];
  if (materials.ore >= blueprint.costs.ore.ore) {
    buildable.push('ore');
  }
  if (materials.ore >= blueprint.costs.clay.ore) {
    buildable.push('clay');
  }
  if (materials.ore >= blueprint.costs.obsidian.ore && materials.clay >= blueprint.costs.obsidian.clay) {
    buildable.push('obsidian');
  }
  if (materials.ore >= blueprint.costs.geode.ore && materials.obsidian >= blueprint.costs.geode.obsidian) {
    buildable.push('geode');
  }
  return buildable;
};

type TreeNode = {
  materials: Collection;
  robots: Collection;
  emptyStateCounter: number;
}

const treeNodeToString = (node: TreeNode) => {
  return `${node.materials.ore},${node.materials.clay},${node.materials.obsidian},${node.materials.geode},${node.robots.ore},${node.robots.clay},${node.robots.obsidian},${node.robots.geode}`;
};

// algorithm: use a tree
blueprints.forEach((blueprint, bn) => {
  const rootNode: TreeNode = {
    materials: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    robots: {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    emptyStateCounter: 0,
  };

  let currentLayers = [rootNode];
  const currentLayerSet = new Set<string>([treeNodeToString(rootNode)]);

  for (let minute = 1; minute <= TIME_LIMIT; minute++) {
    // 1.- generate children for every node in current layer
    const newLayerNodes: TreeNode[] = [];
    for (let i = 0; i < currentLayers.length; i++) {
      const node = currentLayers[i];

      const buildableRobots = getBuildableRobots(blueprint, node.materials);

      if (buildableRobots.includes('geode')) {
        const newNode: TreeNode = { materials: { ...node.materials }, robots: { ...node.robots }, emptyStateCounter: node.emptyStateCounter };
        newNode.materials.ore -= blueprint.costs.geode.ore;
        newNode.materials.obsidian -= blueprint.costs.geode.obsidian;
        newNode.materials.ore += node.robots.ore;
        newNode.materials.clay += node.robots.clay;
        newNode.materials.obsidian += node.robots.obsidian;
        newNode.materials.geode += node.robots.geode;
        newNode.robots.geode += 1;
        if (!currentLayerSet.has(treeNodeToString(newNode))) {
          newLayerNodes.push(newNode);
          currentLayerSet.add(treeNodeToString(newNode));
        }
      }
      if (buildableRobots.includes('obsidian') && node.robots.obsidian < Math.max(
        blueprint.costs.geode.obsidian,
      )) {
        const newNode: TreeNode = { materials: { ...node.materials }, robots: { ...node.robots }, emptyStateCounter: node.emptyStateCounter };
        newNode.materials.ore -= blueprint.costs.obsidian.ore;
        newNode.materials.clay -= blueprint.costs.obsidian.clay;
        newNode.materials.ore += node.robots.ore;
        newNode.materials.clay += node.robots.clay;
        newNode.materials.obsidian += node.robots.obsidian;
        newNode.materials.geode += node.robots.geode;
        newNode.robots.obsidian += 1;
        if (!currentLayerSet.has(treeNodeToString(newNode))) {
          newLayerNodes.push(newNode);
          currentLayerSet.add(treeNodeToString(newNode));
        }
      }
      if (buildableRobots.includes('clay')) {
        const newNode: TreeNode = { materials: { ...node.materials }, robots: { ...node.robots }, emptyStateCounter: node.emptyStateCounter };
        newNode.materials.ore -= blueprint.costs.clay.ore;
        newNode.materials.ore += node.robots.ore;
        newNode.materials.clay += node.robots.clay;
        newNode.materials.obsidian += node.robots.obsidian;
        newNode.materials.geode += node.robots.geode;
        newNode.robots.clay += 1;
        if (!currentLayerSet.has(treeNodeToString(newNode))) {
          newLayerNodes.push(newNode);
          currentLayerSet.add(treeNodeToString(newNode));
        }
      }
      if (buildableRobots.includes('ore') && node.robots.ore < Math.max(
        blueprint.costs.ore.ore,
        blueprint.costs.clay.ore,
        blueprint.costs.obsidian.ore,
        blueprint.costs.geode.ore,
      ) ) {
        const newNode: TreeNode = { materials: { ...node.materials }, robots: { ...node.robots }, emptyStateCounter: node.emptyStateCounter };
        newNode.materials.ore -= blueprint.costs.ore.ore;
        newNode.materials.ore += node.robots.ore;
        newNode.materials.clay += node.robots.clay;
        newNode.materials.obsidian += node.robots.obsidian;
        newNode.materials.geode += node.robots.geode;
        newNode.robots.ore += 1;
        if (!currentLayerSet.has(treeNodeToString(newNode))) {
          newLayerNodes.push(newNode);
          currentLayerSet.add(treeNodeToString(newNode));
        }
      }
      const newNode: TreeNode = { materials: { ...node.materials }, robots: { ...node.robots }, emptyStateCounter: node.emptyStateCounter + 1 };
      newNode.materials.ore += node.robots.ore;
      newNode.materials.clay += node.robots.clay;
      newNode.materials.obsidian += node.robots.obsidian;
      newNode.materials.geode += node.robots.geode;
      if (!currentLayerSet.has(treeNodeToString(newNode))) {
        newLayerNodes.push(newNode);
        currentLayerSet.add(treeNodeToString(newNode));
      }
    }

    // 2.- add children to layer map
    if (newLayerNodes.length > 1000000) {
      const filteredNodes = newLayerNodes.sort((a, b) => {
        return b.materials.geode - a.materials.geode
      }).slice(0, 1000000);
      currentLayers = filteredNodes;
    } else {
      currentLayers = newLayerNodes;
    }
    console.log('\t', bn + 1, ': minute', minute, 'has', newLayerNodes.length, 'nodes');
    currentLayerSet.clear();
  }

  // 3.- get results for every node in last layer
  let maxGeodes = 0;
  currentLayers.forEach((node) => {
    if (node.materials.geode > maxGeodes) maxGeodes = node.materials.geode;
  });
  blueprint.openableGeodes = maxGeodes;
  console.log(bn + 1, 'of', blueprints.length, 'finished');
});

// solution
const result = blueprints.reduce((total, blueprint) => total + getBlueprintQuality(blueprint), 0);
console.assert(blueprints[0].openableGeodes === 9, 'Expected 9 openable geodes by blueprint 1, got', blueprints[0].openableGeodes);
console.assert(blueprints[1].openableGeodes === 12, 'Expected 12 openable geodes by blueprint 2, got', blueprints[1].openableGeodes);
console.assert(result === 33, `Expected 33, got ${result}`);