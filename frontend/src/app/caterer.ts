export interface Caterer {
    id: number;
    caterer_name: string;
    canteen_item_name: string;
    valid_from: string; // Use string if backend sends date strings
    valid_to: string;   // Use string if backend sends date strings
  }
  