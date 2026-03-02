/**
 * DriverMapView — bản đồ dùng chung trong Dashboard và Order flow.
 *
 * Chế độ:
 *  - "driver"  : hiển thị vị trí tài xế (1 marker)
 *  - "order"   : hiển thị điểm đón + điểm trả + vị trí tài xế
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

export type LatLng = { latitude: number; longitude: number };

export type OrderPin = {
  id: string;
  pickup: LatLng;
  dropoff: LatLng;
  label?: string;
};

type Props = {
  mode: 'driver' | 'order';
  /** Danh sách đơn để hiển thị pins (chỉ dùng khi mode='order') */
  orders?: OrderPin[];
  /** Đơn đang chọn để highlight (chỉ dùng khi mode='order') */
  selectedOrderId?: string;
  /** Callback khi nhấn vào pin đơn */
  onOrderPinPress?: (orderId: string) => void;
  height?: number;
  style?: object;
};

// Tọa độ mặc định: TP.HCM
const DEFAULT_REGION: Region = {
  latitude: 10.7769,
  longitude: 106.7009,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export function DriverMapView({
  mode,
  orders = [],
  selectedOrderId,
  onOrderPinPress,
  height = 220,
  style,
}: Props) {
  const mapRef = useRef<MapView>(null);
  const [driverLocation, setDriverLocation] = useState<LatLng | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [locating, setLocating] = useState(true);

  const requestAndGetLocation = useCallback(async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        setLocating(false);
        return;
      }
      setPermissionDenied(false);
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords: LatLng = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setDriverLocation(coords);
      mapRef.current?.animateToRegion(
        { ...coords, latitudeDelta: 0.015, longitudeDelta: 0.015 },
        600,
      );
    } catch {
      setPermissionDenied(true);
    } finally {
      setLocating(false);
    }
  }, []);

  useEffect(() => {
    requestAndGetLocation();
  }, [requestAndGetLocation]);

  // Khi có orders, fit map để thấy tất cả pins
  useEffect(() => {
    if (mode === 'order' && orders.length > 0 && mapRef.current) {
      const allCoords: LatLng[] = orders.flatMap((o) => [o.pickup, o.dropoff]);
      if (driverLocation) allCoords.push(driverLocation);
      mapRef.current.fitToCoordinates(allCoords, {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: true,
      });
    }
  }, [orders, driverLocation, mode]);

  if (permissionDenied) {
    return (
      <View style={[styles.placeholder, { height }, style]}>
        <Text style={styles.placeholderIcon}>📍</Text>
        <Text style={styles.placeholderText}>Chưa cấp quyền vị trí</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={requestAndGetLocation}>
          <Text style={styles.retryText}>Cấp quyền & thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }, style]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {/* Marker vị trí tài xế */}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Vị trí của bạn"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.driverMarker}>
              <Text style={styles.driverMarkerText}>🏍️</Text>
            </View>
          </Marker>
        )}

        {/* Pins đơn hàng */}
        {mode === 'order' &&
          orders.map((order) => {
            const isSelected = order.id === selectedOrderId;
            return (
              <React.Fragment key={order.id}>
                {/* Pickup marker */}
                <Marker
                  coordinate={order.pickup}
                  onPress={() => onOrderPinPress?.(order.id)}
                  anchor={{ x: 0.5, y: 1 }}
                >
                  <View style={[styles.pinPickup, isSelected && styles.pinSelected]}>
                    <Text style={styles.pinText}>A</Text>
                  </View>
                </Marker>
                {/* Dropoff marker */}
                <Marker
                  coordinate={order.dropoff}
                  onPress={() => onOrderPinPress?.(order.id)}
                  anchor={{ x: 0.5, y: 1 }}
                >
                  <View style={[styles.pinDropoff, isSelected && styles.pinSelected]}>
                    <Text style={styles.pinText}>B</Text>
                  </View>
                </Marker>
                {/* Đường nối pickup → dropoff cho đơn đang chọn */}
                {isSelected && (
                  <Polyline
                    coordinates={[order.pickup, order.dropoff]}
                    strokeColor={Colors.gold}
                    strokeWidth={3}
                    lineDashPattern={[8, 4]}
                  />
                )}
              </React.Fragment>
            );
          })}
      </MapView>

      {/* Nút định vị lại */}
      <TouchableOpacity
        style={styles.locateBtn}
        onPress={requestAndGetLocation}
        disabled={locating}
      >
        {locating ? (
          <ActivityIndicator size="small" color={Colors.purpleDark} />
        ) : (
          <Text style={styles.locateBtnText}>◎</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    backgroundColor: Colors.offWhite,
    ...Shadows.level1,
  },
  placeholder: {
    borderRadius: BorderRadius.large,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.level1,
  },
  placeholderIcon: { fontSize: 32 },
  placeholderText: { ...Typography.body, color: Colors.gray },
  retryBtn: {
    marginTop: 4,
    paddingHorizontal: Spacing.l,
    paddingVertical: 8,
    backgroundColor: Colors.purpleDark,
    borderRadius: BorderRadius.medium,
  },
  retryText: { ...Typography.caption, color: Colors.white, fontWeight: '600' },

  driverMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.purpleDark,
    ...Platform.select({ android: { elevation: 4 } }),
  },
  driverMarkerText: { fontSize: 20 },

  pinPickup: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  pinDropoff: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  pinSelected: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: Colors.gold,
  },
  pinText: { color: Colors.white, fontSize: 11, fontWeight: '700' },

  locateBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.level2,
  },
  locateBtnText: { fontSize: 20, color: Colors.purpleDark },
});
