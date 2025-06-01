export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ParkingSpot {
  id: string;
  name: string;
  description?: string;
  coordinates?: Coordinates;
  geohash?: string;
  price?: number;
  priceUnit?: string;
  available: boolean;
  distance?: number; // in kilometers
  estimatedTime?: number; // in minutes
  type?: 'standard' | 'handicapped' | 'electric' | 'compact' | 'underground' | 'open-air' | 'covered' | 'shaded' | 'multi-level';
  amenities?: string[];
  images?: string[];
  rating?: number;
  ratingCount?: number;
}

export interface BookingHistory {
  id: string;
  userId: string;
  spotId: string;
  spot: ParkingSpot;
  startTime: Date;
  endTime: Date | null;
  status: 'active' | 'completed' | 'cancelled';
  totalCost?: number;
  paymentMethod?: string;
}