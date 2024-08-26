import { Component, OnInit, ViewChild } from '@angular/core';
import { CatererMenu, FoodMenuDetail } from '../caterermenu';
import { Circular } from '../circular'; 
import { CatererMenuService } from '../caterermenu.service';
import { CircularService } from '../circular.service';
import { Carousel } from 'primeng/carousel';

@Component({
  selector: 'app-food-menu',
  templateUrl: './foodmenu.component.html',
  styleUrls: ['./foodmenu.component.scss']
})
export class FoodmenuComponent implements OnInit {
  foodMenus: CatererMenu[] = [];
  filteredMenus: CatererMenu[] = [];
  circulars: Circular[] = [];
  responsiveOptions: any[] = [];
  mealType: string = '';
  mealTime: string = '';
  totalCalories: number = 0;

  @ViewChild('circularCarousel') circularCarousel!: Carousel;
  videoPlaying: boolean = false; // Flag to track video playback status

  constructor(
    private catererMenuService: CatererMenuService,
    private circularService: CircularService
  ) {}

  ngOnInit(): void {
    this.getFoodMenus();
    this.getCirculars();
    this.setMealInfo();
    
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  getFoodMenus(): void {
    this.catererMenuService.getCatererMenus().subscribe((menus: CatererMenu[]) => {
      this.foodMenus = menus;
      this.filterMenusByDate();
      this.calculateTotalCalories();
    });
  }

  getCirculars(): void {
    this.circularService.getCirculars().subscribe((circulars: Circular[]) => {
      this.circulars = circulars;
    });
  }

  filterMenusByDate(): void {
    const currentDate = new Date().toISOString().split('T')[0];
    this.filteredMenus = this.foodMenus.filter(menu => {
      const validFromDate = new Date(menu.valid_from).toISOString().split('T')[0];
      const dateMatch = validFromDate === currentDate;
      const timeMatch = menu.food_menu_details?.some(detail => detail.name === this.mealType);

      return dateMatch && timeMatch;
    });
  }

  calculateTotalCalories(): void {
    this.totalCalories = this.filteredMenus.reduce((total, menu) => {
      if (menu.food_menu_details) {
        return total + menu.food_menu_details.reduce((menuTotal: number, detail: FoodMenuDetail) => menuTotal + (detail.calorie || 0), 0);
      }
      return total;
    }, 0);
  }

  setMealInfo(): void {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 6 && hours < 12) {
      this.mealType = 'Breakfast';
      this.mealTime = '06:00 to 12:00';
    } else if (hours >= 12 && hours < 14) {
      this.mealType = 'Lunch';
      this.mealTime = '12:00 to 14:00';
    } else if (hours >= 14 && hours < 18) {
      this.mealType = 'Snacks';
      this.mealTime = '14:00 to 18:00';
    } else if (hours >= 18 && hours < 22) {
      this.mealType = 'Dinner';
      this.mealTime = '18:00 to 22:00';
    } else {
      this.mealType = 'Mid-night Snacks';
      this.mealTime = '22:00 to 06:00';
    }

    this.filterMenusByDate();
  }

  // Helper methods to identify media type
  isImage(media: string): boolean {
    return media.endsWith('.jpg') || media.endsWith('.jpeg') || media.endsWith('.png') || media.endsWith('.gif');
  }

  isVideo(media: string): boolean {
    return media.endsWith('.mp4') || media.endsWith('.avi') || media.endsWith('.mov');
  }

  // Event handlers for video playback
  onVideoPlay(carousel: Carousel): void {
    this.videoPlaying = true; // Set the flag when the video is playing
    carousel.autoplayInterval = 0; // Pause the carousel autoplay
  }

  onVideoEnd(carousel: Carousel): void {
    this.videoPlaying = false; // Reset the flag when the video ends
    carousel.autoplayInterval = 3000; // Resume the carousel autoplay
  }
}
