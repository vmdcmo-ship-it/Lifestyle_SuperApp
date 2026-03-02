import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { FINDNEAR_CATEGORIES } from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MOCK_NEARBY_PLACES = [
  { id: 'p1', name: 'Trạm sạc VinFast - Vạn Hạnh', category: 'ev_charging', distance: '0.3 km', rating: 4.8, status: 'Đang mở', statusColor: Colors.success, detail: '4/6 cổng sạc khả dụng' },
  { id: 'p2', name: 'Nhà thuốc Long Châu - Nguyễn Văn Cừ', category: 'pharmacy', distance: '0.5 km', rating: 4.6, status: 'Đang mở', statusColor: Colors.success, detail: 'Mở đến 22:00' },
  { id: 'p3', name: 'Phòng khám Đa khoa SaiGon', category: 'clinic', distance: '0.8 km', rating: 4.4, status: 'Đang mở', statusColor: Colors.success, detail: 'Thời gian chờ: ~15 phút' },
  { id: 'p4', name: 'Cà phê Võng Sài Gòn Xưa', category: 'cafe_hammock', distance: '1.1 km', rating: 4.7, status: 'Đang mở', statusColor: Colors.success, detail: 'Võng + cà phê từ 25K' },
  { id: 'p5', name: 'Trạm xăng Petrolimex Q5', category: 'gas_station', distance: '0.4 km', rating: 4.2, status: 'Đang mở', statusColor: Colors.success, detail: 'RON 95, E5 RON 92' },
];

export const FindNearScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  const filteredPlaces = selectedCategory
    ? MOCK_NEARBY_PLACES.filter((p) => p.category === selectedCategory)
    : MOCK_NEARBY_PLACES;

  const selectedCatInfo = FINDNEAR_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.black }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FindNear</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 20 }}>🗺️</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm dịch vụ gần bạn..."
            placeholderTextColor={Colors.gray}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={{ fontSize: 14, color: Colors.gray }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Location banner */}
        <View style={styles.locationBanner}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationTitle}>Vị trí hiện tại</Text>
            <Text style={styles.locationAddr}>227 Nguyễn Văn Cừ, Quận 5, TP.HCM</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.locationChange}>Đổi</Text>
          </TouchableOpacity>
        </View>

        {/* Category grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục dịch vụ</Text>
          <View style={styles.categoryGrid}>
            {FINDNEAR_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryCard, isActive && { borderColor: cat.color, borderWidth: 2 }]}
                  onPress={() =>
                    setSelectedCategory(isActive ? null : cat.id)
                  }
                >
                  <View style={[styles.categoryIconWrap, { backgroundColor: cat.color + '15' }]}>
                    <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                  </View>
                  <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                  <Text style={styles.categoryCount}>{cat.count} gần đây</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Subscription info */}
        <View style={styles.subscriptionBanner}>
          <Text style={styles.subEmoji}>⭐</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.subTitle}>FindNear Premium</Text>
            <Text style={styles.subDesc}>
              Nhận thông báo khi có dịch vụ mới, ưu đãi độc quyền, đặt lịch trước
            </Text>
          </View>
          <TouchableOpacity style={styles.subBtn}>
            <Text style={styles.subBtnText}>29K/tháng</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby results */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCatInfo ? selectedCatInfo.name : 'Tất cả'} gần bạn
            </Text>
            <Text style={styles.resultCount}>{filteredPlaces.length} kết quả</Text>
          </View>

          {filteredPlaces.map((place) => {
            const catInfo = FINDNEAR_CATEGORIES.find((c) => c.id === place.category);
            return (
              <TouchableOpacity key={place.id} style={styles.placeCard}>
                <View style={[styles.placeIconWrap, { backgroundColor: (catInfo?.color || Colors.gray) + '15' }]}>
                  <Text style={styles.placeEmoji}>{catInfo?.icon || '📍'}</Text>
                </View>
                <View style={styles.placeContent}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeDetail}>{place.detail}</Text>
                  <View style={styles.placeMeta}>
                    <Text style={[styles.placeStatus, { color: place.statusColor }]}>
                      ● {place.status}
                    </Text>
                    <Text style={styles.placeDistance}>📏 {place.distance}</Text>
                    <Text style={styles.placeRating}>⭐ {place.rating}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.placeNavBtn}>
                  <Text style={styles.placeNavIcon}>🧭</Text>
                  <Text style={styles.placeNavText}>Đi</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          {filteredPlaces.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>
                Không tìm thấy dịch vụ trong khu vực này
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.l,
    backgroundColor: Colors.white,
  },
  headerTitle: { ...Typography.h2, color: Colors.black },

  searchWrap: { paddingHorizontal: Spacing.l, paddingBottom: Spacing.m, backgroundColor: Colors.white },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.m,
    height: 44,
  },
  searchInput: { flex: 1, ...Typography.body, color: Colors.black },

  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    padding: Spacing.l,
    borderRadius: BorderRadius.large,
    ...Shadows.level1,
    gap: Spacing.m,
  },
  locationIcon: { fontSize: 24 },
  locationTitle: { ...Typography.caption, color: Colors.gray },
  locationAddr: { ...Typography.secondary, color: Colors.black, fontWeight: '500', marginTop: 2 },
  locationChange: { ...Typography.secondary, color: Colors.gold, fontWeight: '600' },

  section: { paddingHorizontal: Spacing.l, marginTop: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  resultCount: { ...Typography.caption, color: Colors.gray },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 32 - 16) / 3,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.m,
    alignItems: 'center',
    ...Shadows.level1,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryEmoji: { fontSize: 22 },
  categoryName: { ...Typography.caption, color: Colors.black, fontWeight: '600', textAlign: 'center' },
  categoryCount: { ...Typography.tiny, color: Colors.gray, marginTop: 2 },

  subscriptionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.purpleDark,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.xl,
    padding: Spacing.l,
    borderRadius: BorderRadius.large,
    gap: Spacing.m,
  },
  subEmoji: { fontSize: 28 },
  subTitle: { ...Typography.body, color: Colors.gold, fontWeight: '700' },
  subDesc: { ...Typography.caption, color: Colors.silver, marginTop: 2, lineHeight: 16 },
  subBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.medium,
  },
  subBtnText: { ...Typography.caption, color: Colors.purpleDark, fontWeight: '700' },

  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.s,
    ...Shadows.level1,
    gap: Spacing.m,
  },
  placeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeEmoji: { fontSize: 22 },
  placeContent: { flex: 1 },
  placeName: { ...Typography.secondary, fontWeight: '600', color: Colors.black },
  placeDetail: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  placeMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  placeStatus: { ...Typography.tiny, fontWeight: '600' },
  placeDistance: { ...Typography.tiny, color: Colors.gray },
  placeRating: { ...Typography.tiny, color: Colors.gold, fontWeight: '600' },
  placeNavBtn: {
    alignItems: 'center',
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.medium,
  },
  placeNavIcon: { fontSize: 18 },
  placeNavText: { ...Typography.tiny, color: Colors.gold, fontWeight: '700', marginTop: 2 },

  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.m },
  emptyText: { ...Typography.body, color: Colors.gray, textAlign: 'center' },
});
