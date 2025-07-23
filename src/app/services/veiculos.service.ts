import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Veiculo } from '../model/veiculos.model'

@Injectable({
  providedIn: 'root'
})
export class VeiculosService {
  private readonly collectionName = 'veiculos';

  constructor(private firestore: Firestore) { }

  private veiculosCol() {
    return collection(this.firestore, this.collectionName);
  }

  getCarros(): Observable<Veiculo[]> {
    return collectionData(this.veiculosCol(), { idField: 'id' }) as Observable<Veiculo[]>;
  }

  addCarro(data: Partial<Veiculo>) {
    return addDoc(this.veiculosCol(), data);
  }

updateCarro(id: string, dados: any) {
  const docRef = doc(this.firestore, 'veiculos', id);
  return updateDoc(docRef, dados);
}

  deleteCarro(id: string) {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(ref);
  }
}
