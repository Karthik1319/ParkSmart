import { useParking } from '@/context/ParkinContext';
import { useTheme } from '@/context/ThemeContext';
import { ParkingSpot } from '@/types/parking';
import { Archive, Banknote, BatteryCharging, Car, Layers, Leaf, Navigation, ShieldCheck, Star, Sun, X } from 'lucide-react-native';
import React from 'react';
import { Alert, Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ParkingSpotCardProps = {
  spot: ParkingSpot;
  onClose: () => void;
};

export default function ParkingSpotCard({ spot, onClose }: ParkingSpotCardProps) {
  const { theme } = useTheme();
  const { bookSpot, loading, userLocation } = useParking();
  const insets = useSafeAreaInsets();

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
        return <ShieldCheck size={16} color={theme.text.inverse} />;
      case 'shaded':
        return <Leaf size={16} color={theme.text.inverse} />;
      case 'multi-level':
        return <Layers size={16} color={theme.text.inverse} />;
      case 'standard':
      default:
        return <Car size={16} color={theme.text.inverse} />;
    }
  };

  const handleBookSpot = async () => {
    if (!spot.available) return;
    try {
      const success = await bookSpot(spot.id);
      if (success) {
        Alert.alert('Success', 'Parking spot booked successfully!');
        onClose();
      } else {
        Alert.alert('Error', 'Failed to book parking spot. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'An error occurred while booking. Please try again.');
    }
  };

  const handleNavigation = async () => {
    if (!spot.coordinates) {
      Alert.alert('Error', 'Location coordinates not available for this spot.');
      return;
    }

    const { latitude, longitude } = spot.coordinates;
    const destination = `${latitude},${longitude}`;
    const label = encodeURIComponent(spot.name);
    let url = '';

    try {
      if (Platform.OS === 'ios') {
        url = `maps://app?daddr=${destination}&dirflg=d`;
        const canOpenAppleMaps = await Linking.canOpenURL(url);
        if (!canOpenAppleMaps) {
          url = `comgooglemaps://?daddr=${destination}&directionsmode=driving`;
          const canOpenGoogleMaps = await Linking.canOpenURL(url);
          if (!canOpenGoogleMaps) {
            url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
          }
        }
      } else {
        url = `google.navigation:q=${destination}&mode=d`;
        const canOpenGoogleMaps = await Linking.canOpenURL(url);
        if (!canOpenGoogleMaps) {
          url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
        }
      }

      if (userLocation && url.includes('google.com')) {
        const origin = `${userLocation.coords.latitude},${userLocation.coords.longitude}`;
        url += `&origin=${origin}`;
      }

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert(
        'Navigation Error',
        'Unable to open navigation app. Please check if you have a maps app installed.',
        [
          {
            text: 'Open in Browser',
            onPress: () => {
              const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
              Linking.openURL(webUrl);
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageWrapper, { paddingTop: insets.top }]}>
        {spot.images && spot.images.length > 0 ? (
          <Image
            source={{ uri: spot.images[0] }}
            style={styles.spotImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.spotImagePlaceholder, { backgroundColor: theme.neutral[300] }]} />
        )}

        <TouchableOpacity
          style={[styles.closeButtonOverlay, { backgroundColor: theme.background.secondary }]}
          onPress={onClose}
        >
          <X size={20} color={theme.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Wrap details in ScrollView */}
      <ScrollView
        style={[styles.detailsContainer, { paddingBottom: insets.bottom + 45 }]}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* All your details content here unchanged */}
        <View style={styles.nameRow}>
          <Text style={[styles.spotName, { color: theme.text.primary }]}>{spot.name}</Text>
          {spot.rating && (
            <View style={styles.ratingContainer}>
              <Star size={16} color={theme.accent.default} fill={theme.accent.default} />
              <Text style={[styles.ratingText, { color: theme.text.primary }]}>{spot.rating.toFixed(1)}</Text>
              {spot.ratingCount && (
                <Text style={[styles.ratingCount, { color: theme.text.tertiary }]}>({spot.ratingCount})</Text>
              )}
            </View>
          )}
        </View>

        {spot.description && (
          <Text style={[styles.description, { color: theme.text.secondary }]}>{spot.description}</Text>
        )}

        <View style={styles.singleInfoContainer}>
          {spot.price !== undefined && (
            <View style={[styles.infoCard, { backgroundColor: theme.background.secondary }]}>
              <Banknote size={20} color={theme.primary.default} />
              <Text style={[styles.infoLabel, { color: theme.text.secondary }]}>Rate</Text>
              <Text style={[styles.infoValue, { color: theme.text.primary }]}>
                ${spot.price.toFixed(2)}/{spot.priceUnit || 'hour'}
              </Text>
            </View>
          )}
        </View>

        {spot.amenities && spot.amenities.length > 0 && (
          <View style={styles.amenitiesContainer}>
            <Text style={[styles.amenitiesTitle, { color: theme.text.primary }]}>Amenities</Text>
            <View style={styles.amenitiesList}>
              {spot.amenities.map((amenity, index) => (
                <View
                  key={index}
                  style={[styles.amenityTag, { backgroundColor: theme.background.secondary }]}
                >
                  <Text style={[styles.amenityText, { color: theme.text.secondary }]}>
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.typeContainer}>
          <View
            style={[
              styles.typeTag,
              {
                backgroundColor: spot.available ? theme.success.default : theme.error.default,
              },
            ]}
          >
            {getTypeIcon()}
            <Text style={[styles.typeText, { color: theme.text.inverse }]}>
              {spot.available ? 'Available' : 'Occupied'} ·{' '}
              {spot.type ? spot.type.charAt(0).toUpperCase() + spot.type.slice(1) : 'Standard'}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.bookButton,
              {
                backgroundColor: spot.available ? theme.primary.default : theme.neutral[400],
                opacity: loading ? 0.7 : 1,
              },
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
            onPress={handleNavigation}
          >
            <Navigation size={24} color={theme.text.inverse} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  closeButtonOverlay: {
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
    height: 180,
    borderRadius: 12,
  },
  spotImagePlaceholder: {
    width: '100%',
    height: 180,
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
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    marginLeft: 4,
  },
  ratingCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    marginLeft: 2,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  singleInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoCard: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    marginTop: 4,
  },
  infoValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    marginTop: 2,
  },
  amenitiesContainer: {
    marginBottom: 16,
  },
  amenitiesTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 6,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  typeContainer: {
    marginBottom: 16,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  bookButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
    fontSize: 15,
  },
});
