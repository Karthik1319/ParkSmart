import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { GestureHandlerStateChangeEvent, PanGestureHandler, State } from 'react-native-gesture-handler';

type SliderProps = {
  value: number;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  onValueChange: (value: number) => void;
};

export default function Slider({
  value,
  minimumValue,
  maximumValue,
  step = 1,
  onValueChange,
}: SliderProps) {
  const { theme } = useTheme();
  
  const [sliderWidth, setSliderWidth] = useState(0);
  
  // Animation values
  const position = new Animated.Value(
    ((value - minimumValue) / (maximumValue - minimumValue)) * sliderWidth
  );
  
  // Calculate the width of the filled track
  const width = sliderWidth > 0
    ? position.interpolate({
        inputRange: [0, sliderWidth],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
      })
  : 0;

  // Update position when slider width changes
  React.useEffect(() => {
    if (sliderWidth > 0) {
      const newPosition = ((value - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;
      position.setValue(newPosition);
    }
  }, [sliderWidth, value, minimumValue, maximumValue]);
  
  // Handle gesture event
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { x: position } }],
    { useNativeDriver: false }
  );
  
  // Handle gesture state change
  const onHandlerStateChange = (event: GestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.END) {
        let newX = event.nativeEvent.x as number;

        // Clamp position
        newX = Math.max(0, Math.min(newX, sliderWidth));

        // Calculate value based on position
        let rawValue = ((newX / sliderWidth) * (maximumValue - minimumValue)) + minimumValue;

        // Apply step if provided
        if (step) {
        rawValue = Math.round(rawValue / step) * step;
        }

        // Ensure value is within range
        const newValue = Math.max(minimumValue, Math.min(rawValue, maximumValue));

        // Update position to match stepped value
        const steppedPosition = ((newValue - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;
        position.setValue(steppedPosition);

        // Call callback
        onValueChange(newValue);
    }
  };
  
  return (
    <View 
      style={styles.container}
      onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width - 24)} // Account for thumb size
    >
      {/* Background track */}
      <View 
        style={[
          styles.track, 
          { backgroundColor: theme.neutral[300] }
        ]} 
      />
      
      {/* Filled track */}
      <Animated.View 
        style={[
          styles.fill, 
          { 
            backgroundColor: theme.primary.default,
            width 
          }
        ]} 
      />
      
      {/* Thumb */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View 
          style={[
            styles.thumb, 
            { 
              backgroundColor: theme.background.primary,
              borderColor: theme.primary.default,
              transform: [{ translateX: position }] 
            }
          ]} 
        />
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  fill: {
    position: 'absolute',
    height: 4,
    left: 0,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});