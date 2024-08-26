import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCanteenfoodrateComponent } from './update-canteenfoodrate.component';

describe('UpdateCanteenfoodrateComponent', () => {
  let component: UpdateCanteenfoodrateComponent;
  let fixture: ComponentFixture<UpdateCanteenfoodrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateCanteenfoodrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCanteenfoodrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
