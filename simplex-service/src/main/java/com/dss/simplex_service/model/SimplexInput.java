package com.dss.simplex_service.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class SimplexInput {
    private double[] objectiveFunction;
    private double[][] constraints;
    private double[] rightHandSide;
    private String[] signs;

    @JsonProperty("isMaximization")
    private boolean maximization; // Cambiamos el nombre de la variable

    // Añadimos getters y setters explícitos para asegurarnos
    public boolean isMaximization() {
        return maximization;
    }

    public void setMaximization(boolean maximization) {
        this.maximization = maximization;
    }
}