import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
type TabKey = 'hotspots' | 'musttry';

// ─── Hot Spots Data (Điểm HOT + Voucher) ────────────────────────────────────

const HOTSPOTS = [
  {
    id: 'h1',
    name: 'Đại học Bách Khoa TP.HCM',
    type: 'Trường học',
    typeIcon: '🎓',
    address: '268 Lý Thường Kiệt, Quận 10',
    visitors: '~12,000 người/ngày',
    discount: 15,
    voucherCode: 'LOCAL-BK15',
    trending: true,
  },
  {
    id: 'h2',
    name: 'Bến xe Miền Đông mới',
    type: 'Bến xe',
    typeIcon: '🚌',
    address: 'Xa lộ Hà Nội, TP. Thủ Đức',
    visitors: '~25,000 người/ngày',
    discount: 20,
    voucherCode: 'LOCAL-BXMD20',
    trending: true,
  },
  {
    id: 'h3',
    name: 'AEON Mall Tân Phú',
    type: 'TTTM',
    typeIcon: '🏬',
    address: '30 Bờ Bao Tân Thắng, Tân Phú',
    visitors: '~35,000 người/ngày',
    discount: 10,
    voucherCode: 'LOCAL-AEON10',
    trending: false,
  },
  {
    id: 'h4',
    name: 'Bệnh viện Chợ Rẫy',
    type: 'Bệnh viện',
    typeIcon: '🏥',
    address: '201 Nguyễn Chí Thanh, Quận 5',
    visitors: '~8,000 người/ngày',
    discount: 15,
    voucherCode: 'LOCAL-CR15',
    trending: false,
  },
  {
    id: 'h5',
    name: 'Chợ Bến Thành',
    type: 'Chợ / Du lịch',
    typeIcon: '🏛️',
    address: 'Quận 1, TP.HCM',
    visitors: '~20,000 người/ngày',
    discount: 10,
    voucherCode: 'LOCAL-BT10',
    trending: true,
  },
  {
    id: 'h6',
    name: 'Sân bay Tân Sơn Nhất',
    type: 'Sân bay',
    typeIcon: '✈️',
    address: 'Tân Bình, TP.HCM',
    visitors: '~100,000 người/ngày',
    discount: 20,
    voucherCode: 'LOCAL-TSN20',
    trending: true,
  },
];

// ─── Must Try Data (Tour Guide / Gợi ý cho du khách) ────────────────────────

type MustTryCategory = 'all' | 'landmark' | 'food' | 'cafe' | 'nightlife';

const MUSTTRY_FILTERS: { key: MustTryCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'Tất cả', icon: '✨' },
  { key: 'landmark', label: 'Danh lam', icon: '🏛️' },
  { key: 'food', label: 'Quán ngon', icon: '🍜' },
  { key: 'cafe', label: 'Cà phê chill', icon: '☕' },
  { key: 'nightlife', label: 'Về đêm', icon: '🌙' },
];

const MUSTTRY_PLACES = [
  {
    id: 'm1',
    name: 'Nhà thờ Đức Bà',
    category: 'landmark' as MustTryCategory,
    rating: 4.9,
    reviews: 12500,
    address: 'Quận 1, TP.HCM',
    desc: 'Biểu tượng kiến trúc 140 năm tuổi, must-see khi đến Sài Gòn.',
    tags: ['check-in', 'lịch sử', 'kiến trúc'],
    coverImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80',
    fallbackColor: '#E17055',
    creatorName: 'SaiGon Explorer',
    isFeatured: true,
  },
  {
    id: 'm2',
    name: 'Bánh mì Huỳnh Hoa',
    category: 'food' as MustTryCategory,
    rating: 4.7,
    reviews: 8900,
    address: '26 Lê Thị Riêng, Quận 1',
    desc: 'Bánh mì huyền thoại SG, xếp hàng 30 phút nhưng xứng đáng!',
    tags: ['street food', 'huyền thoại', 'bánh mì'],
    coverImage: 'https://images.unsplash.com/photo-1600454021915-de59f1ed8a02?w=600&q=80',
    fallbackColor: '#FDCB6E',
    creatorName: 'Food Review VN',
    isFeatured: true,
  },
  {
    id: 'm3',
    name: 'The Café Apartment',
    category: 'cafe' as MustTryCategory,
    rating: 4.6,
    reviews: 6700,
    address: '42 Nguyễn Huệ, Quận 1',
    desc: 'Chung cư cà phê nổi tiếng nhất SG. Mỗi tầng một quán, view phố đi bộ.',
    tags: ['aesthetic', 'check-in', 'view đẹp'],
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
    fallbackColor: '#55EFC4',
    creatorName: 'Café Hunter',
    isFeatured: true,
  },
  {
    id: 'm4',
    name: 'Bùi Viện Walking Street',
    category: 'nightlife' as MustTryCategory,
    rating: 4.4,
    reviews: 15200,
    address: 'Phạm Ngũ Lão, Quận 1',
    desc: 'Phố Tây sôi động nhất Sài Gòn. Bia, live music và backpacker vibe.',
    tags: ['nightlife', 'phố tây', 'sôi động'],
    coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80',
    fallbackColor: '#6C5CE7',
    creatorName: 'NightOwl SG',
    isFeatured: false,
  },
  {
    id: 'm5',
    name: 'Phở Hòa Pasteur',
    category: 'food' as MustTryCategory,
    rating: 4.5,
    reviews: 5400,
    address: '260C Pasteur, Quận 3',
    desc: 'Phở bò nổi tiếng từ 1968. Nước dùng trong vắt, thịt mềm thơm.',
    tags: ['phở', 'truyền thống', 'phải thử'],
    coverImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80',
    fallbackColor: '#FF6B6B',
    creatorName: 'Foodie Sài Gòn',
    isFeatured: false,
  },
  {
    id: 'm6',
    name: 'Landmark 81 Skyview',
    category: 'landmark' as MustTryCategory,
    rating: 4.8,
    reviews: 9800,
    address: '208 Nguyễn Hữu Cảnh, Bình Thạnh',
    desc: 'Tòa nhà cao nhất VN. Đài quan sát tầng 79, view 360° cả thành phố.',
    tags: ['view 360°', 'cao nhất VN', 'hiện đại'],
    coverImage: 'https://images.unsplash.com/photo-1571366343168-631c5bcca7a4?w=600&q=80',
    fallbackColor: '#0984E3',
    creatorName: 'Travel Việt',
    isFeatured: true,
  },
  {
    id: 'm7',
    name: 'Cà phê Rooftop Chill Out',
    category: 'cafe' as MustTryCategory,
    rating: 4.7,
    reviews: 3200,
    address: 'Quận 2, TP.HCM',
    desc: 'View sông Sài Gòn cực đẹp lúc hoàng hôn. Không gian mở, gió mát.',
    tags: ['rooftop', 'sunset', 'chill'],
    coverImage: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80',
    fallbackColor: '#FAB1A0',
    creatorName: 'Chill Spots SG',
    isFeatured: false,
  },
  {
    id: 'm8',
    name: 'Bún chả 145 Bùi Viện',
    category: 'food' as MustTryCategory,
    rating: 4.6,
    reviews: 4100,
    address: '145 Bùi Viện, Quận 1',
    desc: 'Bún chả kiểu Hà Nội ngay giữa Sài Gòn. Nướng than hoa thơm phức.',
    tags: ['bún chả', 'hà nội', 'nướng than'],
    coverImage: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&q=80',
    fallbackColor: '#E17055',
    creatorName: 'Street Food Hunter',
    isFeatured: false,
  },
];

// ─── City selector ──────────────────────────────────────────────────────────

const CITIES = [
  { id: 'hcm', name: 'TP.HCM', active: true },
  { id: 'hn', name: 'Hà Nội', active: false },
  { id: 'dn', name: 'Đà Nẵng', active: false },
  { id: 'dl', name: 'Đà Lạt', active: false },
  { id: 'pq', name: 'Phú Quốc', active: false },
];

// ═══════════════════════════════════════════════════════════════════════════════

export const LifestyleLocalScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<TabKey>('hotspots');
  const [selectedCity, setSelectedCity] = useState('hcm');
  const [mustTryFilter, setMustTryFilter] = useState<MustTryCategory>('all');

  const filteredMustTry =
    mustTryFilter === 'all'
      ? MUSTTRY_PLACES
      : MUSTTRY_PLACES.filter((p) => p.category === mustTryFilter);

  const featuredMustTry = MUSTTRY_PLACES.filter((p) => p.isFeatured);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ─── Header ──────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.black }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: Spacing.m }}>
          <Text style={styles.headerTitle}>Lifestyle Local</Text>
          <Text style={styles.headerSubtitle}>Khám phá như người bản địa</Text>
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: 20 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* ─── City Selector ───────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cityScroll}
        contentContainerStyle={styles.cityContainer}
      >
        {CITIES.map((city) => (
          <TouchableOpacity
            key={city.id}
            style={[styles.cityChip, selectedCity === city.id && styles.cityChipActive]}
            onPress={() => setSelectedCity(city.id)}
          >
            <Text style={[styles.cityText, selectedCity === city.id && styles.cityTextActive]}>
              📍 {city.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ─── Tab Switcher ────────────────────────────────── */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'hotspots' && styles.tabActive]}
          onPress={() => setActiveTab('hotspots')}
        >
          <Text style={[styles.tabText, activeTab === 'hotspots' && styles.tabTextActive]}>
            🔥 Điểm HOT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'musttry' && styles.tabActive]}
          onPress={() => setActiveTab('musttry')}
        >
          <Text style={[styles.tabText, activeTab === 'musttry' && styles.tabTextActive]}>
            🌟 Must Try
          </Text>
        </TouchableOpacity>
      </View>

      {/* ═══ TAB: Điểm HOT ══════════════════════════════ */}
      {activeTab === 'hotspots' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Voucher banner */}
          <View style={styles.voucherBanner}>
            <Text style={styles.voucherEmoji}>🎫</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.voucherTitle}>Voucher di chuyển đến Điểm HOT</Text>
              <Text style={styles.voucherDesc}>
                Giảm 10-20% phí di chuyển khi đặt xe đến các điểm đông người
              </Text>
            </View>
          </View>

          {/* Trending */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Đang thịnh hành</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={HOTSPOTS.filter((h) => h.trending)}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: Spacing.l }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.trendingCard}>
                  <View style={styles.trendingHeader}>
                    <Text style={styles.trendingTypeIcon}>{item.typeIcon}</Text>
                    <View style={styles.discountTag}>
                      <Text style={styles.discountText}>-{item.discount}%</Text>
                    </View>
                  </View>
                  <Text style={styles.trendingName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.trendingType}>{item.type}</Text>
                  <Text style={styles.trendingVisitors}>{item.visitors}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* All hotspots */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tất cả Điểm HOT</Text>
            {HOTSPOTS.map((spot) => (
              <TouchableOpacity key={spot.id} style={styles.hotspotCard}>
                <View style={styles.hotspotIconWrap}>
                  <Text style={styles.hotspotIcon}>{spot.typeIcon}</Text>
                </View>
                <View style={styles.hotspotContent}>
                  <Text style={styles.hotspotName}>{spot.name}</Text>
                  <Text style={styles.hotspotAddress}>{spot.address}</Text>
                  <View style={styles.hotspotMeta}>
                    <Text style={styles.hotspotVisitors}>👥 {spot.visitors}</Text>
                  </View>
                </View>
                <View style={styles.hotspotVoucher}>
                  <Text style={styles.hotspotDiscountText}>-{spot.discount}%</Text>
                  <TouchableOpacity style={styles.claimBtn}>
                    <Text style={styles.claimBtnText}>Lấy mã</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* ═══ TAB: Must Try ═══════════════════════════════ */}
      {activeTab === 'musttry' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Category filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            {MUSTTRY_FILTERS.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, mustTryFilter === f.key && styles.filterChipActive]}
                onPress={() => setMustTryFilter(f.key)}
              >
                <Text style={styles.filterIcon}>{f.icon}</Text>
                <Text
                  style={[styles.filterLabel, mustTryFilter === f.key && styles.filterLabelActive]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured carousel */}
          {mustTryFilter === 'all' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⭐ Nổi bật tại {CITIES.find((c) => c.id === selectedCity)?.name}</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={featuredMustTry}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: Spacing.l }}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.featuredCard} activeOpacity={0.85}>
                    <ImageBackground
                      source={{ uri: item.coverImage }}
                      style={[styles.featuredThumb, { backgroundColor: item.fallbackColor }]}
                      imageStyle={styles.featuredThumbImage}
                      resizeMode="cover"
                    >
                      <View style={styles.featuredOverlay}>
                        <View style={styles.featuredCreatorRow}>
                          <View style={styles.creatorBadge}>
                            <Text style={styles.creatorBadgeText}>📸 {item.creatorName}</Text>
                          </View>
                        </View>
                        <View style={styles.featuredRatingBadge}>
                          <Text style={styles.featuredRating}>⭐ {item.rating}</Text>
                        </View>
                      </View>
                    </ImageBackground>
                    <View style={styles.featuredInfo}>
                      <Text style={styles.featuredName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.featuredDesc} numberOfLines={2}>{item.desc}</Text>
                      <View style={styles.featuredTags}>
                        {item.tags.slice(0, 2).map((tag, i) => (
                          <Text key={i} style={styles.featuredTag}>#{tag}</Text>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* All must-try list */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {mustTryFilter === 'all' ? 'Phải thử khi đến đây' : MUSTTRY_FILTERS.find((f) => f.key === mustTryFilter)?.label}
            </Text>
            {filteredMustTry.map((place, index) => (
              <TouchableOpacity key={place.id} style={styles.mustTryCard} activeOpacity={0.85}>
                <View style={styles.mustTryRank}>
                  <Text style={styles.mustTryRankText}>{index + 1}</Text>
                </View>
                <View style={[styles.mustTryThumbWrap, { backgroundColor: place.fallbackColor }]}>
                  <Image
                    source={{ uri: place.coverImage }}
                    style={styles.mustTryThumbImg}
                    resizeMode="cover"
                  />
                  <View style={styles.mustTryCatBadge}>
                    <Text style={styles.mustTryCatIcon}>
                      {MUSTTRY_FILTERS.find((f) => f.key === place.category)?.icon}
                    </Text>
                  </View>
                </View>
                <View style={styles.mustTryContent}>
                  <Text style={styles.mustTryName}>{place.name}</Text>
                  <Text style={styles.mustTryAddress}>{place.address}</Text>
                  <View style={styles.mustTryMeta}>
                    <Text style={styles.mustTryRating}>⭐ {place.rating}</Text>
                    <Text style={styles.mustTryReviews}>
                      {place.reviews > 1000
                        ? (place.reviews / 1000).toFixed(1) + 'K'
                        : place.reviews}{' '}
                      đánh giá
                    </Text>
                  </View>
                  <View style={styles.mustTryTagsRow}>
                    {place.tags.map((tag, i) => (
                      <Text key={i} style={styles.mustTryTag}>#{tag}</Text>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contribute CTA */}
          <View style={styles.contributeBanner}>
            <Text style={styles.contributeEmoji}>📝</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.contributeTitle}>Bạn là Local tại đây?</Text>
              <Text style={styles.contributeDesc}>
                Chia sẻ địa điểm yêu thích và nhận Xu thưởng từ Lifestyle!
              </Text>
            </View>
            <TouchableOpacity style={styles.contributeBtn}>
              <Text style={styles.contributeBtnText}>Đóng góp</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
    backgroundColor: Colors.white,
  },
  headerTitle: { ...Typography.h2, color: Colors.black },
  headerSubtitle: { ...Typography.caption, color: Colors.gold, fontStyle: 'italic', marginTop: 1 },

  // City selector
  cityScroll: { backgroundColor: Colors.white, maxHeight: 50 },
  cityContainer: { paddingHorizontal: Spacing.l, gap: 8, paddingBottom: Spacing.m },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.offWhite,
  },
  cityChipActive: { backgroundColor: Colors.gold },
  cityText: { ...Typography.secondary, color: Colors.gray, fontWeight: '500' },
  cityTextActive: { color: Colors.purpleDark, fontWeight: '700' },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.m,
    gap: Spacing.m,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.offWhite,
  },
  tabActive: { backgroundColor: Colors.purpleDark },
  tabText: { ...Typography.secondary, color: Colors.gray, fontWeight: '600' },
  tabTextActive: { color: Colors.white },

  // Voucher banner
  voucherBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold + '15',
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    padding: Spacing.l,
    borderRadius: BorderRadius.large,
    gap: Spacing.m,
  },
  voucherEmoji: { fontSize: 32 },
  voucherTitle: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  voucherDesc: { ...Typography.caption, color: Colors.darkGray, marginTop: 2, lineHeight: 16 },

  // Section
  section: { marginTop: Spacing.xl, paddingHorizontal: Spacing.l },
  sectionTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },

  // Trending cards
  trendingCard: {
    width: 150,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.m,
    marginRight: Spacing.m,
    ...Shadows.level2,
  },
  trendingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  trendingTypeIcon: { fontSize: 28 },
  discountTag: {
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: { ...Typography.caption, color: Colors.white, fontWeight: '800' },
  trendingName: { ...Typography.secondary, fontWeight: '700', color: Colors.black },
  trendingType: { ...Typography.caption, color: Colors.gold, fontWeight: '500', marginTop: 2 },
  trendingVisitors: { ...Typography.tiny, color: Colors.gray, marginTop: 4 },

  // Hotspot list
  hotspotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.s,
    ...Shadows.level1,
    gap: Spacing.m,
  },
  hotspotIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gold + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotspotIcon: { fontSize: 22 },
  hotspotContent: { flex: 1 },
  hotspotName: { ...Typography.secondary, fontWeight: '600', color: Colors.black },
  hotspotAddress: { ...Typography.caption, color: Colors.gray, marginTop: 1 },
  hotspotMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  hotspotVisitors: { ...Typography.tiny, color: Colors.gray },
  hotspotVoucher: { alignItems: 'center' },
  hotspotDiscountText: { ...Typography.h3, color: Colors.red, fontWeight: '800' },
  claimBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  claimBtnText: { ...Typography.tiny, color: Colors.purpleDark, fontWeight: '700' },

  // Must-try filters
  filterContainer: { paddingHorizontal: Spacing.l, paddingVertical: Spacing.m, gap: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    gap: 4,
    ...Shadows.level1,
  },
  filterChipActive: { backgroundColor: Colors.purpleDark },
  filterIcon: { fontSize: 14 },
  filterLabel: { ...Typography.secondary, color: Colors.darkGray, fontWeight: '500' },
  filterLabelActive: { color: Colors.white, fontWeight: '700' },

  // Featured carousel
  featuredCard: {
    width: 240,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    marginRight: Spacing.m,
    ...Shadows.level2,
  },
  featuredThumb: {
    height: 160,
    justifyContent: 'space-between',
  },
  featuredThumbImage: {
    borderTopLeftRadius: BorderRadius.large,
    borderTopRightRadius: BorderRadius.large,
  },
  featuredOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.s,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  featuredCreatorRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  creatorBadge: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  creatorBadgeText: {
    ...Typography.tiny,
    color: Colors.white,
    fontWeight: '600',
  },
  featuredRatingBadge: {
    alignSelf: 'flex-end',
  },
  featuredRating: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  featuredInfo: { padding: Spacing.m },
  featuredName: { ...Typography.body, fontWeight: '700', color: Colors.black },
  featuredDesc: { ...Typography.caption, color: Colors.gray, marginTop: 4, lineHeight: 16 },
  featuredTags: { flexDirection: 'row', gap: 6, marginTop: 6 },
  featuredTag: { ...Typography.tiny, color: Colors.gold, fontWeight: '500' },

  // Must try list
  mustTryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.m,
    marginBottom: Spacing.s,
    ...Shadows.level1,
    gap: Spacing.m,
  },
  mustTryRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mustTryRankText: { ...Typography.caption, color: Colors.purpleDark, fontWeight: '800' },
  mustTryThumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  mustTryThumbImg: {
    width: '100%',
    height: '100%',
  },
  mustTryCatBadge: {
    position: 'absolute' as const,
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    width: 22,
    height: 22,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  mustTryCatIcon: { fontSize: 12 },
  mustTryContent: { flex: 1 },
  mustTryName: { ...Typography.secondary, fontWeight: '600', color: Colors.black },
  mustTryAddress: { ...Typography.caption, color: Colors.gray, marginTop: 1 },
  mustTryMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  mustTryRating: { ...Typography.tiny, color: Colors.gold, fontWeight: '700' },
  mustTryReviews: { ...Typography.tiny, color: Colors.gray },
  mustTryTagsRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  mustTryTag: { ...Typography.tiny, color: Colors.info, fontWeight: '500' },

  // Contribute
  contributeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.xl,
    padding: Spacing.l,
    borderRadius: BorderRadius.large,
    ...Shadows.level2,
    gap: Spacing.m,
  },
  contributeEmoji: { fontSize: 28 },
  contributeTitle: { ...Typography.body, fontWeight: '700', color: Colors.black },
  contributeDesc: { ...Typography.caption, color: Colors.gray, marginTop: 2, lineHeight: 16 },
  contributeBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.medium,
  },
  contributeBtnText: { ...Typography.secondary, color: Colors.purpleDark, fontWeight: '700' },
});
