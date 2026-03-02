import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from '../../theme';

interface AvatarProps {
  uri?: string | null;
  name: string;
  size?: number;
  verified?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 40,
  verified = false,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <View style={{ position: 'relative' }}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: Colors.gold,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              { fontSize: size * 0.4 },
            ]}
          >
            {initials}
          </Text>
        </View>
      )}
      {verified && (
        <View style={[styles.badge, { right: -2, bottom: -2 }]}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: { resizeMode: 'cover' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  initials: { color: Colors.purpleDark, fontWeight: '700' },
  badge: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.info,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  checkmark: { color: Colors.white, fontSize: 8, fontWeight: '700' },
});
