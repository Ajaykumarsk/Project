import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenfoodorderComponent } from './canteenfoodorder.component';

describe('CanteenfoodorderComponent', () => {
  let component: CanteenfoodorderComponent;
  let fixture: ComponentFixture<CanteenfoodorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanteenfoodorderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanteenfoodorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
