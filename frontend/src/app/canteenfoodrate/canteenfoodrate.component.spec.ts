import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenfoodrateComponent } from './canteenfoodrate.component';

describe('CanteenfoodrateComponent', () => {
  let component: CanteenfoodrateComponent;
  let fixture: ComponentFixture<CanteenfoodrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanteenfoodrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanteenfoodrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
