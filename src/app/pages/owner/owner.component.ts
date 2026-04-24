import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { OwnerService } from '../../shared/services/owner.service';
import { OwnerFormInterface, OwnerInterface } from '../../shared/interface/owner.interface';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.html',
  styleUrl: './owner.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatNativeDateModule,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerComponent implements OnInit {
  public ownerForm: FormGroup;
  public error: string | null = null;
  public success: string | null = null;
  public list: Observable<OwnerInterface[]> = of();
  public selectedOwnerId: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly ownerService: OwnerService
  ) {
    this.ownerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      birthDate: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.refreshList();
  }

  submitForm(): void {
    this.error = null;
    this.success = null;

    if (this.ownerForm.invalid) {
      return;
    }

    let subscrition: Observable<OwnerInterface>;
    const owner: OwnerFormInterface = this.ownerForm.value;
    subscrition = this.selectedOwnerId ?
      this.ownerService.update(this.selectedOwnerId, owner) : this.ownerService.create(owner);
    subscrition.subscribe({
      next: () => { 
        this.success = 'Proprietário salvo com sucesso!';
        this.refreshList();
        this.resetForm();
      },
      error: (err) => this.error = err.message
    });
  }

  resetForm(): void {
    this.ownerForm.reset();
  }

  deleteItem(id: string): void {
    this.ownerService.delete(id).subscribe({
      next: () => {
        this.refreshList();
      }
    });
  }

  toggleUpdateId(form: OwnerInterface): void {
    if (form.id == this.selectedOwnerId) {
      this.selectedOwnerId = null;
      this.ownerForm.reset();
      return;
    }

    this.selectedOwnerId = form.id;
    this.ownerForm.patchValue({
      name: form.name,
      cpf: form.cpf,
      birthDate: form.birthDate,
    });
  }

  private refreshList(): void {
    this.list = this.ownerService.findAll();
  }
}
