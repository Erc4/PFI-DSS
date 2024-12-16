package com.dss.simplex_service.model;

import lombok.Data;

@Data
public class SimplexResult {
    private double[] solution; // Valores de las variables
    private double objectiveValue; // Valor de la función objetivo
    private String status; // Estado de la solución
    private int iterations; // Número de iteraciones
}