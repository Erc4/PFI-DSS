import { Routes } from '@angular/router';
import { SawCalculatorComponent } from './components/saw-calculator/saw-calculator.component';

export const routes: Routes = [
  { path: 'saw', component: SawCalculatorComponent },
  { path: '', redirectTo: '/saw', pathMatch: 'full' }
];