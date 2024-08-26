import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaterermenuComponent } from './caterermenu.component';

describe('CaterermenuComponent', () => {
  let component: CaterermenuComponent;
  let fixture: ComponentFixture<CaterermenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaterermenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaterermenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
