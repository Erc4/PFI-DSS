import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimplexInput, SimplexResult } from '../models/simplex.interface';

@Injectable({
  providedIn: 'root'
})
export class SimplexService {
  private apiUrl = 'http://localhost:8083/api/simplex';

  constructor(private http: HttpClient) { }

  solveProblem(input: SimplexInput): Observable<SimplexResult> {
    return this.http.post<SimplexResult>(`${this.apiUrl}/solve`, input);
  }
}