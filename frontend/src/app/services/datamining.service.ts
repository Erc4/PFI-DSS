import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DataPoint {
  features: number[];
  label: string;
}

export interface TrainRequest {
  data: DataPoint[];
  maxDepth?: number;
  minSamplesSplit?: number;
}

export interface DatasetInfo {
  total_samples: number;
  features: {
    names: string[];
    stats: {
      [key: string]: {
        mean: number;
        std: number;
        min: number;
        max: number;
      }
    }
  };
  target: {
    name: string;
    unique_values: number[];
    distribution: {
      [key: string]: number;
    }
  };
}

export interface PredictRequest {
  features: number[];
}

export interface PredictResponse {
  prediction: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataminingService {
  private apiUrl = 'http://localhost:8084/api/datamining';

  constructor(private http: HttpClient) {}

  getDatasetInfo(): Observable<DatasetInfo> {
    return this.http.get<DatasetInfo>(`${this.apiUrl}/dataset-info`);
  }

  trainModel(request: TrainRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/train`, request);
  }

  predict(features: number[]): Observable<PredictResponse> {
    return this.http.post<PredictResponse>(`${this.apiUrl}/predict`, { features });
  }
}