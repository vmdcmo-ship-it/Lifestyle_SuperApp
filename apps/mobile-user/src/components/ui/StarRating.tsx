import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 16,
  showValue = false,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <Text
          key={i}
          style={{
            fontSize: size,
            color: i < Math.floor(rating) ? Colors.gold : Colors.lightGray,
          }}
        >
          ★
        </Text>
      ))}
      {showValue && (
        <Text style={styles.value}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  value: { marginLeft: 4, fontSize: 14, color: Colors.darkGray, fontWeight: '600' },
});
