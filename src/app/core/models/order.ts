export interface Order {
  custom_order: boolean;
  customer: string; // customer id
  order_id: string;
  order_items: string[]; // array of order item ids
  price: number;
  pickup_date?: string;
  status: 'needs approval' | 'pending' | 'in_progress' | 'completed' | 'received' | 'cancelled';
}
