import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Veiculo } from '../model/veiculos.model';

@Injectable({ providedIn: 'root' })
export class VeiculosService {
  private readonly collectionName = 'veiculos';

  constructor(private firestore: Firestore) {}

  private veiculosCol() {
    return collection(this.firestore, this.collectionName);
  }

  getCarros(): Observable<Veiculo[]> {
    return collectionData(this.veiculosCol(), { idField: 'id' }) as Observable<Veiculo[]>;
  }

  getHistorico(): Observable<Veiculo[]> {
    const q = query(this.veiculosCol(), where('status', '==', 'Inativo'));
    return collectionData(q, { idField: 'id' }) as Observable<Veiculo[]>;
  }

  addCarro(data: Partial<Veiculo>): Promise<DocumentReference> {
    return addDoc(this.veiculosCol(), data);
  }

  updateCarro(id: string, data: Partial<Veiculo>): Promise<void> {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(ref, data);
  }

  deleteCarro(id: string): Promise<void> {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(ref);
  }
}
