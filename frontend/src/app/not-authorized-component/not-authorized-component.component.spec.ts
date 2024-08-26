import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAuthorizedComponentComponent } from './not-authorized-component.component';

describe('NotAuthorizedComponentComponent', () => {
  let component: NotAuthorizedComponentComponent;
  let fixture: ComponentFixture<NotAuthorizedComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotAuthorizedComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotAuthorizedComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
