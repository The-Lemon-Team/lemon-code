import { Routes } from '@angular/router';
import { CodeLabComponent } from './components/code-lab/code-lab.component';

export const routes: Routes = [
  {
    path: '',
    component: CodeLabComponent,
    title: 'Lemon Code | Developer Task Laboratory',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
