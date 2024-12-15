import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SAWInput, SAWResult } from '../models/saw.interface';

@Injectable({
  providedIn: 'root'
})
export class SawService {
  private apiUrl = 'http://localhost:8082/api/saw';

  constructor(private http: HttpClient) { }

  evaluateAlternatives(input: SAWInput): Observable<SAWResult> {
    return this.http.post<SAWResult>(`${this.apiUrl}/evaluate`, input);
  }
}