import { useParking } from '@/context/ParkinContext';
import { useTheme } from '@/context/ThemeContext';
import { BookingHistory } from '@/types/parking';
import { calculateParkingCost } from '@/utils/distance';
import { Calendar, CircleCheck as CheckCircle, Clock, CreditCard, MapPin, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingsScreen() {
  const { theme } = useTheme();
  const { bookingHistory, cancelBooking, finishParking, loading } = useParking();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  
  // Filter bookings based on active tab
  const filteredBookings = bookingHistory.filter(booking => {
    if (activeTab === 'active') {
      return booking.status === 'active';
    } else {
      return booking.status === 'completed' || booking.status === 'cancelled';
    }
  });
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Get duration between start and end times
  const getDuration = (startTime: Date, endTime: Date | null) => {
    if (!endTime) {
      // For active bookings, calculate time elapsed so far
      const now = new Date();
      const diffMs = now.getTime() - startTime.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHrs === 0) {
        return `${diffMins}m`;
      }
      return `${diffHrs}h ${diffMins}m`;
    }
    
    // For completed bookings
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs === 0) {
      return `${diffMins}m`;
    }
    return `${diffHrs}h ${diffMins}m`;
  };
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: async () => {
            const success = await cancelBooking(bookingId);
            if (success) {
              Alert.alert('Success', 'Booking cancelled successfully');
            }
          }
        }
      ]
    );
  };

  // Handle finish parking
  const handleFinishParking = async (booking: BookingHistory) => {
    const currentCost = calculateParkingCost(
      booking.startTime,
      new Date(),
      booking.spot.price || 0
    );

    Alert.alert(
      'Finish Parking',
      `Duration: ${currentCost.formattedBillingDuration}\nTotal Cost: $${currentCost.totalCost}\n\nAre you sure you want to finish parking?`,
      [
        { text: 'Continue Parking', style: 'cancel' },
        { 
          text: 'Finish & Pay', 
          onPress: async () => {
            const success = await finishParking(booking.id);
            if (success) {
              Alert.alert('Success', `Parking completed! Total cost: $${currentCost.totalCost}`);
            }
          }
        }
      ]
    );
  };
  
  // Render a booking item
  const renderBookingItem = ({ item }: { item: BookingHistory }) => (
    <View style={[styles.bookingCard, { backgroundColor: theme.background.secondary }]}>
      {/* Spot image */}
      {item.spot.images && item.spot.images.length > 0 ? (
        <Image 
          source={{ uri: item.spot.images[0] }} 
          style={styles.spotImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.spotImagePlaceholder, { backgroundColor: theme.neutral[300] }]} />
      )}
      
      <View style={styles.bookingDetails}>
        {/* Spot name and status indicator */}
        <View style={styles.bookingHeader}>
          <Text style={[styles.spotName, { color: theme.text.primary }]}>
            {item.spot.name}
          </Text>
          <View style={[
            styles.statusIndicator, 
            { 
              backgroundColor: 
                item.status === 'active' 
                  ? theme.success.default 
                  : item.status === 'cancelled'
                    ? theme.error.default
                    : theme.primary.default
            }
          ]}>
            <Text style={[styles.statusText, { color: theme.text.inverse }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        
        {/* Booking details */}
        <View style={styles.detailsRow}>
          <Calendar size={16} color={theme.text.secondary} />
          <Text style={[styles.detailText, { color: theme.text.secondary }]}>
            {formatDate(item.startTime)}
          </Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Clock size={16} color={theme.text.secondary} />
          <Text style={[styles.detailText, { color: theme.text.secondary }]}>
            {formatTime(item.startTime)} - {item.endTime ? formatTime(item.endTime) : 'Ongoing'}
            {' '} ({getDuration(item.startTime, item.endTime)})
          </Text>
        </View>
        
        <View style={styles.detailsRow}>
          <MapPin size={16} color={theme.text.secondary} />
          <Text style={[styles.detailText, { color: theme.text.secondary }]}>
            {item.spot.description || 'No location details'}
          </Text>
        </View>

        {/* Cost information */}
        {item.status === 'active' && (
          <View style={styles.detailsRow}>
            <CreditCard size={16} color={theme.text.secondary} />
            <Text style={[styles.detailText, { color: theme.text.secondary }]}>
              Rate: ${item.spot.price || 0}/hour
            </Text>
          </View>
        )}

        {item.status === 'completed' && item.totalCost && (
          <View style={styles.detailsRow}>
            <CreditCard size={16} color={theme.success.default} />
            <Text style={[styles.detailText, { color: theme.success.default, fontFamily: 'Inter-Medium' }]}>
              Total Cost: ${item.totalCost.toFixed(2)}
            </Text>
          </View>
        )}
        
        {/* Action buttons */}
        {item.status === 'active' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.finishButton, { backgroundColor: theme.primary.default }]}
              onPress={() => handleFinishParking(item)}
              disabled={loading}
            >
              <CheckCircle size={16} color={theme.text.inverse} />
              <Text style={[styles.buttonText, { color: theme.text.inverse }]}>
                Finish Parking
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: theme.error.default }]}
              onPress={() => handleCancelBooking(item.id)}
              disabled={loading}
            >
              <X size={16} color={theme.text.inverse} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
          Your Bookings
        </Text>
      </View>
      
      {/* Tab selector */}
      <View style={[styles.tabContainer, { backgroundColor: theme.background.secondary }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'active' && { backgroundColor: theme.primary.default }
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'active' ? theme.text.inverse : theme.text.secondary }
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'past' && { backgroundColor: theme.primary.default }
          ]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'past' ? theme.text.inverse : theme.text.secondary }
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Booking list */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
              {activeTab === 'active' 
                ? "You don't have any active bookings" 
                : "You don't have any past bookings"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  bookingCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  spotImage: {
    width: 100,
    height: 'auto',
  },
  spotImagePlaceholder: {
    width: 100,
    height: 'auto',
  },
  bookingDetails: {
    flex: 1,
    padding: 12,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    flex: 1,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});