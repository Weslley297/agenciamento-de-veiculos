import { OwnerInterface, OwnerListInterface } from "./owner.interface";

export interface VehicleListInterface {
  id: string;
  plate: string;
  model: string;
  year: number;
  owner: OwnerListInterface | null;
}

export interface VehicleInterface {
  id: string;
  plate: string;
  model: string;
  year: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormInterface {
  plate: string;
  model: string;
  year: number;
  ownerId: string;
}
