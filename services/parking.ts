import { BookingHistory, ParkingSpot } from '@/types/parking';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import * as geofire from 'geofire-common';
import { firestore } from './firebase';

const SPOTS_COLLECTION = 'parking_spots';
const BOOKINGS_COLLECTION = 'bookings';

export const getAllParkingSpots = async (
  latitude: number,
  longitude: number
): Promise<ParkingSpot[]> => {
  try {
    const center: [number, number] = [latitude, longitude];
    const radiusInM = 5000;

    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const spotPromises = bounds.map((b) => {
      const q = query(
        collection(firestore, SPOTS_COLLECTION),
        where('geohash', '>=', b[0]),
        where('geohash', '<=', b[1])
      );
      return getDocs(q);
    });

    const snapshots = await Promise.all(spotPromises);
    const matchingDocs: ParkingSpot[] = [];

    for (const snap of snapshots) {
      for (const d of snap.docs) {
        const spotData = d.data();
        const distanceInKm = geofire.distanceBetween(
          [spotData.coordinates.latitude, spotData.coordinates.longitude],
          center
        );

        if (distanceInKm <= radiusInM / 1000) {
          matchingDocs.push({
            id: d.id,
            name: spotData.name,
            description: spotData.description ?? '',
            coordinates: spotData.coordinates,
            price: spotData.price ?? 0,
            priceUnit: spotData.priceUnit ?? 'hour',
            available: spotData.available,
            type: spotData.type ?? 'standard',
            amenities: spotData.amenities ?? [],
            images: spotData.images ?? [],
            rating: spotData.rating ?? 0,
            ratingCount: spotData.ratingCount ?? 0,
            distance: distanceInKm,
            estimatedTime: Math.round(distanceInKm * 3),
          } as ParkingSpot);
        }
      }
    }

    return matchingDocs;
  } catch (error) {
    console.error('Error getting parking spots:', error);
    throw error;
  }
};

export const getParkingSpotById = async (spotId: string): Promise<ParkingSpot | null> => {
  try {
    const spotRef = doc(firestore, SPOTS_COLLECTION, spotId);
    const spotDoc = await getDoc(spotRef);

    if (!spotDoc.exists()) {
      return null;
    }

    return {
      id: spotDoc.id,
      ...spotDoc.data()
    } as ParkingSpot;
  } catch (error) {
    console.error('Error getting parking spot:', error);
    throw error;
  }
};

export const getUserBookings = async (userId: string): Promise<BookingHistory[]> => {
  try {
    const bookingsQuery = query(
      collection(firestore, BOOKINGS_COLLECTION),
      where('userId', '==', userId),
      orderBy('startTime', 'desc')
    );

    const bookingsSnapshot = await getDocs(bookingsQuery);
    const bookings: BookingHistory[] = [];

    for (const d of bookingsSnapshot.docs) {
      const bookingData = d.data();
      const spot = await getParkingSpotById(bookingData.spotId);

      if (spot) {
        bookings.push({
          id: d.id,
          userId: bookingData.userId,
          spotId: bookingData.spotId,
          status: bookingData.status,
          startTime: bookingData.startTime.toDate(),
          endTime: bookingData.endTime?.toDate() || null,
          spot: spot,
          totalCost: bookingData.totalCost ?? 0,
          paymentMethod: bookingData.paymentMethod ?? 'unknown',
        } as BookingHistory);
      }
    }

    return bookings;
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
};

export const bookParkingSpot = async (
  userId: string,
  spotId: string
): Promise<BookingHistory> => {
  try {
    const spotRef = doc(firestore, SPOTS_COLLECTION, spotId);
    const spot = await getParkingSpotById(spotId);

    if (!spot || !spot.available) {
      throw new Error('Spot is not available');
    }

    await updateDoc(spotRef, { available: false });

    const bookingRef = await addDoc(collection(firestore, BOOKINGS_COLLECTION), {
      userId,
      spotId,
      startTime: new Date(),
      endTime: null,
      status: 'active',
      createdAt: new Date(),
    });

    return {
      id: bookingRef.id,
      userId,
      spotId,
      spot,
      startTime: new Date(),
      endTime: null,
      status: 'active'
    };
  } catch (error) {
    console.error('Error booking spot:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    const bookingRef = doc(firestore, BOOKINGS_COLLECTION, bookingId);
    const bookingDocSnap = await getDoc(bookingRef);

    if (!bookingDocSnap.exists()) {
      throw new Error('Booking not found');
    }

    const bookingData = bookingDocSnap.data();
    const spotRef = doc(firestore, SPOTS_COLLECTION, bookingData.spotId);

    await updateDoc(bookingRef, {
      status: 'cancelled',
      endTime: new Date(),
    });

    await updateDoc(spotRef, {
      available: true,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

export const addParkingSpot = async (spot: Omit<ParkingSpot, 'id' | 'distance' | 'estimatedTime'>): Promise<string> => {
  try {
    if (!spot.coordinates) {
      throw new Error('Coordinates are required to add a parking spot.');
    }

    const { latitude, longitude } = spot.coordinates;
    const geohash = geofire.geohashForLocation([latitude, longitude]);

    const docRef = await addDoc(collection(firestore, SPOTS_COLLECTION), {
      name: spot.name,
      description: spot.description ?? '',
      coordinates: {
        latitude,
        longitude,
      },
      geohash, // 🔥 Required for geospatial querying
      price: spot.price ?? 0,
      priceUnit: spot.priceUnit ?? 'hour',
      available: spot.available,
      type: spot.type ?? 'standard',
      amenities: spot.amenities ?? [],
      images: spot.images ?? [],
      rating: spot.rating ?? 0,
      ratingCount: spot.ratingCount ?? 0,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding parking spot:', error);
    throw error;
  }
};
