import { Component, OnInit } from '@angular/core';
import { DataminingService, DataPoint, DatasetInfo } from '../../services/datamining.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datamining',
  templateUrl: './datamining.component.html',
  styleUrls: ['./datamining.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class DataminingComponent implements OnInit {
  datasetInfo: DatasetInfo | null = null;
  featureNames: string[] = [];
  features: number[] = [];
  prediction: string | null = null;
  trainingStatus: string = '';
  predictionStatus: string = '';

  constructor(private dataminingService: DataminingService) {}

  ngOnInit() {
    this.loadDatasetInfo();
  }

  loadDatasetInfo() {
    this.dataminingService.getDatasetInfo().subscribe({
      next: (info) => {
        this.datasetInfo = info;
        this.featureNames = info.features.names;
        this.features = new Array(this.featureNames.length).fill(0);
      },
      error: (err) => {
        console.error('Error obteniendo info del dataset', err);
        this.trainingStatus = 'Error al cargar información del dataset';
      }
    });
  }

  trainModel() {
    const trainingData: DataPoint[] = [
      // Calidad 3 (muy baja)
      {
        features: [5.0, 1.02, 0.04, 1.4, 0.045, 41, 85, 0.9938, 3.75, 0.48, 10.5],
        label: "3"
      },
      {
        features: [4.7, 0.6, 0.17, 2.3, 0.058, 17, 106, 0.9932, 3.85, 0.6, 12.9],
        label: "3"
      },
      
      // Calidad 4 (baja)
      {
        features: [7.4, 1.185, 0, 4.25, 0.097, 5, 14, 0.9966, 3.63, 0.54, 10.7],
        label: "4"
      },
      {
        features: [6.9, 1.09, 0.06, 2.1, 0.061, 12, 31, 0.9948, 3.51, 0.43, 11.4],
        label: "4"
      },
      
      // Calidad 5 (media-baja)
      {
        features: [7.4, 0.7, 0, 1.9, 0.076, 11, 34, 0.9978, 3.51, 0.56, 9.4],
        label: "5"
      },
      {
        features: [7.8, 0.88, 0, 2.6, 0.098, 25, 67, 0.9968, 3.2, 0.68, 9.8],
        label: "5"
      },
      {
        features: [7.5, 0.5, 0.36, 6.1, 0.071, 17, 102, 0.9978, 3.35, 0.8, 10.5],
        label: "5"
      },
      
      // Calidad 6 (media)
      {
        features: [8.1, 0.38, 0.28, 2.1, 0.066, 13, 30, 0.9968, 3.23, 0.73, 9.7],
        label: "6"
      },
      {
        features: [6.8, 0.4, 0.14, 2.4, 0.085, 21, 40, 0.9968, 3.43, 0.63, 9.7],
        label: "6"
      },
      {
        features: [7.6, 0.49, 0.26, 1.6, 0.236, 10, 88, 0.9968, 3.11, 0.8, 9.3],
        label: "6"
      },
      
      // Calidad 7 (media-alta)
      {
        features: [9.6, 0.42, 0.35, 2.1, 0.083, 17, 38, 0.9962, 3.23, 0.66, 11.1],
        label: "7"
      },
      {
        features: [8.0, 0.4, 0.17, 2.0, 0.073, 6, 18, 0.9972, 3.29, 0.61, 9.2],
        label: "7"
      },
      {
        features: [5.2, 0.48, 0.04, 1.6, 0.054, 19, 106, 0.9927, 3.54, 0.62, 12.2],
        label: "7"
      },
      
      // Calidad 8 (alta)
      {
        features: [7.9, 0.35, 0.46, 3.6, 0.078, 15, 37, 0.9973, 3.35, 0.86, 12.8],
        label: "8"
      },
      {
        features: [12.8, 0.3, 0.74, 2.6, 0.095, 9, 28, 0.9994, 3.2, 0.77, 10.8],
        label: "8"
      }
    ];
  
    this.dataminingService.trainModel({ 
      data: trainingData, 
      maxDepth: 5 
    }).subscribe({
      next: () => {
        this.trainingStatus = 'Modelo entrenado con 16 muestras representativas';
      },
      error: (err) => {
        console.error('Error entrenando modelo', err);
        this.trainingStatus = 'Error al entrenar el modelo';
      }
    });
  }

  predict() {
    this.dataminingService.predict(this.features).subscribe({
      next: (result) => {
        this.prediction = `Calidad del Vino: ${result.prediction}`;
        this.predictionStatus = 'Predicción realizada con éxito';
      },
      error: (err) => {
        console.error('Error en predicción', err);
        this.predictionStatus = 'Error al realizar la predicción';
      }
    });
  }
}