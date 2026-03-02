import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { Card, Avatar, Button, StarRating } from '../components/ui';
import { bookingService } from '../services/booking.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VEHICLE_TYPES = [
  { id: 'MOTORBIKE', icon: '🏍️', label: 'Xe máy', pricePerKm: 4000, baseFare: 12000 },
  { id: 'CAR_4', icon: '🚗', label: 'Ô tô 4 chỗ', pricePerKm: 8000, baseFare: 25000 },
  { id: 'CAR_7', icon: '🚐', label: 'Ô tô 7 chỗ', pricePerKm: 10000, baseFare: 30000 },
  { id: 'LUXURY', icon: '✨', label: 'Premium', pricePerKm: 15000, baseFare: 50000 },
];

const MOCK_NEARBY_DRIVERS = [
  { id: '1', name: 'Trần Văn Bảo', vehicle: 'Honda Wave', rating: 4.8, trips: 1250, distance: 0.5, eta: '2 phút', avatar: null },
  { id: '2', name: 'Lê Thị Mai', vehicle: 'Yamaha Exciter', rating: 4.9, trips: 890, distance: 0.8, eta: '3 phút', avatar: null },
  { id: '3', name: 'Phạm Hùng', vehicle: 'Honda SH', rating: 4.7, trips: 2100, distance: 1.2, eta: '4 phút', avatar: null },
];

export const BookingScreen = ({ navigation }: any) => {
  const [pickup, setPickup] = useState('227 Nguyễn Văn Cừ, Q.5');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [step, setStep] = useState<'input' | 'select' | 'matching' | 'confirmed'>('input');

  const estimatedDistance = 5.2;
  const vehicle = VEHICLE_TYPES[selectedVehicle];
  const estimatedPrice = vehicle.baseFare + vehicle.pricePerKm * estimatedDistance;
  const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(Math.round(n)) + 'đ';

  const handleSearch = async () => {
    if (destination.trim()) {
      try {
        const estimate = await bookingService.estimate({
          pickupLat: 10.7626,
          pickupLng: 106.6822,
          pickupAddress: pickup,
          dropoffLat: 10.7769,
          dropoffLng: 106.7009,
          dropoffAddress: destination,
          vehicleType: vehicle.id,
        });
        if (estimate?.estimatedPrice) {
          // Use real estimate if available
        }
      } catch { /* use local estimate */ }
      setStep('select');
    }
  };

  const handleBook = async () => {
    setStep('matching');
    try {
      await bookingService.create({
        pickupLat: 10.7626,
        pickupLng: 106.6822,
        pickupAddress: pickup,
        dropoffLat: 10.7769,
        dropoffLng: 106.7009,
        dropoffAddress: destination,
        vehicleType: vehicle.id,
      });
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể đặt xe, thử lại sau');
      setStep('select');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ─── Map placeholder ─────────────────────────────── */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapText}>Bản đồ</Text>
          <Text style={styles.mapSubtext}>Google Maps Integration</Text>
        </View>

        {/* My location button */}
        <TouchableOpacity style={styles.myLocationBtn}>
          <Text style={{ fontSize: 18 }}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Bottom Sheet ────────────────────────────────── */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        {step === 'input' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Location inputs */}
            <View style={styles.locationInputs}>
              <View style={styles.locationDots}>
                <View style={styles.dotGreen} />
                <View style={styles.dotLine} />
                <View style={styles.dotRed} />
              </View>
              <View style={styles.locationFields}>
                <TextInput
                  style={styles.locationInput}
                  value={pickup}
                  onChangeText={setPickup}
                  placeholder="Điểm đón"
                  placeholderTextColor={Colors.gray}
                />
                <TextInput
                  style={[styles.locationInput, styles.locationInputLast]}
                  value={destination}
                  onChangeText={setDestination}
                  placeholder="Bạn muốn đi đâu?"
                  placeholderTextColor={Colors.gray}
                  autoFocus
                />
              </View>
            </View>

            {/* Recent destinations */}
            <Text style={styles.recentTitle}>Gần đây</Text>
            {['🏠 Nhà - 45 Lê Lợi, Q.1', '🏢 Văn phòng - 123 Pasteur, Q.3', '🏥 BV Chợ Rẫy - 201 Nguyễn Chí Thanh'].map(
              (place, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.recentItem}
                  onPress={() => {
                    setDestination(place.substring(2));
                    setStep('select');
                  }}
                >
                  <Text style={styles.recentIcon}>{place.substring(0, 2)}</Text>
                  <Text style={styles.recentText}>{place.substring(2)}</Text>
                </TouchableOpacity>
              ),
            )}

            <Button
              title="Tìm tài xế"
              onPress={handleSearch}
              size="large"
              disabled={!destination.trim()}
              style={{ marginTop: Spacing.l }}
            />
          </ScrollView>
        )}

        {step === 'select' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Route summary */}
            <View style={styles.routeSummary}>
              <Text style={styles.routeDistance}>📏 {estimatedDistance} km</Text>
              <Text style={styles.routeEta}>⏱️ ~{Math.round(estimatedDistance * 3)} phút</Text>
            </View>

            {/* Vehicle selection */}
            <Text style={styles.selectTitle}>Chọn loại xe</Text>
            {VEHICLE_TYPES.map((v, i) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.vehicleOption,
                  selectedVehicle === i && styles.vehicleOptionActive,
                ]}
                onPress={() => setSelectedVehicle(i)}
              >
                <Text style={styles.vehicleIcon}>{v.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vehicleName}>{v.label}</Text>
                  <Text style={styles.vehicleEta}>
                    {MOCK_NEARBY_DRIVERS[0]?.eta || '2-4 phút'}
                  </Text>
                </View>
                <Text style={styles.vehiclePrice}>
                  {formatVND(v.baseFare + v.pricePerKm * estimatedDistance)}
                </Text>
                {selectedVehicle === i && (
                  <View style={styles.vehicleCheck}>
                    <Text style={{ color: Colors.white, fontSize: 12 }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Payment method */}
            <TouchableOpacity style={styles.paymentRow}>
              <Text style={{ fontSize: 18 }}>💰</Text>
              <Text style={styles.paymentText}>Tiền mặt</Text>
              <Text style={styles.paymentChange}>Thay đổi ›</Text>
            </TouchableOpacity>

            {/* Promo */}
            <TouchableOpacity style={styles.promoRow}>
              <Text style={{ fontSize: 18 }}>🎫</Text>
              <Text style={styles.promoText}>Nhập mã ưu đãi</Text>
              <Text style={styles.promoArrow}>›</Text>
            </TouchableOpacity>

            {/* Book button */}
            <Button
              title={`Đặt ${vehicle.label} - ${formatVND(estimatedPrice)}`}
              onPress={handleBook}
              size="large"
              style={{ marginTop: Spacing.l }}
            />
          </ScrollView>
        )}

        {step === 'matching' && (
          <View style={styles.matchingContainer}>
            <View style={styles.matchingAnimation}>
              <Text style={{ fontSize: 48 }}>🔍</Text>
            </View>
            <Text style={styles.matchingTitle}>Đang tìm tài xế...</Text>
            <Text style={styles.matchingSubtext}>Thường chỉ mất 10-30 giây</Text>

            {/* Nearby drivers preview */}
            <View style={styles.driversPreview}>
              {MOCK_NEARBY_DRIVERS.map((driver) => (
                <View key={driver.id} style={styles.driverChip}>
                  <Avatar name={driver.name} size={32} />
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={styles.driverName}>{driver.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <StarRating rating={driver.rating} size={10} showValue />
                      <Text style={styles.driverDistance}>{driver.distance}km</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setStep('select')}
            >
              <Text style={styles.cancelText}>Hủy tìm kiếm</Text>
            </TouchableOpacity>

            {/* Auto-advance to confirmed after 3s */}
            <TouchableOpacity onPress={() => setStep('confirmed')}>
              <Text style={[styles.cancelText, { color: Colors.info, marginTop: 8 }]}>
                (Demo: Nhấn để xem kết quả)
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'confirmed' && (
          <View style={styles.confirmedContainer}>
            <View style={styles.confirmedHeader}>
              <Text style={styles.confirmedBadge}>✅ Đã tìm thấy tài xế!</Text>
            </View>

            {/* Driver info */}
            <Card style={styles.driverCard}>
              <View style={styles.driverInfo}>
                <Avatar name={MOCK_NEARBY_DRIVERS[0].name} size={56} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.driverFullName}>{MOCK_NEARBY_DRIVERS[0].name}</Text>
                  <Text style={styles.driverVehicle}>{MOCK_NEARBY_DRIVERS[0].vehicle}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <StarRating rating={MOCK_NEARBY_DRIVERS[0].rating} size={14} showValue />
                    <Text style={styles.driverTrips}>
                      {MOCK_NEARBY_DRIVERS[0].trips} chuyến
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.driverActions}>
                <TouchableOpacity style={styles.driverActionBtn}>
                  <Text style={{ fontSize: 20 }}>📞</Text>
                  <Text style={styles.driverActionText}>Gọi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.driverActionBtn}>
                  <Text style={{ fontSize: 20 }}>💬</Text>
                  <Text style={styles.driverActionText}>Nhắn tin</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.driverActionBtn}>
                  <Text style={{ fontSize: 20 }}>📍</Text>
                  <Text style={styles.driverActionText}>Theo dõi</Text>
                </TouchableOpacity>
              </View>
            </Card>

            {/* Trip details */}
            <View style={styles.tripDetails}>
              <View style={styles.tripRow}>
                <Text style={styles.tripLabel}>Loại xe</Text>
                <Text style={styles.tripValue}>{vehicle.icon} {vehicle.label}</Text>
              </View>
              <View style={styles.tripRow}>
                <Text style={styles.tripLabel}>Khoảng cách</Text>
                <Text style={styles.tripValue}>{estimatedDistance} km</Text>
              </View>
              <View style={styles.tripRow}>
                <Text style={styles.tripLabel}>Tổng tiền</Text>
                <Text style={[styles.tripValue, { color: Colors.gold, fontWeight: '700' }]}>
                  {formatVND(estimatedPrice)}
                </Text>
              </View>
            </View>

            <Button
              title="Hủy chuyến"
              onPress={() => setStep('input')}
              variant="destructive"
              size="large"
              style={{ marginTop: Spacing.l }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Map
  mapContainer: { flex: 1, position: 'relative' },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: { fontSize: 48 },
  mapText: { ...Typography.h2, color: Colors.success, marginTop: 8 },
  mapSubtext: { ...Typography.caption, color: Colors.gray },
  myLocationBtn: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.level2,
  },

  // Bottom sheet
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.l,
    maxHeight: '55%',
    ...Shadows.level3,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.m,
  },

  // Location inputs
  locationInputs: { flexDirection: 'row', marginBottom: Spacing.l },
  locationDots: { alignItems: 'center', marginRight: 12, paddingTop: 14 },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  dotLine: { width: 2, height: 30, backgroundColor: Colors.lightGray },
  dotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.red },
  locationFields: { flex: 1 },
  locationInput: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.m,
    ...Typography.secondary,
    color: Colors.black,
    marginBottom: 8,
  },
  locationInputLast: { marginBottom: 0 },

  // Recent
  recentTitle: { ...Typography.secondary, color: Colors.gray, fontWeight: '600', marginBottom: 8 },
  recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  recentIcon: { fontSize: 16, marginRight: 12 },
  recentText: { ...Typography.body, color: Colors.darkGray },

  // Route summary
  routeSummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingVertical: Spacing.m,
    marginBottom: Spacing.m,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.medium,
  },
  routeDistance: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },
  routeEta: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },

  // Vehicle
  selectTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.medium,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vehicleOptionActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '10' },
  vehicleIcon: { fontSize: 28, marginRight: 12 },
  vehicleName: { ...Typography.body, fontWeight: '600', color: Colors.black },
  vehicleEta: { ...Typography.caption, color: Colors.gray },
  vehiclePrice: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  vehicleCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  // Payment
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    marginTop: Spacing.m,
  },
  paymentText: { ...Typography.body, color: Colors.black, flex: 1 },
  paymentChange: { ...Typography.secondary, color: Colors.gold, fontWeight: '500' },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  promoText: { ...Typography.body, color: Colors.gray, flex: 1 },
  promoArrow: { fontSize: 18, color: Colors.gray },

  // Matching
  matchingContainer: { alignItems: 'center', paddingVertical: Spacing.xl },
  matchingAnimation: { marginBottom: Spacing.l },
  matchingTitle: { ...Typography.h2, color: Colors.black },
  matchingSubtext: { ...Typography.secondary, color: Colors.gray, marginTop: 4 },
  driversPreview: { width: '100%', marginTop: Spacing.xl, gap: Spacing.s },
  driverChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.medium,
  },
  driverName: { ...Typography.secondary, fontWeight: '600', color: Colors.black },
  driverDistance: { ...Typography.caption, color: Colors.gray },
  cancelBtn: { marginTop: Spacing.xl },
  cancelText: { ...Typography.body, color: Colors.red, fontWeight: '600' },

  // Confirmed
  confirmedContainer: {},
  confirmedHeader: { alignItems: 'center', marginBottom: Spacing.l },
  confirmedBadge: { ...Typography.h3, color: Colors.success },
  driverCard: {},
  driverInfo: { flexDirection: 'row', alignItems: 'center' },
  driverFullName: { ...Typography.h3, color: Colors.black },
  driverVehicle: { ...Typography.caption, color: Colors.gray, marginVertical: 2 },
  driverTrips: { ...Typography.caption, color: Colors.gray },
  driverActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.l,
    paddingTop: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  driverActionBtn: { alignItems: 'center' },
  driverActionText: { ...Typography.caption, color: Colors.purpleDark, marginTop: 4 },
  tripDetails: { marginTop: Spacing.l, gap: Spacing.s },
  tripRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  tripLabel: { ...Typography.secondary, color: Colors.gray },
  tripValue: { ...Typography.secondary, color: Colors.black, fontWeight: '500' },
});
