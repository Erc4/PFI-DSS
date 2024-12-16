package com.dss.simplex_service.service;

import java.util.Arrays;

import org.springframework.stereotype.Service;
import com.dss.simplex_service.model.*;

@Service
public class SimplexService {

    public SimplexResult solve(SimplexInput input) {
        System.out.println("=== INICIO DE SOLVE ===");
        System.out.println("Función objetivo: " + Arrays.toString(input.getObjectiveFunction()));
        System.out.println("Restricciones: " + Arrays.deepToString(input.getConstraints()));
        System.out.println("Lado derecho: " + Arrays.toString(input.getRightHandSide()));
        System.out.println("Signos: " + Arrays.toString(input.getSigns()));
        System.out.println("Es maximización: " + input.isMaximization());

        // Convertir el problema a la forma estándar
        double[][] tableau = createTableau(input);

        System.out.println("\nTableau inicial:");
        printTableau(tableau);

        return solveSimplex(tableau, input.isMaximization());
    }

    private double[][] createTableau(SimplexInput input) {
        int m = input.getConstraints().length; // número de restricciones
        int n = input.getObjectiveFunction().length; // número de variables

        // Tableau size: (m+1) x (n+m+1)
        double[][] tableau = new double[m + 1][n + m + 1];

        // Función objetivo (fila 0)
        for (int j = 0; j < n; j++) {
            tableau[0][j] = input.isMaximization() ? -input.getObjectiveFunction()[j] : input.getObjectiveFunction()[j];
        }

        // Restricciones
        for (int i = 0; i < m; i++) {
            // Coeficientes de las variables originales
            for (int j = 0; j < n; j++) {
                tableau[i + 1][j] = input.getConstraints()[i][j];
            }
            // Variable de holgura
            tableau[i + 1][n + i] = 1.0;
            // Término independiente
            tableau[i + 1][n + m] = input.getRightHandSide()[i];
        }

        return tableau;
    }

    private SimplexResult solveSimplex(double[][] tableau, boolean isMaximization) {
        SimplexResult result = new SimplexResult(); // Solo declaramos result una vez
        int iterations = 0;

        // Continuamos mientras existan coeficientes negativos en la función objetivo
        while (iterations < 100) {
            System.out.println("\nIteración: " + iterations);

            // Verificar si es óptimo
            boolean isOptimal = true;
            for (int j = 0; j < tableau[0].length - 1; j++) {
                if (tableau[0][j] < -1e-10) {
                    isOptimal = false;
                    break;
                }
            }

            if (isOptimal) {
                System.out.println("Solución óptima encontrada!");
                break;
            }

            // Encontrar columna pivote
            int pivotCol = -1;
            double minValue = -1e-10;
            for (int j = 0; j < tableau[0].length - 1; j++) {
                if (tableau[0][j] < minValue) {
                    minValue = tableau[0][j];
                    pivotCol = j;
                }
            }

            if (pivotCol == -1) {
                System.out.println("No se encontró columna pivote");
                break;
            }

            System.out.println("Columna pivote seleccionada: " + pivotCol);

            // Encontrar fila pivote
            int pivotRow = -1;
            double minRatio = Double.POSITIVE_INFINITY;
            for (int i = 1; i < tableau.length; i++) {
                if (tableau[i][pivotCol] > 1e-10) {
                    double ratio = tableau[i][tableau[0].length - 1] / tableau[i][pivotCol];
                    if (ratio < minRatio && ratio >= 0) {
                        minRatio = ratio;
                        pivotRow = i;
                    }
                }
            }

            if (pivotRow == -1) {
                result.setStatus("Problema no acotado");
                return result;
            }

            System.out.println("Fila pivote seleccionada: " + pivotRow);

            // Operación de pivote
            double pivotElement = tableau[pivotRow][pivotCol];

            // Normalizar la fila pivote
            for (int j = 0; j < tableau[0].length; j++) {
                tableau[pivotRow][j] /= pivotElement;
            }

            // Actualizar las otras filas
            for (int i = 0; i < tableau.length; i++) {
                if (i != pivotRow) {
                    double factor = tableau[i][pivotCol];
                    for (int j = 0; j < tableau[0].length; j++) {
                        tableau[i][j] -= factor * tableau[pivotRow][j];
                    }
                }
            }

            System.out.println("Tableau después de pivote:");
            printTableau(tableau);

            iterations++;
        }

        System.out.println("\nTableau Final:");
        printTableau(tableau);

        result.setStatus("Optimal");
        result.setIterations(iterations);

        // Calcular el número de variables originales (sin variables de holgura)
        int numVars = tableau[0].length - tableau.length; // Esto da el número correcto de variables originales
        double[] solution = new double[numVars];

        // Extraer valores para cada variable original
        for (int j = 0; j < numVars; j++) {
            // Buscar si la columna j corresponde a una variable básica
            for (int i = 1; i < tableau.length; i++) {
                if (Math.abs(tableau[i][j] - 1.0) < 1e-10) {
                    boolean isBasic = true;
                    for (int k = 1; k < tableau.length; k++) {
                        if (k != i && Math.abs(tableau[k][j]) > 1e-10) {
                            isBasic = false;
                            break;
                        }
                    }
                    if (isBasic) {
                        solution[j] = tableau[i][tableau[0].length - 1];
                        System.out.println("Variable x" + (j + 1) + " es básica en fila " + i);
                        break;
                    }
                }
            }
        }

        // Calcular el valor objetivo usando los coeficientes originales
        double objValue = 0;
        for (int j = 0; j < numVars; j++) {
            objValue += solution[j] * (isMaximization ? tableau[0][j] : -tableau[0][j]);
        }

        result.setSolution(solution);
        result.setObjectiveValue(Math.abs(tableau[0][tableau[0].length - 1]));

        System.out.println("\nSolución encontrada:");
        for (int i = 0; i < numVars; i++) {
            System.out.println("x" + (i + 1) + " = " + solution[i]);
        }
        System.out.println("Valor objetivo = " + result.getObjectiveValue());

        return result;
    }

    private boolean isOptimal(double[][] tableau) {
        for (int j = 0; j < tableau[0].length - 1; j++) {
            if (tableau[0][j] < -1e-10)
                return false;
        }
        return true;
    }

    private int findPivotColumn(double[][] tableau) {
        int col = 0;
        double minValue = tableau[0][0];

        for (int j = 1; j < tableau[0].length - 1; j++) {
            if (tableau[0][j] < minValue) {
                minValue = tableau[0][j];
                col = j;
            }
        }

        return minValue < -1e-10 ? col : -1;
    }

    private int findPivotRow(double[][] tableau, int pivotCol) {
        int row = -1;
        double minRatio = Double.POSITIVE_INFINITY;

        for (int i = 1; i < tableau.length; i++) {
            if (tableau[i][pivotCol] > 1e-10) {
                double ratio = tableau[i][tableau[0].length - 1] / tableau[i][pivotCol];
                if (ratio >= 0 && ratio < minRatio) {
                    minRatio = ratio;
                    row = i;
                }
            }
        }

        return row;
    }

    private void pivot(double[][] tableau, int pivotRow, int pivotCol) {
        // Normalizar la fila pivote
        double pivotValue = tableau[pivotRow][pivotCol];
        for (int j = 0; j < tableau[0].length; j++) {
            tableau[pivotRow][j] /= pivotValue;
        }

        // Actualizar las otras filas
        for (int i = 0; i < tableau.length; i++) {
            if (i != pivotRow) {
                double factor = tableau[i][pivotCol];
                for (int j = 0; j < tableau[0].length; j++) {
                    tableau[i][j] -= factor * tableau[pivotRow][j];
                }
            }
        }
    }

    private double findBasicVariable(double[][] tableau, int col) {
        int basicRow = -1;

        for (int i = 1; i < tableau.length; i++) {
            if (Math.abs(tableau[i][col] - 1.0) < 1e-10) {
                boolean isBasic = true;
                for (int k = 1; k < tableau.length; k++) {
                    if (k != i && Math.abs(tableau[k][col]) > 1e-10) {
                        isBasic = false;
                        break;
                    }
                }
                if (isBasic) {
                    basicRow = i;
                    break;
                }
            }
        }

        if (basicRow != -1) {
            return tableau[basicRow][tableau[0].length - 1];
        }
        return 0.0;
    }

    private void printTableau(double[][] tableau) {
        System.out.println("Dimensiones del tableau: " + tableau.length + "x" + tableau[0].length);
        for (int i = 0; i < tableau.length; i++) {
            if (i == 0)
                System.out.println("Función objetivo:");
            else
                System.out.println("Restricción " + i + ":");
            System.out.println(Arrays.toString(tableau[i]));
        }
    }
}