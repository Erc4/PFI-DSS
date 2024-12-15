export interface Criteria {
    name: string;
    weight: number;
    is_cost: boolean;
  }
  
  export interface Alternative {
    name: string;
    values: number[];
  }
  
  export interface SAWInput {
    criteria: Criteria[];
    alternatives: Alternative[];
  }
  
  export interface AlternativeResult {
    name: string;
    score: number;
    rank: number;
  }
  
  export interface SAWResult {
    rankings: AlternativeResult[];
    best_alternative: string;
    weights_used: number[];
  }