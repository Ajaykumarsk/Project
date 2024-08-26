import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenfoodconsummtionComponent } from './canteenfoodconsummtion.component';

describe('CanteenfoodconsummtionComponent', () => {
  let component: CanteenfoodconsummtionComponent;
  let fixture: ComponentFixture<CanteenfoodconsummtionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanteenfoodconsummtionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanteenfoodconsummtionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
