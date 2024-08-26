import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChairmanverifyComponent } from './chairmanverify.component';

describe('ChairmanverifyComponent', () => {
  let component: ChairmanverifyComponent;
  let fixture: ComponentFixture<ChairmanverifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChairmanverifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChairmanverifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
