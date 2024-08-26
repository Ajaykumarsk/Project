import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecanteenfoodconsummtionComponent } from './updatecanteenfoodconsummtion.component';

describe('UpdatecanteenfoodconsummtionComponent', () => {
  let component: UpdatecanteenfoodconsummtionComponent;
  let fixture: ComponentFixture<UpdatecanteenfoodconsummtionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatecanteenfoodconsummtionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatecanteenfoodconsummtionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
