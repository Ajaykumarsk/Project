import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmployeetypeComponent } from './update-employeetype.component';

describe('UpdateEmployeetypeComponent', () => {
  let component: UpdateEmployeetypeComponent;
  let fixture: ComponentFixture<UpdateEmployeetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateEmployeetypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEmployeetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
