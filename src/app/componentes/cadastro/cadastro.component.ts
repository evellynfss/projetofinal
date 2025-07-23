import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeiculosService } from '../../services/veiculos.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

import { Veiculo } from '../../model/veiculos.model';  

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroVeiculoComponent implements OnInit {

  veiculo: Veiculo = {
    
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

  modoEdicao = false;

  constructor(private veiculosService: VeiculosService, private router: Router) {}


ngOnInit(): void {
  const veiculoJson = localStorage.getItem('veiculoParaEditar');
  if (veiculoJson) {
    this.modoEdicao = true;
    this.veiculo = JSON.parse(veiculoJson);
    localStorage.removeItem('veiculoParaEditar');
  }
}


  cadastrarVeiculo() {
    const veiculoFormatado: Veiculo = {
      ...this.veiculo,
      km: Number(this.veiculo.km),
      status: this.veiculo.motivo,
      dataEntrada: this.modoEdicao ? this.veiculo.dataEntrada ?? new Date().toISOString() : new Date().toISOString()
    };

    if (this.modoEdicao && this.veiculo.id) {
      this.veiculosService.updateCarro(this.veiculo.id, veiculoFormatado)
        .then(() => {
          this.router.navigate(['/historico']);
        })
        .catch(err => {
          console.error('Erro ao atualizar veículo:', err);

        });
    } else {
      this.veiculosService.addCarro(veiculoFormatado)
        .then(() => {

          this.limparFormulario();
        })
        .catch(err => {
          console.error('Erro ao cadastrar veículo:', err);

        });
    }
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
    this.modoEdicao = false;
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
