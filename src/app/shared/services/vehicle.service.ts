import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VehicleFormInterface, VehicleInterface } from '../interface/vehicle.interface';

@Injectable({
  providedIn: 'root'
})
export class VehicleInterfaceService {
  private readonly STORAGE_KEY = 'vehicles';

  private getStorage(): VehicleInterface[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private setStorage(vehicles: VehicleInterface[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(vehicles));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  findAll(): Observable<VehicleInterface[]> {
    const vehicles = this.getStorage();
    return of(vehicles);
  }

  findById(id: string): Observable<VehicleInterface | undefined> {
    const vehicles = this.getStorage();
    const vehicle = vehicles.find(v => v.id === id);
    return of(vehicle);
  }

  findByOwnerId(ownerId: string): Observable<VehicleInterface[]> {
    const vehicles = this.getStorage();
    const ownerVehicleInterfaces = vehicles.filter(v => v.ownerId === ownerId);
    return of(ownerVehicleInterfaces);
  }

  create(vehicle:VehicleFormInterface): Observable<VehicleInterface> {
    const vehicles = this.getStorage();
    const now = new Date().toISOString();

    const newVehicleInterface: VehicleInterface = {
      ...vehicle,
      id: this.generateId(),
      plate: vehicle.plate,
      year: vehicle.year || new Date().getFullYear(),
      model: vehicle.model.trim(),
      ownerId: vehicle.ownerId,
      createdAt: now,
      updatedAt: now
    };

    vehicles.push(newVehicleInterface);
    this.setStorage(vehicles);

    return of(newVehicleInterface);
  }

  update(id: string, vehicle: VehicleFormInterface): Observable<VehicleInterface> {
    const vehicles = this.getStorage();
    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {
      return throwError(() => new Error('Veículo não encontrado'));
    }

    const existingVehicleInterface = vehicles[index];
    const updatedVehicleInterface: VehicleInterface = {
      ...existingVehicleInterface,
      ...vehicle,
      id: existingVehicleInterface.id,
      plate: vehicle.plate ? vehicle.plate : existingVehicleInterface.plate,
      model: vehicle.model?.trim() || existingVehicleInterface.model,
      year: vehicle.year || existingVehicleInterface.year,
      createdAt: existingVehicleInterface.createdAt,
      updatedAt: new Date().toISOString()
    };

    vehicles[index] = updatedVehicleInterface;
    this.setStorage(vehicles);

    return of(updatedVehicleInterface);
  }

  delete(id: string): Observable<void> {
    const vehicles = this.getStorage();
    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {
      return throwError(() => new Error('Veículo não encontrado'));
    }

    vehicles.splice(index, 1);
    this.setStorage(vehicles);

    return of(undefined);
  }
}