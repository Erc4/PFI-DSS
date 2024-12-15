# models.py
from pydantic import BaseModel
from typing import List, Optional

class Criteria(BaseModel):
    name: str
    weight: float
    is_cost: bool  # True si es criterio de costo, False si es beneficio

class Alternative(BaseModel):
    name: str
    values: List[float]

class SAWInput(BaseModel):
    criteria: List[Criteria]
    alternatives: List[Alternative]

class AlternativeResult(BaseModel):
    name: str
    score: float
    rank: int

class SAWResult(BaseModel):
    rankings: List[AlternativeResult]
    best_alternative: str
    weights_used: List[float]