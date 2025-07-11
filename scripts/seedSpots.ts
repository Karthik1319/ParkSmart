import { ParkingSpot } from '@/types/parking';
import { addParkingSpot } from '../services/parking';


// Sample data (add more entries as needed)
const mockSpots: Omit<ParkingSpot, 'id' | 'distance' | 'estimatedTime'>[] = [
  {
    name: 'IIT Guwahati South Gate Parking',
    description: 'Parking near IITG South Gate',
    coordinates: { latitude: 26.1825, longitude: 91.7035 },
    price: 1.5,
    priceUnit: 'hour',
    available: true,
    type: 'standard',
    amenities: ['security'],
    rating: 4.2,
    ratingCount: 32,
    images: [],
  },
  {
    name: 'IIT Guwahati Guest House Parking',
    description: 'Secure parking near guest house',
    coordinates: { latitude: 26.1870, longitude: 91.7070 },
    price: 2,
    priceUnit: 'hour',
    available: true,
    type: 'standard',
    amenities: ['security', 'covered'],
    rating: 4.6,
    ratingCount: 20,
    images: [],
  },
  {
    name: 'Brahmaputra Riverside Parking',
    description: 'Scenic spot by river bank',
    coordinates: { latitude: 26.1950, longitude: 91.7150 },
    price: 2.5,
    priceUnit: 'hour',
    available: true,
    type: 'standard',
    amenities: ['scenic'],
    rating: 4.7,
    ratingCount: 12,
    images: [],
  },
  {
    name: 'Guwahati Mall Parking',
    description: 'Parking near Guwahati Mall, city center',
    coordinates: { latitude: 26.1475, longitude: 91.7540 },
    price: 3,
    priceUnit: 'hour',
    available: true,
    type: 'standard',
    amenities: ['security', 'covered'],
    rating: 4.4,
    ratingCount: 50,
    images: [],
  },
  {
    name: 'Guwahati Railway Station Parking',
    description: 'Convenient parking near railway station',
    coordinates: { latitude: 26.1600, longitude: 91.7700 },
    price: 2.5,
    priceUnit: 'hour',
    available: true,
    type: 'standard',
    amenities: ['security'],
    rating: 4.0,
    ratingCount: 60,
    images: [],
  },
  {
    name: 'Fancy Cafe Parking',
    description: 'Small parking spot near Fancy Cafe',
    coordinates: { latitude: 26.1850, longitude: 91.7000 },
    price: 1.75,
    priceUnit: 'hour',
    available: true,
    type: 'standard',
    amenities: ['covered'],
    rating: 4.1,
    ratingCount: 15,
    images: [],
  },
  {
    name: 'Airport Parking Lot',
    description: 'Parking lot near Lokpriya Gopinath Bordoloi International Airport',
    coordinates: { latitude: 26.1060, longitude: 91.5850 },
    price: 4,
    priceUnit: 'hour',
    available: true,
    type: 'standard',
    amenities: ['security', 'shuttle'],
    rating: 4.3,
    ratingCount: 45,
    images: [],
  },
  {
    name: 'Kaziranga National Park Visitor Parking',
    description: 'Parking near Kaziranga National Park entrance (far away!)',
    coordinates: { latitude: 26.5775, longitude: 93.1700 },
    price: 5,
    priceUnit: 'hour',
    available: true,
    type: 'standard',
    amenities: ['security', 'scenic'],
    rating: 4.8,
    ratingCount: 22,
    images: [],
  },
  {
    name: 'Local Market Parking',
    description: 'Parking spot near local market in Guwahati',
    coordinates: { latitude: 26.1720, longitude: 91.7450 },
    price: 1.5,
    priceUnit: 'hour',
    available: true,
    type: 'standard',
    amenities: ['security'],
    rating: 3.9,
    ratingCount: 10,
    images: [],
  },
  {
    name: 'University Guest Parking',
    description: 'Parking near a nearby university',
    coordinates: { latitude: 26.3000, longitude: 91.7200 },
    price: 2.0,
    priceUnit: 'hour',
    available: true,
    type: 'standard',
    amenities: ['security', 'covered'],
    rating: 4.2,
    ratingCount: 18,
    images: [],
  },
  {
    name: 'Connaught Place Parking',
    description: 'Secure underground parking near Central Delhi market.',
    coordinates: { latitude: 28.6315, longitude: 77.2167 },
    price: 40,
    priceUnit: 'hour',
    available: true,
    type: 'underground',
    amenities: ['CCTV', 'Elevator', 'EV Charging'],
    images: [],
    rating: 4.6,
    ratingCount: 127,
  },
  {
    name: 'Bandra Kurla Complex Parking',
    description: 'Open-air parking in Mumbai’s business hub.',
    coordinates: { latitude: 19.0669, longitude: 72.8698 },
    price: 50,
    priceUnit: 'hour',
    available: true,
    type: 'open-air',
    amenities: ['CCTV', 'Lighting'],
    images: [],
    rating: 4.2,
    ratingCount: 95,
  },
  {
    name: 'MG Road Parking',
    description: 'Covered parking near Bangalore shopping area.',
    coordinates: { latitude: 12.9756, longitude: 77.6050 },
    price: 30,
    priceUnit: 'hour',
    available: false,
    type: 'covered',
    amenities: ['Security', 'Toilets'],
    images: [],
    rating: 4.0,
    ratingCount: 60,
  },
  {
    name: 'Charminar Parking',
    description: 'Historic spot parking with shaded areas.',
    coordinates: { latitude: 17.3616, longitude: 78.4747 },
    price: 20,
    priceUnit: 'hour',
    available: true,
    type: 'shaded',
    amenities: ['CCTV', 'Shaded'],
    images: [],
    rating: 3.9,
    ratingCount: 45,
  },
  {
    name: 'Chandni Chowk Parking',
    description: 'Busy market area with secure parking.',
    coordinates: { latitude: 28.6562, longitude: 77.2301 },
    price: 35,
    priceUnit: 'hour',
    available: true,
    type: 'multi-level',
    amenities: ['Security', 'Lighting'],
    images: [],
    rating: 4.1,
    ratingCount: 70,
  },
  {
    name: 'Gachibowli Tech Park Parking',
    description: 'Spacious parking near Hyderabad IT offices.',
    coordinates: { latitude: 17.4448, longitude: 78.3498 },
    price: 25,
    priceUnit: 'hour',
    available: true,
    type: 'open-air',
    amenities: ['CCTV', 'Security'],
    images: [],
    rating: 4.3,
    ratingCount: 110,
  },
  {
    name: 'Sector 18 Noida Parking',
    description: 'Convenient parking near mall and metro.',
    coordinates: { latitude: 28.5708, longitude: 77.3210 },
    price: 40,
    priceUnit: 'hour',
    available: false,
    type: 'underground',
    amenities: ['EV Charging', 'Lighting'],
    images: [],
    rating: 4.4,
    ratingCount: 88,
  },
  {
    name: 'Pondy Bazaar Parking',
    description: 'Busy shopping zone in Chennai with dedicated parking.',
    coordinates: { latitude: 13.0412, longitude: 80.2342 },
    price: 30,
    priceUnit: 'hour',
    available: true,
    type: 'covered',
    amenities: ['Security', 'Shaded'],
    images: [],
    rating: 4.1,
    ratingCount: 52,
  },
  {
    name: 'Thampanoor Bus Stand Parking',
    description: 'Convenient city center parking in Trivandrum.',
    coordinates: { latitude: 8.4882, longitude: 76.9492 },
    price: 20,
    priceUnit: 'hour',
    available: true,
    type: 'open-air',
    amenities: ['Lighting', 'Toilets'],
    images: [],
    rating: 3.8,
    ratingCount: 35,
  },
  {
    name: 'South City Mall Parking',
    description: 'Kolkata mall parking with EV charging.',
    coordinates: { latitude: 22.4988, longitude: 88.3616 },
    price: 50,
    priceUnit: 'hour',
    available: true,
    type: 'multi-level',
    amenities: ['EV Charging', 'CCTV', 'Security'],
    images: [],
    rating: 4.7,
    ratingCount: 140,
  },
];

const seed = async () => {
  for (const spot of mockSpots) {
    try {
      const id = await addParkingSpot(spot);
      console.log(`✅ Added parking spot with ID: ${id}`);
    } catch (error) {
      console.error('❌ Error adding parking spot:', error);
    }
  }
};

seed();
