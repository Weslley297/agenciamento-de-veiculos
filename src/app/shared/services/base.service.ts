import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  protected STORAGE_KEY = '';

  protected getStorage<T>(): T[] {
    if (typeof window == 'undefined') {
      return [];
    }
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  protected setStorage<T>(vehicles: T[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(vehicles));
  }

  protected generateId(): string {
    return crypto.randomUUID();
  }
}