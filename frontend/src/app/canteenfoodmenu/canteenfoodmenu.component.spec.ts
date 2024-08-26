import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenfoodmenuComponent } from './canteenfoodmenu.component';

describe('CanteenfoodmenuComponent', () => {
  let component: CanteenfoodmenuComponent;
  let fixture: ComponentFixture<CanteenfoodmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanteenfoodmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanteenfoodmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
