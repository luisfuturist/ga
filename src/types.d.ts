export type Gene<G = any> = G;
export type Genome<G> = Gene<G>[];
export type Organism<G> = {
  genome: Genome<G>
};

export type Population<G> = Organism<G>[];

export type OrganismFn<G> = (i: number) => Organism<G>;
export type GeneFn<G> = () => Gene<G>;

export type CrossoverFn<G> = (a: Organism<G>, b: Organism<G>) => Organism<G>;
export type MutationFn<G> = (child: Organism<G>, mutationRate: number, gene: GeneFn<G>) => void;
export type FitnessFn<G> = (o: Organism<G>) => number;
export type MatingPoolFn<G> = (population: Population<G>, populationFitness: PopulationFitness, maxFitness: number) => Population<G>;

export type PopulationFitness = number[];

export type EvolutionStats<G> = {
  fittest: Organism<G>
  fittestIndex: number
  avgFitness: number
  totalFitness: number
};

export type GenerationEvent<G> = {
  context: ProblemContext<G>
  population: Population<G>
  populationFitness: PopulationFitness
};

export type ProblemContext<G> = { generation: number };

export type CreatePopulationOptions<G> = {
  organism: OrganismFn<G>
};

export type CreateMatingPoolOptions<G> = {
  matingPool: MatingPoolFn<G>
};

export type CalculatePopulationFitnessOptions<G> = {
  fitness: FitnessFn<G>
};

export type MateOptions<G> = {
  mutationRate: number
  crossover: CrossoverFn<G>
  mutate: MutationFn<G>
  gene: GeneFn<G>
};

type EvolveOptions<G> = {
  populationSize?: number
  genomeLength: number
  gene: GeneFn<G>
  matingPool: MatingPoolFn<G>
  crossover: CrossoverFn<G>
  mutationRate?: number
  mutate: MutationFn<G>
  fitness: FitnessFn<G>

  shouldFinish: (c: ProblemContext<G>) => boolean

  onGeneratePopulation?: (e: GenerationEvent<G>) => void
};
