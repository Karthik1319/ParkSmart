/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  return parseFloat(distance.toFixed(3)); // Increased precision
};

/**
 * Calculate driving distance estimate (more realistic than straight-line distance)
 * This applies a factor to account for roads and actual driving routes
 * @param straightLineDistance Distance in kilometers (straight line)
 * @returns Estimated driving distance in kilometers
 */
export const calculateDrivingDistance = (straightLineDistance: number): number => {
  // Apply a factor of 1.3-1.5 to account for roads, traffic, and actual routes
  // This is a common approximation used in mapping applications
  const drivingFactor = 1.4;
  return parseFloat((straightLineDistance * drivingFactor).toFixed(3));
};

/**
 * Calculate estimated driving time based on distance
 * @param distance Distance in kilometers
 * @param averageSpeed Average speed in km/h (default: 30 km/h for city driving)
 * @returns Estimated time in minutes
 */
export const calculateEstimatedTime = (distance: number, averageSpeed: number = 30): number => {
  const timeInHours = distance / averageSpeed;
  const timeInMinutes = Math.round(timeInHours * 60);
  return Math.max(timeInMinutes, 1); // Minimum 1 minute
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number | undefined): string => {
  if (distance === undefined) return 'Unknown';
  
  if (distance < 1) {
    // Convert to meters if less than 1 km
    const meters = Math.round(distance * 1000);
    return `${meters} m`;
  }
  
  return `${distance.toFixed(1)} km`;
};

/**
 * Format time for display
 * @param minutes Time in minutes
 * @returns Formatted time string
 */
export const formatTime = (minutes: number | undefined): string => {
  if (minutes === undefined) return 'Unknown';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${remainingMinutes} min`;
};

/**
 * Calculate parking cost based on duration and hourly rate
 * @param startTime Start time of parking
 * @param endTime End time of parking (optional, defaults to current time)
 * @param hourlyRate Rate per hour
 * @returns Object with duration info and total cost
 */
export const calculateParkingCost = (
  startTime: Date,
  endTime: Date = new Date(),
  hourlyRate: number
) => {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  
  // Round up to nearest 15 minutes for billing
  const billingHours = Math.ceil(durationHours * 4) / 4;
  
  const totalCost = billingHours * hourlyRate;
  
  const hours = Math.floor(durationHours);
  const minutes = Math.round((durationHours - hours) * 60);
  
  return {
    durationHours: parseFloat(durationHours.toFixed(2)),
    billingHours: parseFloat(billingHours.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    formattedDuration: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
    formattedBillingDuration: billingHours < 1 
      ? `${Math.round(billingHours * 60)}m` 
      : `${billingHours.toFixed(2)}h`
  };
};