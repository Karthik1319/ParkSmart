import CustomMapPin from '@/components/parking/CustomMapPin';
import FilterModal from '@/components/parking/FilterModal';
import ParkingSpotCard from '@/components/parking/ParkingSpotCard';
import { useParking } from '@/context/ParkinContext';
import { useTheme } from '@/context/ThemeContext';
import { ListFilter as Filter, Navigation, RefreshCw } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type SpotType = 'standard' | 'handicapped' | 'electric' | 'compact' | 'underground' | 'open-air' | 'covered' | 'shaded' | 'multi-level';

type ParkingFilters = {
  onlyAvailable: boolean;
  maxPrice: number;
  maxDistance: number;
  types: SpotType[];
  amenities: string[];
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
    maxPrice: 50,
    maxDistance: 10,
    types: ['standard', 'handicapped', 'electric', 'compact', 'underground', 'open-air', 'covered', 'shaded', 'multi-level'],
    amenities: []
  });
  
  const mapRef = useRef<MapView>(null);
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;
  
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
  
  const filteredSpots = nearbySpots.filter(spot => {
    // Availability filter
    if (filters.onlyAvailable && !spot.available) return false;
    
    // Distance filter
    if (spot.distance && spot.distance > filters.maxDistance) return false;
    
    // Price filter
    if (spot.price && spot.price > filters.maxPrice) return false;
    
    // Type filter
    if (spot.type && !filters.types.includes(spot.type)) return false;
    
    // Amenities filter
    if (filters.amenities.length > 0) {
      const spotAmenities = spot.amenities || [];
      const hasRequiredAmenities = filters.amenities.every(amenity => 
        spotAmenities.some(spotAmenity => 
          spotAmenity.toLowerCase().includes(amenity.toLowerCase())
        )
      );
      if (!hasRequiredAmenities) return false;
    }
    
    return true;
  });
  
  useEffect(() => {
    Animated.spring(bottomSheetAnim, {
      toValue: selectedSpot ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
    
    if (selectedSpot && selectedSpot.coordinates && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: selectedSpot.coordinates.latitude,
        longitude: selectedSpot.coordinates.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);
    }
  }, [selectedSpot]);
  
  const handleFindNearest = () => {
    const nearestSpot = findNearestAvailableSpot();
    if (nearestSpot) {
      selectParkingSpot(nearestSpot);
    }
  };
  
  const handleRefresh = () => {
    refreshParkingSpots();
    
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };
  
  const applyFilters = (newFilters: ParkingFilters) => {
    setFilters(newFilters);
    setFilterVisible(false);
  };
  
  const translateY = bottomSheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: 12, paddingBottom: 30 }]} edges={['top', 'bottom']}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={isDark ? MAP_STYLE : []}
      >
        {filteredSpots.map(spot =>
          spot.coordinates ? (
            <CustomMapPin
              key={spot.id}
              id={spot.id}
              latitude={spot.coordinates.latitude}
              longitude={spot.coordinates.longitude}
              available={spot.available}
              onPress={() => selectParkingSpot(spot)}
            />
          ) : null
        )}
      </MapView>
      
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            { 
              backgroundColor: theme.background.primary,
              shadowColor: theme.shadow,
            }
          ]}
          onPress={() => setFilterVisible(true)}
        >
          <Filter size={20} color={theme.text.primary} />
          <Text style={[styles.actionButtonText, { color: theme.text.primary }]}>
            Filters ({filteredSpots.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            { 
              backgroundColor: theme.primary.default,
              shadowColor: theme.shadow,
            }
          ]}
          onPress={handleFindNearest}
          disabled={loading}
        >
          <Navigation size={20} color={theme.text.inverse} />
          <Text style={[styles.actionButtonText, { color: theme.text.inverse }]}>
            Find Nearest
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.iconButton, 
            { 
              backgroundColor: theme.background.primary,
              shadowColor: theme.shadow,
            }
          ]}
          onPress={handleRefresh}
          disabled={loading}
        >
          <RefreshCw 
            size={20} 
            color={loading ? theme.text.tertiary : theme.text.primary}
          />
        </TouchableOpacity>
      </View>
      
      <Animated.View
        style={[
          styles.bottomSheet,
          { 
            backgroundColor: theme.background.primary,
            shadowColor: theme.shadow,
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
    top: 45,
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
    paddingVertical: 12,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
});