import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpolyeeDashboardComponent } from './empolyee-dashboard.component';

describe('EmpolyeeDashboardComponent', () => {
  let component: EmpolyeeDashboardComponent;
  let fixture: ComponentFixture<EmpolyeeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpolyeeDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpolyeeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
