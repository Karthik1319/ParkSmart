import { bookParkingSpot, cancelBooking, finishParking, getAllParkingSpots, getUserBookings } from '@/services/parking';
import { BookingHistory, ParkingSpot } from '@/types/parking';
import * as Location from 'expo-location';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type ParkingContextType = {
  userLocation: Location.LocationObject | null;
  parkingSpots: ParkingSpot[];
  nearbySpots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  bookingHistory: BookingHistory[];
  loading: boolean;
  error: string | null;
  refreshParkingSpots: () => Promise<void>;
  selectParkingSpot: (spot: ParkingSpot | null) => void;
  findNearestAvailableSpot: () => ParkingSpot | null;
  bookSpot: (spotId: string) => Promise<boolean>;
  finishParking: (bookingId: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
};

const ParkingContext = createContext<ParkingContextType>({
  userLocation: null,
  parkingSpots: [],
  nearbySpots: [],
  selectedSpot: null,
  bookingHistory: [],
  loading: false,
  error: null,
  refreshParkingSpots: async () => {},
  selectParkingSpot: () => {},
  findNearestAvailableSpot: () => null,
  bookSpot: async () => false,
  finishParking: async () => false,
  cancelBooking: async () => false,
});

export const useParking = () => useContext(ParkingContext);

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [nearbySpots, setNearbySpots] = useState<ParkingSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request location permissions and get current location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation(location);
      } catch (err) {
        setError('Could not get current location');
        console.error(err);
      }
    })();
  }, []);

  // Set up location subscription
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    const startWatchingLocation = async () => {
      try {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 50, // Update every 50 meters
            timeInterval: 30000, // Update every 30 seconds
          },
          (location) => {
            setUserLocation(location);
          }
        );
      } catch (err) {
        console.error('Error watching location:', err);
      }
    };

    startWatchingLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Load parking spots and filter nearby ones when user location changes
  useEffect(() => {
    if (userLocation) {
      refreshParkingSpots();
    }
  }, [userLocation, user]);

  // Load user's booking history when user changes
  useEffect(() => {
    if (user) {
      loadBookingHistory();
    }
  }, [user]);

  const refreshParkingSpots = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    setError(null);
    try {
      const spots = await getAllParkingSpots(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );
      setParkingSpots(spots);
      
      // Filter spots within 10km
      const nearby = spots.filter(spot => spot.distance && spot.distance < 10);
      setNearbySpots(nearby);
    } catch (err) {
      console.error('Error fetching parking spots:', err);
      setError('Failed to load parking spots');
    } finally {
      setLoading(false);
    }
  };

  const loadBookingHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const bookings = await getUserBookings(user.id);
      setBookingHistory(bookings);
    } catch (err) {
      console.error('Error fetching booking history:', err);
      setError('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const selectParkingSpot = (spot: ParkingSpot | null) => {
    setSelectedSpot(spot);
  };

  const findNearestAvailableSpot = (): ParkingSpot | null => {
    if (nearbySpots.length === 0) return null;
    const sorted = nearbySpots
      .filter(spot => spot.available)
      .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    return sorted.length > 0 ? sorted[0] : null;
  };

  const bookSpot = async (spotId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setLoading(true);
      const booking = await bookParkingSpot(user.id, spotId);
      
      // Update local state
      setParkingSpots(prevSpots => 
        prevSpots.map(spot => 
          spot.id === spotId ? { ...spot, available: false } : spot
        )
      );
      
      setNearbySpots(prevSpots => 
        prevSpots.map(spot => 
          spot.id === spotId ? { ...spot, available: false } : spot
        )
      );
      
      setBookingHistory(prev => [booking, ...prev]);
      
      return true;
    } catch (err) {
      console.error('Error booking spot:', err);
      setError('Failed to book parking spot');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFinishParking = async (bookingId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setLoading(true);
      const completedBooking = await finishParking(bookingId);
      
      // Update booking status locally
      setBookingHistory(prev => 
        prev.map(b => 
          b.id === bookingId ? completedBooking : b
        )
      );
      
      // Make the spot available again
      setParkingSpots(spots => 
        spots.map(spot => 
          spot.id === completedBooking.spotId ? { ...spot, available: true } : spot
        )
      );
      
      setNearbySpots(spots => 
        spots.map(spot => 
          spot.id === completedBooking.spotId ? { ...spot, available: true } : spot
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error finishing parking:', err);
      setError('Failed to finish parking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setLoading(true);
      await cancelBooking(bookingId);
      
      // Update booking status locally
      setBookingHistory(prev => 
        prev.map(b => {
          if (b.id === bookingId) {
            // Make the spot available again
            setParkingSpots(spots => 
              spots.map(spot => 
                spot.id === b.spotId ? { ...spot, available: true } : spot
              )
            );
            
            setNearbySpots(spots => 
              spots.map(spot => 
                spot.id === b.spotId ? { ...spot, available: true } : spot
              )
            );
            
            return { 
              ...b, 
              status: 'cancelled', 
              endTime: new Date() 
            };
          }
          return b;
        })
      );
      
      return true;
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParkingContext.Provider 
      value={{
        userLocation,
        parkingSpots,
        nearbySpots,
        selectedSpot,
        bookingHistory,
        loading,
        error,
        refreshParkingSpots,
        selectParkingSpot,
        findNearestAvailableSpot,
        bookSpot,
        finishParking: handleFinishParking,
        cancelBooking: handleCancelBooking
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};