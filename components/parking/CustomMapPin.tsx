import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';

interface CustomMapPinProps {
  id: string;
  latitude: number;
  longitude: number;
  available: boolean;
  onPress?: () => void;
}

const CustomMapPin: React.FC<CustomMapPinProps> = ({
  id,
  latitude,
  longitude,
  available,
  onPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (available) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [available]);

  const pinImage = available
    ? require('@/assets/images/red-pin.png')   // glossy red pin
    : require('@/assets/images/grey-pin.png'); // static grey pin (create if needed)

  return (
    <Marker key={id} coordinate={{ latitude, longitude }} onPress={onPress}>
      <View style={styles.container}>
        {available && (
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        )}
        <Image source={pinImage} style={styles.pinImage} resizeMode="contain" />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinImage: {
    width: 40,
    height: 30,
  },
  pulseCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#EF4444', // red pulse color
    opacity: 0.3,
  },
});

export default CustomMapPin;
