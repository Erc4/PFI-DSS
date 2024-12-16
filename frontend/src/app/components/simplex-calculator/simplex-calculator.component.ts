import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimplexService } from '../../services/simplex.service';
import { SimplexInput, SimplexResult } from '../../models/simplex.interface';



@Component({
  selector: 'app-simplex-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simplex-calculator.component.html',
  styleUrl: './simplex-calculator.component.css'
})
export class SimplexCalculatorComponent {
  numVariables: number = 2;
  numConstraints: number = 2;
  isMaximization: boolean = true;
  objectiveFunction: number[] = Array(2).fill(0);
  constraints: number[][] = Array(2).fill(0).map(() => Array(2).fill(0));
  rightHandSide: number[] = Array(2).fill(0);
  signs: string[] = Array(2).fill('<=');
  result: SimplexResult | null = null;
  error: string = '';

  constructor(private simplexService: SimplexService) {}

  updateSize() {
    // Actualizar tamaño de la función objetivo
    this.objectiveFunction = Array(this.numVariables).fill(0);
    
    // Actualizar matriz de restricciones
    this.constraints = Array(this.numConstraints)
      .fill(0)
      .map(() => Array(this.numVariables).fill(0));
    
    // Actualizar lado derecho y signos
    this.rightHandSide = Array(this.numConstraints).fill(0);
    this.signs = Array(this.numConstraints).fill('<=');
  }

  solve() {
    const input: SimplexInput = {
      objectiveFunction: this.objectiveFunction,
      constraints: this.constraints,
      rightHandSide: this.rightHandSide,
      signs: this.signs,
      isMaximization: this.isMaximization
    };
    
    console.log('Enviando isMaximization:', this.isMaximization);
    
    this.simplexService.solveProblem(input).subscribe({
      next: (result) => {
        console.log('Resultado:', result);
        this.result = result;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
}