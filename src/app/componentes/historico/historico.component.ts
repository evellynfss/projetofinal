import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VeiculosService } from '../../services/veiculos.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

/* ---------------- STATUS CÓDIGOS + RÓTULOS ---------------- */
type StatusCodigo =
  | 'reparo'
  | 'avarias'
  | 'desativacao'
  | 'avariaDesativacao'
  | 'manutencao'
  | 'ativo'
  | 'desconhecido';

const STATUS_LABEL: Record<StatusCodigo, string> = {
  reparo: 'Reparo Mecânico',
  avarias: 'Avarias',
  desativacao: 'Desativação',
  avariaDesativacao: 'Avaria-Desativação',
  manutencao: 'Manutenção',
  ativo: 'Ativo',
  desconhecido: 'Desconhecido',
};

/* remove acento, caixa, espaços */
function normalizarTexto(txt?: string): string {
  if (!txt) return '';
  return txt
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, ''); // remove acentos
}

/* converte qualquer valor cru (status/motivo antigo) em código */
function mapRawParaCodigo(raw?: string): StatusCodigo {
  const t = normalizarTexto(raw);
  if (!t) return 'desconhecido';

  // Ajuste/agrupamento de valores que já vi no teu projeto
  if (t.includes('reparo') || t.includes('mecan')) return 'reparo';
  if (t.includes('sinist') || t.includes('avari')) return 'avarias';
  if (t.includes('doc') || t.includes('desativ') || t === 'inativo') return 'desativacao';
  if (t.includes('avaria-desativ') || t.includes('vendido') || t.includes('sucata')) return 'avariaDesativacao';
  if (t.includes('manut')) return 'manutencao';
  if (t === 'ativo') return 'ativo';
  return 'desconhecido';
}

/* ---------------- MODELO ---------------- */
interface Veiculo {
  id?: string;
  placa: string;
  gr?: string;
  modelo: string;
  marca?: string;
  km: number;
  // derivados:
  statusCodigo: StatusCodigo;
  statusLabel: string;
  // raw
  statusRaw?: string;
  motivo?: string;
  fornecedor?: string;
  dataEntrada: string;
  dataReativacao?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css'],
})
export class HistoricoComponent implements OnInit {
  veiculos: Veiculo[] = [];
  veiculosFiltrados: Veiculo[] = [];

  filtroAtivo: 'todos' | StatusCodigo = 'todos';
  termoBusca = '';

  carregando = true;

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
        this.veiculos = data.map(item => {
          const rawStatus = item.status ?? item.motivo ?? '';
          const codigo = mapRawParaCodigo(rawStatus);
          return {
            id: item.id,
            placa: item.placa || '',
            gr: item.gr || '',
            modelo: item.modelo || '',
            marca: item.marca || '',
            km: Number(item.km) || 0,
            statusCodigo: codigo,
            statusLabel: STATUS_LABEL[codigo],
            statusRaw: rawStatus,
            motivo: item.motivo || '',
            fornecedor: item.fornecedor || '',
            dataEntrada: item.dataEntrada || item.createdAt || new Date().toISOString(),
            dataReativacao: item.dataReativacao || '',
            ...item,
          } as Veiculo;
        });

 
        console.table(
          this.veiculos.map(v => ({
            placa: v.placa,
            raw: v.statusRaw,
            cod: v.statusCodigo,
            label: v.statusLabel,
          }))
        );

        this.aplicarFiltros();
        this.carregando = false;
      },
      error: error => {
        console.error('Erro ao carregar veículos:', error);
        this.carregando = false;
      },
    });
  }


  filtrarPor(cod: 'todos' | StatusCodigo) {
    this.filtroAtivo = cod;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
  let resultado = [...this.veiculos];

 
  resultado = resultado.filter(v => v.statusCodigo !== 'ativo');

 
  if (this.filtroAtivo !== 'todos') {
    resultado = resultado.filter(v => v.statusCodigo === this.filtroAtivo);
  }


  if (this.termoBusca.trim()) {
    const termo = this.termoBusca.toLowerCase();
    resultado = resultado.filter(v =>
      v.placa.toLowerCase().includes(termo) ||
      v.modelo.toLowerCase().includes(termo) ||
      (v.marca && v.marca.toLowerCase().includes(termo))
    );
  }

  this.veiculosFiltrados = resultado;
}



  statusClass(cod: StatusCodigo): string {
    switch (cod) {
      case 'reparo': return 'status-reparo';
      case 'avarias': return 'status-avarias';
      case 'desativacao': return 'status-desativacao';
      case 'avariaDesativacao': return 'status-avaria-desativacao';
      case 'manutencao': return 'status-manutencao';
      case 'ativo': return 'status-ativo';
      default: return 'status-desconhecido';
    }
  }

editarVeiculo(veiculo: Veiculo) {
  localStorage.setItem('veiculoParaEditar', JSON.stringify(veiculo));
  this.router.navigate(['/cadastro']);
}

  async removerVeiculo(veiculo: Veiculo) {
    if (!veiculo.id) return;
    if (confirm(`Tem certeza que deseja remover o veículo ${veiculo.placa}?`)) {
      try {
        await this.veiculosService.deleteCarro(veiculo.id);

        this.carregarVeiculos();
      } catch (error) {
        console.error('Erro ao remover veículo:', error);
     
      }
    }
  }

  irParaDashboard() { this.router.navigate(['/dashboard']); }
  irParaCadastro() { this.router.navigate(['/cadastro']); }
  irParaHistorico() { this.router.navigate(['/historico']); }

  formatarData(dataString: string): string {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  calcularDias(dataString: string): number {
    if (!dataString) return 0;
    const dataEntrada = new Date(dataString);
    const hoje = new Date();
    const diferenca = hoje.getTime() - dataEntrada.getTime();
    return Math.floor(diferenca / (1000 * 60 * 60 * 24));
  }

  contarPorStatus(cod: StatusCodigo): number {
    return this.veiculos.filter(v => v.statusCodigo === cod).length;
  }

  calcularMediaDias(): number {
    if (this.veiculos.length === 0) return 0;
    const totalDias = this.veiculos.reduce((total, v) => total + this.calcularDias(v.dataEntrada), 0);
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
      Status: v.statusLabel,
      Fornecedor: v.fornecedor || 'N/A',
      'Data Entrada': this.formatarData(v.dataEntrada),
      'Dias Inativo': this.calcularDias(v.dataEntrada),
    }));
    console.table(dados);
  
  }
}
