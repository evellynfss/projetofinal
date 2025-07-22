import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { VeiculosService } from '../../services/veiculos.service';
import { Veiculo } from '../../model/veiculos.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  veiculos: Veiculo[] = [];

  totalImprodutivos = 0;
  totalManutencao = 0;
  totalSinistro = 0;
  tempoMedio = 0;

  constructor(
    private veiculosService: VeiculosService,
    private router: Router
  ) {}
  
ngOnInit(): void {
  this.veiculosService.getCarros().subscribe({
    next: (lista: Veiculo[]) => {
      this.veiculos = lista;
      this.contarTotais();
    },
    error: (err: any) => {
      console.error('Erro ao carregar veículos', err);
    },
  });
}


  contarTotais(): void {
    this.totalImprodutivos = this.veiculos.length;
    this.totalManutencao = this.veiculos.filter(
      (v) => v.motivo === 'manutencao' || v.status === 'manutencao'
    ).length;
    this.totalSinistro = this.veiculos.filter(
      (v) => v.motivo === 'sinistro' || v.status === 'sinistro'
    ).length;

    const totalDias = this.veiculos.reduce(
      (soma, v) => soma + this.calcularDiasParado(v.dataEntrada),
      0
    );
    this.tempoMedio = this.veiculos.length
      ? Math.round(totalDias / this.veiculos.length)
      : 0;
  }

  calcularDiasParado(dataEntrada?: string): number {
    if (!dataEntrada) return 0;
    const entrada = new Date(dataEntrada);
    if (isNaN(entrada.getTime())) return 0;
    const hoje = new Date();
    const diff = hoje.getTime() - entrada.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  irParaVeiculos() {
    this.router.navigate(['/veiculos']);
  }
}
