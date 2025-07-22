  import { Injectable } from '@angular/core';
  import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface Veiculo {
  id?: string;             // ID do documento no Firestore
  placa: string;           // Placa do veículo
  modelo: string;          // Modelo do veículo
  status?: string;         // Status (Ativo/Inativo)
  motivo?: string;         // Motivo da inatividade
  fornecedor?: string;     // Fornecedor ou empresa responsável
  dataEntrada?: string;    // Data de entrada no sistema
  km?: number;             // Quilometragem
  gr?: string;             // GR (campo adicional usado no seu projeto)
  marca?: string;          // Marca do veículo
  dataReativacao?: string; // Data da reativação (novo campo)
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
