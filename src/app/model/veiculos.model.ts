  import { Injectable } from '@angular/core';
  import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface Veiculo {
  id?: string;
  placa: string;
  gr: string;
  modelo: string;
  ano: string;
  km: number | string;
  motivo: string;
  fornecedor: string;
  imagem: string;
  descricao: string;
  marca: string;
  cor: string;
  combustivel: string;
  dataEntrada?: string;
  dataInativacao: string;
  dataReativacao?: string;
  previsaoRetorno: string;
  prioridade: string;
  telefoneFornecedor: string;
  observacoes: string;
  status?: string; 
  
}


  @Injectable({
    providedIn: 'root'
  })
  export class VeiculosService {
    private collectionName = 'veiculos';

    constructor(private firestore: AngularFirestore) {}

    addCarro(carro: any) {
      return this.firestore.collection(this.collectionName).add(carro);
    }

    getCarros() {
      return this.firestore.collection(this.collectionName).valueChanges({ idField: 'id' });
    }

    deleteCarro(id: string) {
      return this.firestore.collection(this.collectionName).doc(id).delete();
    }
  }
