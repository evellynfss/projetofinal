import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Veiculo } from '../model/veiculos.model';

@Injectable({
  providedIn: 'root'
})
export class VeiculosService {
  private collectionName = 'veiculos';

  constructor(private firestore: AngularFirestore) {}

  getVeiculos() {
    return this.firestore.collection<Veiculo>(this.collectionName).valueChanges({ idField: 'id' });
  }

  addCarro(veiculo: Veiculo) {
    return this.firestore.collection<Veiculo>(this.collectionName).add(veiculo);
  }

  updateCarro(id: string, veiculo: Partial<Veiculo>) {
    return this.firestore.collection<Veiculo>(this.collectionName).doc(id).update(veiculo);
  }

  deleteCarro(id: string) {
    return this.firestore.collection<Veiculo>(this.collectionName).doc(id).delete();
  }
}
