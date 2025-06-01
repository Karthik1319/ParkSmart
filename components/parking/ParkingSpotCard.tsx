import { useParking } from '@/context/ParkinContext';
import { useTheme } from '@/context/ThemeContext';
import { ParkingSpot } from '@/types/parking';
import { formatDistance, formatTime } from '@/utils/distance';
import { Archive, Banknote, BatteryCharging, Car, Clock, Layers, Leaf, MapPin, Navigation, ShieldCheck, Star, Sun, X } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ParkingSpotCardProps = {
  spot: ParkingSpot;
  onClose: () => void;
};

export default function ParkingSpotCard({ spot, onClose }: ParkingSpotCardProps) {
  const { theme } = useTheme();
  const { bookSpot, loading } = useParking();
  
  // Get icon based on parking type
  const getTypeIcon = () => {
    switch (spot.type) {
      case 'handicapped':
        return <ShieldCheck size={16} color={theme.text.inverse} />;
      case 'electric':
        return <BatteryCharging size={16} color={theme.text.inverse} />;
      case 'compact':
        return <Car size={16} color={theme.text.inverse} />;
      case 'underground':
        return <Archive size={16} color={theme.text.inverse} />;
      case 'open-air':
        return <Sun size={16} color={theme.text.inverse} />;
      case 'covered':
        return <ShieldCheck size={16} color={theme.text.inverse} />;  // reuse ShieldCheck for covered
      case 'shaded':
        return <Leaf size={16} color={theme.text.inverse} />;
      case 'multi-level':
        return <Layers size={16} color={theme.text.inverse} />;
      case 'standard':
      default:
        return <Car size={16} color={theme.text.inverse} />;
    }
  };
  
  // Book this parking spot
  const handleBookSpot = async () => {
    if (!spot.available) return;
    await bookSpot(spot.id);
    onClose();
  };
  
  return (
    <View style={styles.container}>
      {/* Close button */}
      <TouchableOpacity 
        style={[styles.closeButton, { backgroundColor: theme.background.secondary }]} 
        onPress={onClose}
      >
        <X size={20} color={theme.text.primary} />
      </TouchableOpacity>
      
      {/* Spot image */}
      {spot.images && spot.images.length > 0 ? (
        <Image 
          source={{ uri: spot.images[0] }} 
          style={styles.spotImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.spotImagePlaceholder, { backgroundColor: theme.neutral[300] }]} />
      )}
      
      {/* Spot details */}
      <View style={styles.detailsContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.spotName, { color: theme.text.primary }]}>
            {spot.name}
          </Text>
          
          {spot.rating && (
            <View style={styles.ratingContainer}>
              <Star size={16} color={theme.accent.default} fill={theme.accent.default} />
              <Text style={[styles.ratingText, { color: theme.text.primary }]}>
                {spot.rating.toFixed(1)}
              </Text>
              {spot.ratingCount && (
                <Text style={[styles.ratingCount, { color: theme.text.tertiary }]}>
                  ({spot.ratingCount})
                </Text>
              )}
            </View>
          )}
        </View>
        
        {spot.description && (
          <Text style={[styles.description, { color: theme.text.secondary }]}>
            {spot.description}
          </Text>
        )}
        
        <View style={styles.infoRows}>
          {/* Distance info */}
          {spot.distance !== undefined && (
            <View style={styles.infoRow}>
              <MapPin size={18} color={theme.primary.default} />
              <Text style={[styles.infoText, { color: theme.text.primary }]}>
                {formatDistance(spot.distance)} away
              </Text>
            </View>
          )}
          
          {/* Time info */}
          {spot.estimatedTime !== undefined && (
            <View style={styles.infoRow}>
              <Clock size={18} color={theme.primary.default} />
              <Text style={[styles.infoText, { color: theme.text.primary }]}>
                {formatTime(spot.estimatedTime)} drive
              </Text>
            </View>
          )}
          
          {/* Price info */}
          {spot.price !== undefined && (
            <View style={styles.infoRow}>
              <Banknote size={18} color={theme.primary.default} />
              <Text style={[styles.infoText, { color: theme.text.primary }]}>
                ${spot.price.toFixed(2)}/{spot.priceUnit || 'hour'}
              </Text>
            </View>
          )}
        </View>
        
        {/* Amenities */}
        {spot.amenities && spot.amenities.length > 0 && (
          <View style={styles.amenitiesContainer}>
            <Text style={[styles.amenitiesTitle, { color: theme.text.primary }]}>
              Amenities
            </Text>
            <View style={styles.amenitiesList}>
              {spot.amenities.map((amenity, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.amenityTag, 
                    { backgroundColor: theme.background.secondary }
                  ]}
                >
                  <Text style={[styles.amenityText, { color: theme.text.secondary }]}>
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Type indicator */}
        <View style={styles.typeContainer}>
          <View style={[
            styles.typeTag, 
            { backgroundColor: spot.available ? theme.success.default : theme.error.default }
          ]}>
            {getTypeIcon()}
            <Text style={[styles.typeText, { color: theme.text.inverse }]}>
              {spot.available ? 'Available' : 'Occupied'} · {spot.type ? spot.type.charAt(0).toUpperCase() + spot.type.slice(1) : 'Standard'}
            </Text>

          </View>
        </View>
        
        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.bookButton, 
              { 
                backgroundColor: spot.available ? theme.primary.default : theme.neutral[400],
                opacity: loading ? 0.7 : 1
              }
            ]}
            onPress={handleBookSpot}
            disabled={!spot.available || loading}
          >
            <Text style={[styles.buttonText, { color: theme.text.inverse }]}>
              {loading ? 'Booking...' : spot.available ? 'Book Now' : 'Not Available'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navigationButton, { backgroundColor: theme.secondary.default }]}
            onPress={() => {/* Navigate */}}
          >
            <Navigation size={24} color={theme.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  spotImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  spotImagePlaceholder: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  detailsContainer: {
    paddingTop: 16,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginLeft: 4,
  },
  ratingCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 2,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoRows: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  amenitiesContainer: {
    marginBottom: 16,
  },
  amenitiesTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  typeContainer: {
    marginBottom: 16,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  bookButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  navigationButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
});