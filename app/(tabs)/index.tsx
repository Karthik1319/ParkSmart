import FilterModal from '@/components/parking/FilterModal';
import ParkingSpotCard from '@/components/parking/ParkingSpotCard';
import { useParking } from '@/context/ParkinContext';
import { useTheme } from '@/context/ThemeContext';
import { Filter, MapPin, Navigation, RefreshCw } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type SpotType = 'standard' | 'handicapped' | 'electric' | 'compact' | 'underground' | 'open-air' | 'covered' | 'shaded' | 'multi-level';

type ParkingFilters = {
  onlyAvailable: boolean;
  maxPrice: number;
  maxDistance: number;
  types: SpotType[];
};

const MAP_STYLE = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

export default function MapScreen() {
  const { theme, isDark } = useTheme();
  const { 
    userLocation, 
    nearbySpots, 
    selectedSpot, 
    selectParkingSpot, 
    findNearestAvailableSpot,
    refreshParkingSpots,
    loading
  } = useParking();
  
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<ParkingFilters>({
    onlyAvailable: true,
    maxPrice: 10,
    maxDistance: 5,
    types: ['standard', 'handicapped', 'electric', 'compact', 'underground', 'open-air', 'covered', 'shaded', 'multi-level']
  });

  
  const mapRef = useRef<MapView>(null);
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;
  
  // Initial region based on user location or default to San Francisco
  const initialRegion: Region = userLocation ? {
    latitude: userLocation.coords.latitude,
    longitude: userLocation.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: 17.964609,
    longitude: 79.747429,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  
  // Filter spots based on user preferences
  const filteredSpots = nearbySpots.filter(spot => {
    if (filters.onlyAvailable && !spot.available) return false;
    if (spot.distance && spot.distance > filters.maxDistance) return false;
    if (spot.price && spot.price > filters.maxPrice) return false;
    if (spot.type && !filters.types.includes(spot.type)) return false;
    return true;
  });
  
  // Animate bottom sheet when spot is selected
  useEffect(() => {
    Animated.spring(bottomSheetAnim, {
      toValue: selectedSpot ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
    
    // Center map on selected spot
    if (selectedSpot && selectedSpot.coordinates && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: selectedSpot.coordinates.latitude,
        longitude: selectedSpot.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  }, [selectedSpot]);
  
  // Find nearest spot function
  const handleFindNearest = () => {
    const nearestSpot = findNearestAvailableSpot();
    if (nearestSpot) {
      selectParkingSpot(nearestSpot);
    }
  };
  
  // Handle map refresh
  const handleRefresh = () => {
    refreshParkingSpots();
    
    // If user location exists, recenter map
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };
  
  // Handle filter changes
  const applyFilters = (newFilters: ParkingFilters) => {
    setFilters(newFilters);
    setFilterVisible(false);
  };

  
  // Calculate bottom sheet translation
  const translateY = bottomSheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={isDark ? MAP_STYLE : []}
      >
        {filteredSpots.map((spot) => (
          spot.coordinates ? (
            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.coordinates.latitude,
                longitude: spot.coordinates.longitude
              }}
              onPress={() => selectParkingSpot(spot)}
            >
              <View style={[
                styles.markerContainer,
                {
                  backgroundColor: spot.available 
                    ? theme.success.default 
                    : theme.error.default
                }
              ]}>
                <MapPin 
                  size={16} 
                  color={theme.text.inverse} 
                  strokeWidth={3}
                />
              </View>
            </Marker>
          ) : null
        ))}
      </MapView>
      
      {/* Top Action Buttons */}
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.background.primary }]}
          onPress={() => setFilterVisible(true)}
        >
          <Filter size={20} color={theme.text.primary} />
          <Text style={[styles.actionButtonText, { color: theme.text.primary }]}>
            Filters
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.primary.default }]}
          onPress={handleFindNearest}
          disabled={loading}
        >
          <Navigation size={20} color={theme.text.inverse} />
          <Text style={[styles.actionButtonText, { color: theme.text.inverse }]}>
            Find Nearest
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: theme.background.primary }]}
          onPress={handleRefresh}
          disabled={loading}
        >
          <RefreshCw 
            size={20} 
            color={loading ? theme.text.tertiary : theme.text.primary}
          />
        </TouchableOpacity>
      </View>
      
      {/* Bottom Sheet for Parking Spot Details */}
      <Animated.View
        style={[
          styles.bottomSheet,
          { 
            backgroundColor: theme.background.primary,
            transform: [{ translateY }] 
          }
        ]}
      >
        {selectedSpot && (
          <ParkingSpotCard 
            spot={selectedSpot}
            onClose={() => selectParkingSpot(null)}
          />
        )}
      </Animated.View>
      
      {/* Filter Modal */}
      <FilterModal
        visible={filterVisible}
        filters={filters}
        onApply={applyFilters}
        onClose={() => setFilterVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topButtonsContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16, // Extra padding for iOS home indicator
  },
});