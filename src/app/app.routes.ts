import { Routes } from '@angular/router';

import { LoginComponent } from './componentes/login/login.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { CadastroVeiculoComponent } from './componentes/cadastro/cadastro.component';
import { HistoricoComponent } from './componentes/historico/historico.component'; 


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cadastro', component: CadastroVeiculoComponent },
  { path: 'historico', component: HistoricoComponent },
  { path: '**', redirectTo: 'login' },


];
