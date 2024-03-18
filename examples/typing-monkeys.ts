import { evolve, stats } from "../src/lib"
import { Organism } from "../src/types";

const target = "hello world";

const { population, populationFitness } = evolve({
  mutationRate: 0.009,
  populationSize: 200,
  genomeLength: target.length,
  gene: () => randomChar(),
  fitness: (o) => {
    let score = 0;

    for (let i = 0; i < o.genome.length; i++) {
      if (o.genome[i] === target[i]) {
        score++;
      }
    }

    return score / o.genome.length;
  },
  matingPool: (population, populationFitness, maxFitness) => {
    const matingPool: typeof population[number][] = [];

    for (let i = 0; i < population.length; i++) {
      const fitness = map(populationFitness[i], 0, maxFitness, 0, 1);
      const n = Math.floor(fitness * 100);

      for (let j = 0; j < n; j++) {
        const o = population[i];
        matingPool.push(o);
      }
    }

    return matingPool;
  },
  crossover: <G>(a: Organism<G>, b: Organism<G>) => {
    const midpoint = a.genome.length / 2;

    const genome = [...a.genome.slice(0, midpoint), ...b.genome.slice(midpoint)];

    const child: Organism<G> = {
      genome,
    };

    return child;
  },
  mutate: (child, mutationRate, gene) => {
    for (let i = 0; i < child.genome.length; i++) {
      if (Math.random() < mutationRate) {
        child.genome[i] = gene();
      }
    }
  },
  shouldFinish: ({ generation }) => {
    return generation >= 400;
  },
});

const s = stats(population, populationFitness)
console.log(s)
console.log(s.fittest.genome.join(""))

function randomChar() {
  const chars = 'abcdefghijklmnopqrstuvwxyz ';
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
}

function map(value, currentMin, currentMax, targetMin, targetMax) {
  // Calculate the proportion of the value relative to the current range
  let proportion = (value - currentMin) / (currentMax - currentMin);
  
  // Scale the proportion to fit within the target range
  let mappedValue = proportion * (targetMax - targetMin) + targetMin;
  
  return mappedValue;
}
