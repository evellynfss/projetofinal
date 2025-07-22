import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VeiculosService } from '../../services/veiculos.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

interface Veiculo {
  id?: string;
  placa: string;
  gr?: string;
  modelo: string;
  marca?: string;
  km: number;
  status: string;
  motivo?: string;
  fornecedor?: string;
  dataEntrada: string;
  dataReativacao?: string; // <-- Adicionado aqui
  [key: string]: any;
}

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {
  veiculos: Veiculo[] = [];
  veiculosFiltrados: Veiculo[] = [];
  
  filtroAtivo: string = 'todos';
  termoBusca: string = '';
  
  carregando: boolean = true;

  constructor(
    private veiculosService: VeiculosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarVeiculos();
  }

  carregarVeiculos() {
    this.carregando = true;
    
    this.veiculosService.getCarros().subscribe({
      next: (data: any[]) => {
        this.veiculos = data.map(item => ({
          id: item.id,
          placa: item.placa || '',
          gr: item.gr || '',
          modelo: item.modelo || '',
          marca: item.marca || '',
          km: Number(item.km) || 0,
          status: item.status || item.motivo || 'Inativo',
          motivo: item.motivo || '',
          fornecedor: item.fornecedor || '',
          dataEntrada: item.dataEntrada || item.createdAt || new Date().toISOString(),
          dataReativacao: item.dataReativacao || '', // <-- Mantendo campo se existir
          ...item
        }));
        
        this.aplicarFiltros();
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar veículos:', error);
        this.carregando = false;
      }
    });
  }

  filtrarPor(status: string) {
    this.filtroAtivo = status;
    this.aplicarFiltros();
  }

  buscarVeiculos() {
    this.aplicarFiltros();
  }

  private aplicarFiltros() {
    let resultado = [...this.veiculos];

    if (this.filtroAtivo !== 'todos') {
      resultado = resultado.filter(v => 
        v.status === this.filtroAtivo || v.motivo === this.filtroAtivo
      );
    }

    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase().trim();
      resultado = resultado.filter(v =>
        v.placa.toLowerCase().includes(termo) ||
        v.modelo.toLowerCase().includes(termo) ||
        (v.marca && v.marca.toLowerCase().includes(termo))
      );
    }

    this.veiculosFiltrados = resultado;
  }

  async reativarVeiculo(veiculo: Veiculo) {
    if (confirm(`Deseja reativar o veículo ${veiculo.placa}?`)) {
      try {
        await this.veiculosService.updateCarro(veiculo.id!, {
          status: 'Ativo',
          dataReativacao: new Date().toISOString() // <-- Agora sem erro
        });
        
        alert('Veículo reativado com sucesso!');
        this.carregarVeiculos();
      } catch (error) {
        console.error('Erro ao reativar veículo:', error);
        alert('Erro ao reativar veículo');
      }
    }
  }

editarVeiculo(veiculo: Veiculo) {
  this.router.navigate(['/cadastro'], {
    state: { veiculo }
  });
}


  async removerVeiculo(veiculo: Veiculo) {
    if (confirm(`Tem certeza que deseja remover o veículo ${veiculo.placa}?`)) {
      try {
        await this.veiculosService.deleteCarro(veiculo.id!);
        alert('Veículo removido com sucesso!');
        this.carregarVeiculos();
      } catch (error) {
        console.error('Erro ao remover veículo:', error);
        alert('Erro ao remover veículo');
      }
    }
  }

  irParaDashboard() {
    this.router.navigate(['/dashboard']);
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }

  irParaHistorico() {
    this.router.navigate(['/historico']);
  }

  formatarData(dataString: string): string {
    if (!dataString) return 'N/A';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  }

  calcularDias(dataString: string): number {
    if (!dataString) return 0;
    
    const dataEntrada = new Date(dataString);
    const hoje = new Date();
    const diferenca = hoje.getTime() - dataEntrada.getTime();
    
    return Math.floor(diferenca / (1000 * 60 * 60 * 24));
  }

  contarPorStatus(status: string): number {
    return this.veiculos.filter(v => 
      v.status === status || v.motivo === status
    ).length;
  }

  calcularMediaDias(): number {
    if (this.veiculos.length === 0) return 0;
    
    const totalDias = this.veiculos.reduce((total, v) => {
      return total + this.calcularDias(v.dataEntrada);
    }, 0);
    
    return Math.round(totalDias / this.veiculos.length);
  }

  trackByPlaca(index: number, veiculo: Veiculo): string {
    return veiculo.placa;
  }

  recarregar() {
    this.carregarVeiculos();
  }

  exportarDados() {
    const dados = this.veiculosFiltrados.map(v => ({
      Placa: v.placa,
      GR: v.gr || 'N/A',
      Modelo: v.modelo,
      Marca: v.marca || 'N/A',
      KM: v.km,
      Status: v.status,
      Fornecedor: v.fornecedor || 'N/A',
      'Data Entrada': this.formatarData(v.dataEntrada),
      'Dias Inativo': this.calcularDias(v.dataEntrada)
    }));

    console.table(dados);
    alert('Dados exportados para o console (F12)');
  }
}
