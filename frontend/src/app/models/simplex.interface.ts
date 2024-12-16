export interface SimplexInput {
  objectiveFunction: number[];
  constraints: number[][];
  rightHandSide: number[];
  signs: string[];
  isMaximization: boolean;
}

export interface SimplexResult {
  solution: number[];
  objectiveValue: number;
  status: string;
  iterations: number;
  variables: string[];
}
