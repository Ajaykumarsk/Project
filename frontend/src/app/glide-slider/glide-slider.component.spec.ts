import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlideSliderComponent } from './glide-slider.component';

describe('GlideSliderComponent', () => {
  let component: GlideSliderComponent;
  let fixture: ComponentFixture<GlideSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlideSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlideSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
