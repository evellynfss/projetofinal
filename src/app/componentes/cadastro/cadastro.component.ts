import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeiculosService } from '../../services/veiculos.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroVeiculoComponent {

  veiculo = {
    placa: '',
    gr: '',
    modelo: '',
    ano: '',
    km: '',
    motivo: '',
    fornecedor: '',
    imagem: '',
    descricao: '',
    marca: '',
    cor: '',
    combustivel: '',
    dataInativacao: '',
    previsaoRetorno: '',
    prioridade: '',
    telefoneFornecedor: '',
    observacoes: ''
  };

  motivos = ['Manutenção', 'Sinistro', 'Documentação', 'Vendido', 'Sucata', 'Outros'];

  constructor(private veiculosService: VeiculosService, private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { veiculo?: any };

    if (state?.veiculo) {
      this.veiculo = {
        ...this.veiculo,
        ...state.veiculo
      };
    }
  }

  cadastrarVeiculo() {
  const novoVeiculo = {
    ...this.veiculo,
    km: Number(this.veiculo.km),
    dataEntrada: new Date().toISOString(),
    status: this.veiculo.motivo
  };

  this.veiculosService.addCarro(novoVeiculo)
    .then(() => {
      alert('Veículo cadastrado com sucesso!');
      this.limparFormulario(); 
    })
    .catch(err => {
      console.error('Erro ao cadastrar veículo:', err);
      alert('Erro ao cadastrar veículo, tente novamente.');
    });
}

  limparFormulario() {
    this.veiculo = {
      placa: '',
      gr: '',
      modelo: '',
      ano: '',
      km: '',
      motivo: '',
      fornecedor: '',
      imagem: '',
      descricao: '',
      marca: '',
      cor: '',
      combustivel: '',
      dataInativacao: '',
      previsaoRetorno: '',
      prioridade: '',
      telefoneFornecedor: '',
      observacoes: ''
    };
  }

  irParaVeiculos() {
    this.router.navigate(['/veiculos']);
  }

  irParaHistorico() {
    this.router.navigate(['/historico']);
  }

  irParaDashboard() {
    this.router.navigate(['/dashboard']);
  }

  validarPlaca(placa: string): boolean {
    const regexPlaca = /^[A-Z]{3}-?\d{1}[A-Z\d]{1}\d{2}$/;
    return regexPlaca.test(placa.toUpperCase());
  }

  formatarTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length <= 11) {
      valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      if (valor.length < 14) {
        valor = valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
    }

    this.veiculo.telefoneFornecedor = valor;
  }
}
