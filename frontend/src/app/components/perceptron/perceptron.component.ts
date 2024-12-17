import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PerceptronService, TrainingData, PredictResponse } from '../../services/perceptron.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-perceptron',
  templateUrl: './perceptron.component.html',
  styleUrls: ['./perceptron.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class PerceptronComponent implements OnInit {
  featureNames: string[] = [];
  featureControls: FormControl[] = [];
  form: FormGroup;
  trainingStatus: string = '';
  prediction: number | null = null;

  constructor(private perceptronService: PerceptronService) {
    this.form = new FormGroup({});
  }

  ngOnInit() {
    this.featureNames = ['fixed acidity', 'volatile acidity', 'citric acid', 'residual sugar', 'chlorides', 'free sulfur dioxide', 'total sulfur dioxide', 'density', 'pH', 'sulphates', 'alcohol'];
    this.createFeatureControls();
  }

  createFeatureControls() {
    this.featureNames.forEach((_, index) => {
      const control = new FormControl(0);
      this.featureControls.push(control);
      this.form.addControl(`feature-${index}`, control);
    });
  }

  trainModel() {
    const trainingData: TrainingData[] = [
      {
        features: [7.4, 0.7, 0, 1.9, 0.076, 11, 34, 0.9978, 3.51, 0.56, 9.4],
        label: 0 // Baja calidad
      },
      {
        features: [7.8, 0.88, 0, 2.6, 0.098, 25, 67, 0.9968, 3.2, 0.68, 9.8], 
        label: 0 // Baja calidad
      },
      {
        features: [11.2, 0.28, 0.56, 1.9, 0.075, 17, 60, 0.998, 3.16, 0.58, 9.8],
        label: 1 // Alta calidad
      },
      {
        features: [7.3, 0.65, 0, 1.2, 0.065, 15, 21, 0.9946, 3.39, 0.47, 10],
        label: 1 // Alta calidad
      }
    ];

    this.perceptronService.trainModel({ data: trainingData }).subscribe({
      next: (response) => {
        this.trainingStatus = response.message;
      },
      error: (err) => {
        console.error('Error entrenando modelo', err);
        this.trainingStatus = 'Error al entrenar el modelo';
      }
    });
  }

  predict() {
    this.perceptronService.predict(this.getFeatureValues()).subscribe({
      next: (result) => {
        this.prediction = result.prediction;
      },
      error: (err) => {
        console.error('Error en predicción', err);
      }
    });
  }

  getFeatureValues(): number[] {
    return this.featureControls.map(control => control.value);
  }
}