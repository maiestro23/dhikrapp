import React from 'react';
import { View, StyleSheet } from 'react-native';

type PaginationDotsProps = {
  count: number;
  activeIndex: number;
  activeColor?: string;
  inactiveColor?: string;
};

export function PaginationDots({ 
  count, 
  activeIndex, 
  activeColor = '#8E1A3B', 
  inactiveColor = '#CCCCCC' 
}: PaginationDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex 
              ? [styles.activeDot, { backgroundColor: activeColor }] 
              : [styles.inactiveDot, { backgroundColor: inactiveColor }],
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inactiveDot: {
  },
});