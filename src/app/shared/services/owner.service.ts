import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { OwnerFormInterface, OwnerInterface, OwnerListInterface } from '../interface/owner.interface';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerService extends BaseService {
  protected override STORAGE_KEY = 'owners';

  findAll(): OwnerListInterface[] {
    return this.getStorage<OwnerInterface>().map(owner => {
      return {
        id: owner.id,
        name: owner.name,
        cpf: owner.cpf,
        birthDate: owner.birthDate
      } as OwnerListInterface;
    });
  }

  findById(id: string): OwnerListInterface | undefined {
    const owners = this.getStorage<OwnerInterface>();
    const owner = owners.find(o => o.id === id);
    if (!owner) { return; }

    return {
      id: owner.id,
      name: owner.name,
      cpf: owner.cpf,
      birthDate: owner.birthDate
    } as OwnerListInterface;
  }

  create(owner: OwnerFormInterface): Observable<OwnerInterface> {
    const owners = this.getStorage<OwnerInterface>();

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

  update(id: string, owner: OwnerFormInterface): Observable<OwnerInterface> {
    const owners = this.getStorage<OwnerInterface>();
    const index = owners.findIndex(o => o.id === id);

    if (index === -1) {
      return throwError(() => new Error('Proprietário não encontrado'));
    }

    const existingOwnerInterface = owners[index];
    const updatedOwnerInterface: OwnerInterface = {
      ...existingOwnerInterface,
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
    const owners = this.getStorage<OwnerInterface>();
    const index = owners.findIndex(o => o.id === id);

    if (index === -1) {
      return throwError(() => new Error('Proprietário não encontrado'));
    }

    owners.splice(index, 1);
    this.setStorage(owners);

    return of(undefined);
  }
}