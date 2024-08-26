export interface CanteenFoodRate {
  id: number;
  caterer_name: number; // Assuming this is an ID
  canteen_item_name: string;
  valid_from: string;
  valid_to: string;
  employer_contribution: number;
  employee_contribution: number;
  caterer_price: number;
  employee_type: number; // Assuming this is an ID
}
