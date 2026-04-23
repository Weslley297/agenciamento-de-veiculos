import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { OwnerFormInterface, OwnerInterface } from '../interface/owner.interface';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private readonly STORAGE_KEY = 'owners';

  private getStorage(): OwnerInterface[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private setStorage(owners: OwnerInterface[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(owners));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  findAll(): Observable<OwnerInterface[]> {
    const owners = this.getStorage();
    return of(owners);
  }

  findByCPF(cpf: string): Observable<OwnerInterface | undefined> {
    const owners = this.getStorage();
    const owner = owners.find(o => o.cpf === cpf);
    return of(owner);
  }

  create(owner: OwnerFormInterface): Observable<OwnerInterface> {
    const owners = this.getStorage();
    if (owners.some(o => o.cpf === owner.cpf)){
      return this.update(owner);
    }

    const now = new Date().toISOString();
    const newOwnerInterface: OwnerInterface = {
      ...owner,
      id: this.generateId(),
      name: owner.name.trim(),
      cpf: owner.cpf,
      birthDate: owner.birthDate,
      createdAt: now,
      updatedAt: now
    };

    owners.push(newOwnerInterface);
    this.setStorage(owners);

    return of(newOwnerInterface);
  }

  update(owner: OwnerFormInterface): Observable<OwnerInterface> {
    const owners = this.getStorage();
    const index = owners.findIndex(o => o.cpf === owner.cpf);

    if (index === -1) {
      return throwError(() => new Error('Proprietário não encontrado'));
    }

    const existingOwnerInterface = owners[index];
    const updatedOwnerInterface: OwnerInterface = {
      ...existingOwnerInterface,
      ...owner,
      cpf: owner.cpf || existingOwnerInterface.cpf,
      name: owner.name?.trim() || existingOwnerInterface.name,
      birthDate: owner.birthDate ?? existingOwnerInterface.birthDate,
      createdAt: existingOwnerInterface.createdAt,
      updatedAt: new Date().toISOString()
    };

    owners[index] = updatedOwnerInterface;
    this.setStorage(owners);

    return of(updatedOwnerInterface);
  }

  delete(id: string): Observable<void> {
    const owners = this.getStorage();
    const index = owners.findIndex(o => o.id === id);

    if (index === -1) {
      return throwError(() => new Error('Proprietário não encontrado'));
    }

    owners.splice(index, 1);
    this.setStorage(owners);

    return of(undefined);
  }
}