import Slider from '@/components/ui/Slider';
import { useTheme } from '@/context/ThemeContext';
import { Accessibility, Archive, BatteryCharging, Car, Check, Layers, Leaf, Shield, Sun, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type FilterProps = {
  visible: boolean;
  filters: {
    onlyAvailable: boolean;
    maxPrice: number;
    maxDistance: number;
    types: string[];
    amenities: string[];
  };
  onApply: (filters: any) => void;
  onClose: () => void;
};

const AVAILABLE_AMENITIES = [
  'Security',
  'CCTV',
  'EV Charging',
  'Covered',
  'Lighting',
  'Toilets',
  'Elevator',
  'Shuttle',
  'Scenic'
];

export default function FilterModal({ visible, filters, onApply, onClose }: FilterProps) {
  const { theme } = useTheme();
  
  // Local state for filters
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Reset filters to initial values
  const handleReset = () => {
    setLocalFilters({
      onlyAvailable: true,
      maxPrice: 50,
      maxDistance: 10,
      types: ['standard', 'handicapped', 'electric', 'compact', 'underground', 'open-air', 'covered', 'shaded', 'multi-level'],
      amenities: []
    });
  };
  
  // Apply filters and close modal
  const handleApply = () => {
    onApply(localFilters);
  };
  
  // Toggle parking type selection
  const toggleType = (type: string) => {
    setLocalFilters(prev => {
      const types = [...prev.types];
      
      if (types.includes(type)) {
        // Remove type if it's already selected
        return {
          ...prev,
          types: types.filter(t => t !== type)
        };
      } else {
        // Add type if it's not selected
        return {
          ...prev,
          types: [...types, type]
        };
      }
    });
  };

  // Toggle amenity selection
  const toggleAmenity = (amenity: string) => {
    setLocalFilters(prev => {
      const amenities = [...prev.amenities];
      
      if (amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: amenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...amenities, amenity]
        };
      }
    });
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContainer, { backgroundColor: theme.background.primary }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
              Filters
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={theme.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.content}>
            {/* Availability Filter */}
            <View style={styles.filterSection}>
              <View style={styles.filterRow}>
                <Text style={[styles.filterTitle, { color: theme.text.primary }]}>
                  Show only available spots
                </Text>
                <Switch
                  value={localFilters.onlyAvailable}
                  onValueChange={(value) => setLocalFilters(prev => ({ ...prev, onlyAvailable: value }))}
                  trackColor={{ 
                    false: theme.neutral[300], 
                    true: theme.primary.default 
                  }}
                  thumbColor={theme.background.primary}
                />
              </View>
            </View>
            
            {/* Distance Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.text.primary }]}>
                Maximum Distance
              </Text>
              <Text style={[styles.filterValue, { color: theme.text.secondary }]}>
                {localFilters.maxDistance} km
              </Text>
              <Slider
                value={localFilters.maxDistance}
                minimumValue={1}
                maximumValue={20}
                step={1}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, maxDistance: value }))}
              />
            </View>
            
            {/* Price Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.text.primary }]}>
                Maximum Price
              </Text>
              <Text style={[styles.filterValue, { color: theme.text.secondary }]}>
                ${localFilters.maxPrice}/hour
              </Text>
              <Slider
                value={localFilters.maxPrice}
                minimumValue={1}
                maximumValue={100}
                step={5}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, maxPrice: value }))}
              />
            </View>
            
            {/* Parking Type Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.text.primary }]}>
                Parking Type
              </Text>
              
              <View style={styles.typeOptions}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    { 
                      backgroundColor: localFilters.types.includes('standard') 
                        ? theme.primary.default 
                        : theme.background.secondary 
                    }
                  ]}
                  onPress={() => toggleType('standard')}
                >
                  <Car 
                    size={24} 
                    color={localFilters.types.includes('standard') 
                      ? theme.text.inverse 
                      : theme.text.primary
                    } 
                  />
                  <Text 
                    style={[
                      styles.typeText,
                      { 
                        color: localFilters.types.includes('standard') 
                          ? theme.text.inverse 
                          : theme.text.primary 
                      }
                    ]}
                  >
                    Standard
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                        styles.typeOption,
                        { 
                        backgroundColor: localFilters.types.includes('handicapped') 
                            ? theme.primary.default 
                            : theme.background.secondary 
                        }
                    ]}
                    onPress={() => toggleType('handicapped')}
                    >
                    <Accessibility 
                        size={24} 
                        color={localFilters.types.includes('handicapped') 
                        ? theme.text.inverse 
                        : theme.text.primary
                        } 
                    />
                    <Text 
                        style={[
                        styles.typeText,
                        { 
                            color: localFilters.types.includes('handicapped') 
                            ? theme.text.inverse 
                            : theme.text.primary 
                        }
                        ]}
                    >
                        Handicapped
                    </Text>
                </TouchableOpacity>

                
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    { 
                      backgroundColor: localFilters.types.includes('electric') 
                        ? theme.primary.default 
                        : theme.background.secondary 
                    }
                  ]}
                  onPress={() => toggleType('electric')}
                >
                  <BatteryCharging 
                    size={24} 
                    color={localFilters.types.includes('electric') 
                      ? theme.text.inverse 
                      : theme.text.primary
                    } 
                  />
                  <Text 
                    style={[
                      styles.typeText,
                      { 
                        color: localFilters.types.includes('electric') 
                          ? theme.text.inverse 
                          : theme.text.primary 
                      }
                    ]}
                  >
                    Electric
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    { 
                      backgroundColor: localFilters.types.includes('compact') 
                        ? theme.primary.default 
                        : theme.background.secondary 
                    }
                  ]}
                  onPress={() => toggleType('compact')}
                >
                  <Car 
                    size={20} 
                    color={localFilters.types.includes('compact') 
                      ? theme.text.inverse 
                      : theme.text.primary
                    } 
                  />
                  <Text 
                    style={[
                      styles.typeText,
                      { 
                        color: localFilters.types.includes('compact') 
                          ? theme.text.inverse 
                          : theme.text.primary 
                      }
                    ]}
                  >
                    Compact
                  </Text>
                </TouchableOpacity>

                {/* Underground */}
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    { 
                      backgroundColor: localFilters.types.includes('underground') 
                        ? theme.primary.default 
                        : theme.background.secondary 
                    }
                  ]}
                  onPress={() => toggleType('underground')}
                >
                  <Archive 
                    size={24} 
                    color={localFilters.types.includes('underground') 
                      ? theme.text.inverse 
                      : theme.text.primary
                    } 
                  />
                  <Text 
                    style={[
                      styles.typeText,
                      { 
                        color: localFilters.types.includes('underground') 
                          ? theme.text.inverse 
                          : theme.text.primary 
                      }
                    ]}
                  >
                    Underground
                  </Text>
                </TouchableOpacity>

                {/* Open-Air */}
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    { 
                      backgroundColor: localFilters.types.includes('open-air') 
                        ? theme.primary.default 
                        : theme.background.secondary 
                    }
                  ]}
                  onPress={() => toggleType('open-air')}
                >
                  <Sun 
                    size={24} 
                    color={localFilters.types.includes('open-air') 
                      ? theme.text.inverse 
                      : theme.text.primary
                    } 
                  />
                  <Text 
                    style={[
                      styles.typeText,
                      { 
                        color: localFilters.types.includes('open-air') 
                          ? theme.text.inverse 
                          : theme.text.primary 
                      }
                    ]}
                  >
                    Open-Air
                  </Text>
                </TouchableOpacity>

                {/* Covered */}
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    { 
                      backgroundColor: localFilters.types.includes('covered') 
                        ? theme.primary.default 
                        : theme.background.secondary 
                    }
                  ]}
                  onPress={() => toggleType('covered')}
                >
                  <Shield 
                    size={24} 
                    color={localFilters.types.includes('covered') 
                      ? theme.text.inverse 
                      : theme.text.primary
                    } 
                  />
                  <Text 
                    style={[
                      styles.typeText,
                      { 
                        color: localFilters.types.includes('covered') 
                          ? theme.text.inverse 
                          : theme.text.primary 
                      }
                    ]}
                  >
                    Covered
                  </Text>
                </TouchableOpacity>

                {/* Shaded */}
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    { 
                      backgroundColor: localFilters.types.includes('shaded') 
                        ? theme.primary.default 
                        : theme.background.secondary 
                    }
                  ]}
                  onPress={() => toggleType('shaded')}
                >
                  <Leaf 
                    size={24} 
                    color={localFilters.types.includes('shaded') 
                      ? theme.text.inverse 
                      : theme.text.primary
                    } 
                  />
                  <Text 
                    style={[
                      styles.typeText,
                      { 
                        color: localFilters.types.includes('shaded') 
                          ? theme.text.inverse 
                          : theme.text.primary 
                      }
                    ]}
                  >
                    Shaded
                  </Text>
                </TouchableOpacity>

                {/* Multi-Level */}
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    { 
                      backgroundColor: localFilters.types.includes('multi-level') 
                        ? theme.primary.default 
                        : theme.background.secondary 
                    }
                  ]}
                  onPress={() => toggleType('multi-level')}
                >
                  <Layers 
                    size={24} 
                    color={localFilters.types.includes('multi-level') 
                      ? theme.text.inverse 
                      : theme.text.primary
                    } 
                  />
                  <Text 
                    style={[
                      styles.typeText,
                      { 
                        color: localFilters.types.includes('multi-level') 
                          ? theme.text.inverse 
                          : theme.text.primary 
                      }
                    ]}
                  >
                    Multi-Level
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amenities Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.text.primary }]}>
                Amenities
              </Text>
              
              <View style={styles.amenitiesGrid}>
                {AVAILABLE_AMENITIES.map((amenity) => (
                  <TouchableOpacity
                    key={amenity}
                    style={[
                      styles.amenityOption,
                      { 
                        backgroundColor: localFilters.amenities.includes(amenity) 
                          ? theme.primary.default 
                          : theme.background.secondary,
                        borderColor: localFilters.amenities.includes(amenity) 
                          ? theme.primary.default 
                          : theme.border
                      }
                    ]}
                    onPress={() => toggleAmenity(amenity)}
                  >
                    <Text 
                      style={[
                        styles.amenityText,
                        { 
                          color: localFilters.amenities.includes(amenity) 
                            ? theme.text.inverse 
                            : theme.text.primary 
                        }
                      ]}
                    >
                      {amenity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: theme.border }]}
              onPress={handleReset}
            >
              <Text style={[styles.resetButtonText, { color: theme.text.primary }]}>
                Reset
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: theme.primary.default }]}
              onPress={handleApply}
            >
              <Check size={20} color={theme.text.inverse} />
              <Text style={[styles.applyButtonText, { color: theme.text.inverse }]}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    height: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  content: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  filterValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 8,
  },
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  typeOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    marginRight: '4%',
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  amenityOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  amenityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  resetButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  applyButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginLeft: 8,
  },
});