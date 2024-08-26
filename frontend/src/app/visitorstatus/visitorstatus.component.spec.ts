import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorstatusComponent } from './visitorstatus.component';

describe('VisitorstatusComponent', () => {
  let component: VisitorstatusComponent;
  let fixture: ComponentFixture<VisitorstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisitorstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
