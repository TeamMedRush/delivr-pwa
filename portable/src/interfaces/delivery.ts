export interface Delivery {
  ride_uuid: string;
  invoice_number: string;
  ride_status: "pending" | "in_progress" | "completed" | "cancelled" | null;
  requested_at: number | null;
  start_location: string | null;
  start_coordinates: string | null;
  picked_up_at: number | null;
  end_location: string | null;
  end_coordinates: string | null;
  dropped_at: number | null;
  cancelled_at: number | null;
}

