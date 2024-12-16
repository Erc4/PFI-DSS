import { Routes } from '@angular/router';
import { SawCalculatorComponent } from './components/saw-calculator/saw-calculator.component';
import { SimplexCalculatorComponent } from './components/simplex-calculator/simplex-calculator.component';
import { DataminingComponent } from './components/datamining/datamining.component';


export const routes: Routes = [
  { path: 'saw', component: SawCalculatorComponent },
  { path: 'simplex', component: SimplexCalculatorComponent },
  { path: 'datamining', component: DataminingComponent },
  { path: '', redirectTo: '/saw', pathMatch: 'full' }
];