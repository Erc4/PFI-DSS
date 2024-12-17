import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TrainingData {
  features: number[];
  label: number;
}

export interface TrainingRequest {
  data: TrainingData[];
}

export interface PredictResponse {
  prediction: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerceptronService {
  private apiUrl = 'http://localhost:5000/api/Perceptron';

  constructor(private http: HttpClient) {}

  trainModel(request: TrainingRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/train`, request);
  }

  predict(features: number[]): Observable<PredictResponse> {
    return this.http.post<PredictResponse>(`${this.apiUrl}/predict`, { features });
  }
}