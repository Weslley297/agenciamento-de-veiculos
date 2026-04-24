import { Injectable } from '@angular/core';
import { map, Observable, of, throwError } from 'rxjs';
import { VehicleFormInterface, VehicleInterface, VehicleListInterface } from '../interface/vehicle.interface';
import { BaseService } from './base.service';
import { OwnerService } from './owner.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends BaseService {
  protected override STORAGE_KEY = 'vehicles';

  constructor(private ownerService: OwnerService) {
    super();
  }

  findAll(): VehicleListInterface[] {
    const vehicles = this.getStorage<VehicleInterface>();
    return vehicles.map(vehicle => {
      return {
        id: vehicle.id,
        plate: vehicle.plate,
        model: vehicle.model,
        year: vehicle.year,
        owner: this.ownerService.findById(vehicle.ownerId)
      } as VehicleListInterface;
    });
  }

  findById(id: string): VehicleListInterface | undefined {
    const vehicles = this.getStorage<VehicleInterface>();
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) { return; }

    return {
      id: vehicle.id,
      plate: vehicle.plate,
      model: vehicle.model,
      year: vehicle.year,
      owner: this.ownerService.findById(vehicle.ownerId)
    } as VehicleListInterface;
  }

  findByOwnerId(ownerId: string): Observable<VehicleInterface[]> {
    const vehicles = this.getStorage<VehicleInterface>();
    const ownerVehicleInterfaces = vehicles.filter(v => v.ownerId === ownerId);
    return of(ownerVehicleInterfaces);
  }

  create(vehicle: VehicleFormInterface): Observable<VehicleInterface> {
    const vehicles = this.getStorage<VehicleInterface>();
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
    const vehicles = this.getStorage<VehicleInterface>();
    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {
      return throwError(() => new Error('Veículo não encontrado'));
    }

    const existingVehicleInterface = vehicles[index];
    const updatedVehicleInterface: VehicleInterface = {
      ...existingVehicleInterface,
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
    const vehicles = this.getStorage<VehicleInterface>();
    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {
      return throwError(() => new Error('Veículo não encontrado'));
    }

    vehicles.splice(index, 1);
    this.setStorage(vehicles);

    return of(undefined);
  }
}