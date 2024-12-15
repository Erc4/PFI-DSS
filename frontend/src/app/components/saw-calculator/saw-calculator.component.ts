import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SawService } from '../../services/saw.service';
import { Criteria, Alternative, SAWResult } from '../../models/saw.interface';

@Component({
  selector: 'app-saw-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './saw-calculator.component.html',
  styleUrl: './saw-calculator.component.scss'
})

export class SawCalculatorComponent {
  criteria: Criteria[] = [{ name: '', weight: 0, is_cost: false }];
  alternatives: Alternative[] = [{ name: '', values: [0] }];
  result: SAWResult | null = null;
  errorMessage: string = '';

  constructor(private sawService: SawService) {}

  addCriteria() {
    this.criteria.push({ name: '', weight: 0, is_cost: false });
    this.alternatives.forEach(alt => alt.values.push(0));
  }

  removeCriteria(index: number) {
    this.criteria.splice(index, 1);
    this.alternatives.forEach(alt => alt.values.splice(index, 1));
  }

  addAlternative() {
    this.alternatives.push({
      name: '',
      values: new Array(this.criteria.length).fill(0)
    });
  }

  removeAlternative(index: number) {
    this.alternatives.splice(index, 1);
  }

  calculate() {
    if (!this.validateInput()) {
      return;
    }

    this.sawService.evaluateAlternatives({
      criteria: this.criteria,
      alternatives: this.alternatives
    }).subscribe({
      next: (result) => {
        this.result = result;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error al calcular: ' + error.message;
      }
    });
  }

  private validateInput(): boolean {
    if (!this.criteria.length || !this.alternatives.length) {
      this.errorMessage = 'Debe haber al menos un criterio y una alternativa';
      return false;
    }

    if (this.criteria.some(c => !c.name.trim())) {
      this.errorMessage = 'Todos los criterios deben tener nombre';
      return false;
    }

    if (this.alternatives.some(a => !a.name.trim())) {
      this.errorMessage = 'Todas las alternativas deben tener nombre';
      return false;
    }

    return true;
  }
}