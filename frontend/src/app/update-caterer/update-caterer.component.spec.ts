import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCatererComponent } from './update-caterer.component';

describe('UpdateCatererComponent', () => {
  let component: UpdateCatererComponent;
  let fixture: ComponentFixture<UpdateCatererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateCatererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCatererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
