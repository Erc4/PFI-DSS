import numpy as np
from models import *

class SAWService:
    def normalize_matrix(self, matrix: np.ndarray, criteria_types: List[bool]) -> np.ndarray:
        """
        Normaliza la matriz de decisión usando normalización lineal.
        Para criterios de beneficio: x/max(x)
        Para criterios de costo: min(x)/x
        """
        normalized = np.zeros_like(matrix, dtype=float)
        
        for j in range(matrix.shape[1]):
            column = matrix[:, j]
            if criteria_types[j]:  # Si es criterio de costo
                if np.min(column) == 0:
                    normalized[:, j] = 1 - (column / np.max(column))
                else:
                    normalized[:, j] = np.min(column) / column
            else:  # Si es criterio de beneficio
                if np.max(column) == 0:
                    normalized[:, j] = 0
                else:
                    normalized[:, j] = column / np.max(column)
                    
        return normalized

    def calculate_weighted_scores(self, 
                                normalized_matrix: np.ndarray, 
                                weights: np.ndarray) -> np.ndarray:
        """
        Calcula los puntajes ponderados multiplicando la matriz normalizada
        por los pesos de los criterios
        """
        return np.dot(normalized_matrix, weights)

    def evaluate_alternatives(self, input_data: SAWInput) -> SAWResult:
        # Extraer los datos de entrada
        weights = np.array([c.weight for c in input_data.criteria])
        criteria_types = [c.is_cost for c in input_data.criteria]
        
        # Normalizar pesos
        weights = weights / np.sum(weights)
        
        # Crear matriz de decisión
        decision_matrix = np.array([alt.values for alt in input_data.alternatives])
        
        # Normalizar matriz
        normalized_matrix = self.normalize_matrix(decision_matrix, criteria_types)
        
        # Calcular puntajes
        scores = self.calculate_weighted_scores(normalized_matrix, weights)
        
        # Crear ranking
        rankings = []
        sorted_indices = np.argsort(scores)[::-1]  # Ordenar de mayor a menor
        
        for rank, idx in enumerate(sorted_indices, 1):
            rankings.append(AlternativeResult(
                name=input_data.alternatives[idx].name,
                score=float(scores[idx]),
                rank=rank
            ))
        
        return SAWResult(
            rankings=rankings,
            best_alternative=rankings[0].name,
            weights_used=weights.tolist()
        )
