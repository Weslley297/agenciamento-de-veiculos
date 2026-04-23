import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwnerComponent } from './owner.component';

describe('Owner', () => {
  let component: OwnerComponent;
  let fixture: ComponentFixture<OwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
