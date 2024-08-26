// caterermenu.ts
export interface FoodMenuDetail {
  id: number;
  name: string;
  menu: string;
  quantity: string;
  calorie: number;
  item_photo: string;
}

export interface CatererMenu {
  id: number;
  caterer_name: number;
  food_menu: number[];
  food_menu_details?: FoodMenuDetail[]; // Ensure this is typed as an array of FoodMenuDetail
  valid_from: string;
}
