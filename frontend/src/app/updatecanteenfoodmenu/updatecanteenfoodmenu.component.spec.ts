import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecanteenfoodmenuComponent } from './updatecanteenfoodmenu.component';

describe('UpdatecanteenfoodmenuComponent', () => {
  let component: UpdatecanteenfoodmenuComponent;
  let fixture: ComponentFixture<UpdatecanteenfoodmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatecanteenfoodmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatecanteenfoodmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
