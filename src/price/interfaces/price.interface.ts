// Define the interface for the hourly price response
export interface HourlyPrice {
  hour: Date; // Represents the hour timestamp
  avg_price: string; // Average price, returned as a string from the database
}
