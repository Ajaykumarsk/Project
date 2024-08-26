// glide-slider.component.ts
import { Component, AfterViewInit } from '@angular/core';
import Glide from '@glidejs/glide';

@Component({
  selector: 'app-glide-slider',
  templateUrl: './glide-slider.component.html',
  styleUrls: ['./glide-slider.component.scss'] // Use styleUrls for SCSS
})
export class GlideSliderComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    new Glide('.glide', {
      type: 'carousel',
      autoplay: 3000, // Change slide every 3 seconds
      hoverpause: true // Pause on hover
    }).mount();
  }
}
