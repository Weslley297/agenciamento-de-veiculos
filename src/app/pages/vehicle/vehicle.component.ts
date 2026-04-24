import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { VehicleFormInterface, VehicleInterface } from '../../shared/interface/vehicle.interface';
import { Observable, of } from 'rxjs';
import { VehicleService } from '../../shared/services/vehicle.service';
import { OwnerService } from '../../shared/services/owner.service';
import { OwnerInterface } from '../../shared/interface/owner.interface';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.html',
  styleUrl: './vehicle.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    FormsModule,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleComponent implements OnInit {
  public vehicleForm: FormGroup;
  public error: string | null = null;
  public success: string | null = null;
  public list: Observable<VehicleInterface[]> = of();
  public ownerList: Observable<OwnerInterface[]> = of();
  public selectedVehicleId: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly vehicleService: VehicleService,
    private readonly ownerService: OwnerService
  ) {
    this.vehicleForm = this.fb.group({
      plate: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-\d{4}$|^[A-Z0-9]{7}$/)]],
      model: ['', [Validators.required]],
      year: ['', [Validators.required]],
      ownerId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.refreshList();
    this.ownerList = this.ownerService.findAll();
  }

  submitForm(): void {
    this.error = null;
    this.success = null;

    if (this.vehicleForm.invalid) {
      return;
    }
    const vehicle: VehicleFormInterface = this.vehicleForm.value;
    this.vehicleService.create(vehicle).subscribe({
      next: () => {
        this.success = 'Veículo salvo com sucesso!';
        this.refreshList();
        this.resetForm();
      },
      error: (err) => this.error = err.message
    });
  }

  resetForm(): void {
    this.vehicleForm.reset();
  }

  deleteItem(id: string): void {
    this.vehicleService.delete(id).subscribe({
      next: () => {
        this.refreshList();
      }
    });
  }

  toggleUpdateId(form: VehicleInterface): void {
    if (form.id == this.selectedVehicleId) {
      this.selectedVehicleId = null;
      this.vehicleForm.reset();
      return;
    }

    this.selectedVehicleId = form.id;
    this.vehicleForm.patchValue({
      plate: form.plate,
      model: form.model,
      year: form.year,
      owner: form.ownerId
    });
  }

  private refreshList(): void {
    this.list = this.vehicleService.findAll();
  }
}
