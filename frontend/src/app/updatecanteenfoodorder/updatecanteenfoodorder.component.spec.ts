import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecanteenfoodorderComponent } from './updatecanteenfoodorder.component';

describe('UpdatecanteenfoodorderComponent', () => {
  let component: UpdatecanteenfoodorderComponent;
  let fixture: ComponentFixture<UpdatecanteenfoodorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatecanteenfoodorderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatecanteenfoodorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
