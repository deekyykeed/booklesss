import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface RingProps {
  percentage?: number;
  size?: number;
}

export default function Ring({ percentage, size = 16 }: RingProps) {
  // Generate random completion percentage if not provided
  const [randomPercentage] = useState(() => 
    percentage ?? Math.floor(Math.random() * 100)
  );
  
  const strokeWidth = 1.7;
  const ringDiameter = 14;
  const center = size / 2;
  const radius = ringDiameter / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke dash offset for the progress
  const strokeDashoffset = circumference - (randomPercentage / 100) * circumference;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Progress ring */}
        {randomPercentage > 0 && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#000000"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

