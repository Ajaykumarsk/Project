import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeComponent } from './employee-type.component';

describe('EmployeeTypeComponent', () => {
  let component: EmployeeTypeComponent;
  let fixture: ComponentFixture<EmployeeTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
