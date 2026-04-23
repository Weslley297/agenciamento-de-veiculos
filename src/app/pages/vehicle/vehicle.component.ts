import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleFormInterface } from '../../shared/interface/vehicle.interface';

@Component({
  selector: 'app-vehicle',
  imports: [ReactiveFormsModule],
  templateUrl: './vehicle.html',
  styleUrl: './vehicle.scss',
})
export class VehicleComponent {
  public vehicleForm: any;

  constructor(
    private fb: FormBuilder
  ) {
    this.vehicleForm = this.fb.group({
      plate: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-\d{4}$|^[A-Z0-9]{7}$/)]],
      model: ['', [Validators.required]],
      year: ['', [Validators.required], Validators.min(1980)],
      owner: ['', [Validators.required]]
    });
  }
}
