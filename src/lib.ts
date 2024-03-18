import { CalculatePopulationFitnessOptions, CreateMatingPoolOptions, CreatePopulationOptions, EvolutionStats, EvolveOptions, GeneFn, Genome, MateOptions, Organism, Population, PopulationFitness } from "./types";

export function createPopulation<G>(
  n: number,
  options: CreatePopulationOptions<G>,
) {
  const pop: Population<G> = [];

  for (let i = 0; i < n; i++) {
    pop.push(options.organism(i));
  }

  return pop;
}

export function createGenome<G>(
  length: number,
  gene: GeneFn<G>,
): Genome<G> {
  return Array.from({ length }).map(() => gene());
}

export function calculatePopulationFitness<G>(
  population: Population<G>,
  options: CalculatePopulationFitnessOptions<G>,
) {
  const populationFitness: number[] = [];

  for (let i = 0; i < population.length; i++) {
    const o = population[i];
    populationFitness[i] = options.fitness(o);
  }

  return populationFitness;
}

export function createMatingPool<G>(
  population: Population<G>,
  populationFitness: PopulationFitness,
  options: CreateMatingPoolOptions<G>,
) {
  let maxFitness = 0;

  for (let i = 0; i < population.length; i++) {
    const fitness = populationFitness[i];

    if (fitness > maxFitness) {
      maxFitness = fitness;
    }
  }

  return options.matingPool(population, populationFitness, maxFitness);
}

export function mate<G>(
  population: Population<G>,
  matingPool: Organism<G>[],
  options: MateOptions<G>,
) {
  const newPop: Population<G> = [];

  for (let i = 0; i < population.length; i++) {
    const a = Math.floor(Math.random() * matingPool.length);
    const b = Math.floor(Math.random() * matingPool.length);

    const partnerA = matingPool[a];
    const partnerB = matingPool[b];
    let child = options.crossover(partnerA, partnerB);
    options.mutate(child, options.mutationRate, options.gene);

    newPop.push(child);
  }

  return newPop;
}

export function evolve<G>(options: EvolveOptions<G>) {
  const params = {
    populationSize: 100,
    mutationRate: 0.05,
    ...options,
  } satisfies EvolveOptions<G>;

  let generation = 0;

  let population = createPopulation(params.populationSize, {
    organism: () => ({
      genome: createGenome(options.genomeLength, options.gene),
    }),
  });
  let populationFitness = calculatePopulationFitness(population, {
    fitness: params.fitness,
  });

  options.onGeneratePopulation?.({ population, populationFitness, context: { generation } });

  while (!options.shouldFinish({ generation })) {
    populationFitness = calculatePopulationFitness(population, {
      fitness: params.fitness,
    });

    const matingPool = createMatingPool(population, populationFitness, {
      matingPool: params.matingPool,
    });

    const newGeneration = mate(population, matingPool, {
      crossover: params.crossover,
      mutate: params.mutate,
      mutationRate: params.mutationRate,
      gene: params.gene,
    })

    population = newGeneration;

    generation++;

    options.onGeneratePopulation?.({ population, populationFitness, context: { generation } });
  }

  return { population, populationFitness };
}

export function stats<G>(
  population: Population<G>,
  populationFitness: PopulationFitness,
): EvolutionStats<G> {
  const fittestIndex = populationFitness.indexOf(Math.max(...populationFitness));
  const fittest = population[fittestIndex];

  const totalFitness = populationFitness.reduce((acc, val) => acc + val, 0);
  const avgFitness = totalFitness / populationFitness.length;

  return {
    fittest,
    fittestIndex,
    avgFitness,
    totalFitness,
  };
}
