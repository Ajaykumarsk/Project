import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularupdateComponent } from './circularupdate.component';

describe('CircularupdateComponent', () => {
  let component: CircularupdateComponent;
  let fixture: ComponentFixture<CircularupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircularupdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircularupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
