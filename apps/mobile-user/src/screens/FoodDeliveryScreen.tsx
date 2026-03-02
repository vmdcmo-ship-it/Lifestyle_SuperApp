import React, { useState, useMemo, useEffect } from 'react';
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
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import {
  MOCK_RESTAURANTS,
  FOOD_CATEGORIES,
  FOOD_PROMOS,
  type FoodCategory,
} from '../data/mockData';
import { useCart } from '../contexts/CartContext';
import { merchantsService } from '../services/merchants.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const FoodDeliveryScreen = ({ navigation }: any) => {
  const { totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'distance' | 'delivery'>('default');
  const [restaurants, setRestaurants] = useState<any[]>(MOCK_RESTAURANTS);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoadingAPI(true);
      try {
        const res = await merchantsService.list({ type: 'RESTAURANT', limit: 50 });
        if (res?.data && res.data.length > 0) {
          const mapped = res.data.map((m: any) => ({
            id: m.id,
            name: m.name,
            category: 'com' as FoodCategory,
            rating: m.rating || 4.5,
            reviewCount: m.reviewCount || 0,
            distance: 1.0,
            deliveryTime: '25-35 phút',
            deliveryFee: 15000,
            minOrder: 30000,
            priceRange: '$$',
            tags: [m.type],
            image: m.imageUrl || null,
            isFeatured: false,
            isPartner: true,
            promos: [],
            address: m.fullAddress || '',
          }));
          setRestaurants(mapped);
        }
      } catch {
        // Keep mock data as fallback
      } finally {
        setIsLoadingAPI(false);
      }
    })();
  }, []);

  const filteredRestaurants = useMemo(() => {
    let list = restaurants;

    if (selectedCategory !== 'all') {
      list = list.filter((r) => r.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'distance') list = [...list].sort((a, b) => a.distance - b.distance);
    else if (sortBy === 'delivery') {
      list = [...list].sort(
        (a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime),
      );
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  const featuredRestaurants = restaurants.filter((r: any) => r.isFeatured);

  const formatPrice = (n: number) =>
    n >= 1000 ? new Intl.NumberFormat('vi-VN').format(n) + 'đ' : n + 'đ';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Giao thức ăn</Text>
          <Text style={styles.headerSubtitle}>📍 Quận 1, TP.HCM • 30 phút</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation?.navigate('Cart')}>
          <Text style={styles.cartIcon}>🛒</Text>
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm quán ăn, món ăn..."
            placeholderTextColor={Colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {FOOD_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryChip,
                selectedCategory === cat.key && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === cat.key && styles.categoryLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promotions Banner */}
        {selectedCategory === 'all' && (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={FOOD_PROMOS}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.promoScroll}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.promoCard, { backgroundColor: item.color }]}
                activeOpacity={0.85}
              >
                <Text style={styles.promoIcon}>{item.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.promoTitle, { color: item.textColor }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.promoSubtitle, { color: item.textColor, opacity: 0.85 }]}
                  >
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Featured Restaurants */}
        {selectedCategory === 'all' && featuredRestaurants.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Quán nổi bật</Text>
              <Text style={styles.seeAll}>Xem tất cả →</Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={featuredRestaurants}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: Spacing.l }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.featuredCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation?.navigate('MerchantStore', {
                      merchant: item,
                      type: 'food',
                    })
                  }
                >
                  <ImageBackground
                    source={{ uri: item.coverImage }}
                    style={styles.featuredThumb}
                    imageStyle={styles.featuredThumbImg}
                    resizeMode="cover"
                  >
                    <View style={styles.featuredOverlay}>
                      {item.promos.length > 0 && (
                        <View style={styles.promoBadge}>
                          <Text style={styles.promoBadgeText}>{item.promos[0]}</Text>
                        </View>
                      )}
                      <View style={styles.featuredMeta}>
                        <View style={styles.ratingBadge}>
                          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
                        </View>
                        <View style={styles.timeBadge}>
                          <Text style={styles.timeText}>🕐 {item.deliveryTime} phút</Text>
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.featuredTags} numberOfLines={1}>
                      {item.tags.join(' • ')}
                    </Text>
                    <View style={styles.featuredBottom}>
                      <Text style={styles.featuredPrice}>{item.priceRange}</Text>
                      <Text style={styles.featuredDistance}>📍 {item.distance}km</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Sort Options */}
        <View style={styles.sortRow}>
          <Text style={styles.resultCount}>
            {filteredRestaurants.length} quán{' '}
            {selectedCategory !== 'all'
              ? FOOD_CATEGORIES.find((c) => c.key === selectedCategory)?.label
              : ''}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'default', label: 'Mặc định' },
              { key: 'rating', label: 'Đánh giá' },
              { key: 'distance', label: 'Gần nhất' },
              { key: 'delivery', label: 'Nhanh nhất' },
            ].map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[styles.sortChip, sortBy === s.key && styles.sortChipActive]}
                onPress={() => setSortBy(s.key as any)}
              >
                <Text
                  style={[
                    styles.sortLabel,
                    sortBy === s.key && styles.sortLabelActive,
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Restaurant List */}
        <View style={styles.listSection}>
          {filteredRestaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation?.navigate('MerchantStore', {
                  merchant: restaurant,
                  type: 'food',
                })
              }
            >
              <ImageBackground
                source={{ uri: restaurant.coverImage }}
                style={styles.restThumb}
                imageStyle={styles.restThumbImg}
                resizeMode="cover"
              >
                <View style={styles.restThumbOverlay}>
                  {restaurant.promos.length > 0 && (
                    <View style={styles.restPromoBadge}>
                      <Text style={styles.restPromoText}>{restaurant.promos[0]}</Text>
                    </View>
                  )}
                  <View style={styles.restDeliveryBadge}>
                    <Text style={styles.restDeliveryText}>
                      🕐 {restaurant.deliveryTime} phút
                    </Text>
                  </View>
                </View>
              </ImageBackground>
              <View style={styles.restInfo}>
                <View style={styles.restRow1}>
                  <Text style={styles.restName} numberOfLines={1}>
                    {restaurant.name}
                  </Text>
                  {restaurant.isPartner && (
                    <View style={styles.partnerBadge}>
                      <Text style={styles.partnerText}>Đối tác</Text>
                    </View>
                  )}
                </View>
                <View style={styles.restRow2}>
                  <Text style={styles.restRating}>
                    ⭐ {restaurant.rating} ({restaurant.reviewCount > 1000
                      ? (restaurant.reviewCount / 1000).toFixed(1) + 'K'
                      : restaurant.reviewCount})
                  </Text>
                  <Text style={styles.restDot}>•</Text>
                  <Text style={styles.restDistance}>{restaurant.distance}km</Text>
                  <Text style={styles.restDot}>•</Text>
                  <Text style={styles.restPrice}>{restaurant.priceRange}</Text>
                </View>
                <Text style={styles.restTags} numberOfLines={1}>
                  {restaurant.tags.join(' • ')}
                </Text>
                {restaurant.deliveryFee === 0 ? (
                  <View style={styles.freeShipTag}>
                    <Text style={styles.freeShipText}>🛵 Freeship</Text>
                  </View>
                ) : (
                  <Text style={styles.deliveryFee}>
                    🛵 Phí giao: {formatPrice(restaurant.deliveryFee)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {filteredRestaurants.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyTitle}>Chưa tìm thấy quán ăn</Text>
              <Text style={styles.emptyDesc}>
                Thử tìm với từ khóa khác hoặc đổi danh mục nhé!
              </Text>
            </View>
          )}
        </View>

        {/* Merchant CTA */}
        <View style={styles.merchantCta}>
          <Text style={styles.merchantCtaIcon}>🏪</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.merchantCtaTitle}>Bạn là chủ quán?</Text>
            <Text style={styles.merchantCtaDesc}>
              Đăng ký làm đối tác Lifestyle để tiếp cận hàng nghìn khách hàng mới!
            </Text>
          </View>
          <TouchableOpacity style={styles.merchantCtaBtn}>
            <Text style={styles.merchantCtaBtnText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.white,
    gap: Spacing.m,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 24, color: Colors.black },
  headerCenter: { flex: 1 },
  headerTitle: { ...Typography.h2, color: Colors.black, fontWeight: '700' },
  headerSubtitle: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  cartBtn: { position: 'relative', padding: 4 },
  cartIcon: { fontSize: 24 },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: Colors.red,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { ...Typography.tiny, color: Colors.white, fontWeight: '800' },

  // Search
  searchWrap: { backgroundColor: Colors.white, paddingHorizontal: Spacing.l, paddingBottom: Spacing.m },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: 24,
    paddingHorizontal: Spacing.l,
    height: 44,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, ...Typography.body, color: Colors.black, padding: 0 },
  clearIcon: { fontSize: 16, color: Colors.gray, padding: 4 },

  // Categories
  categoryScroll: { paddingHorizontal: Spacing.l, paddingVertical: Spacing.m, gap: 8 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    gap: 4,
    ...Shadows.level1,
  },
  categoryChipActive: { backgroundColor: Colors.red },
  categoryIcon: { fontSize: 16 },
  categoryLabel: { ...Typography.secondary, color: Colors.darkGray, fontWeight: '500' },
  categoryLabelActive: { color: Colors.white, fontWeight: '700' },

  // Promos
  promoScroll: { paddingHorizontal: Spacing.l, gap: Spacing.m },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.75,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginRight: Spacing.m,
    gap: Spacing.m,
  },
  promoIcon: { fontSize: 32 },
  promoTitle: { ...Typography.body, fontWeight: '700' },
  promoSubtitle: { ...Typography.caption, marginTop: 2 },

  // Section
  section: { marginTop: Spacing.l },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  sectionTitle: { ...Typography.h3, color: Colors.black },
  seeAll: { ...Typography.secondary, color: Colors.gold, fontWeight: '600' },

  // Featured cards
  featuredCard: {
    width: 260,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    marginRight: Spacing.m,
    ...Shadows.level2,
  },
  featuredThumb: { height: 140 },
  featuredThumbImg: { borderTopLeftRadius: BorderRadius.large, borderTopRightRadius: BorderRadius.large },
  featuredOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.s,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  promoBadgeText: { ...Typography.tiny, color: Colors.white, fontWeight: '700' },
  featuredMeta: { flexDirection: 'row', gap: 6 },
  ratingBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: { ...Typography.tiny, color: Colors.white, fontWeight: '700' },
  timeBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  timeText: { ...Typography.tiny, color: Colors.white, fontWeight: '600' },
  featuredInfo: { padding: Spacing.m },
  featuredName: { ...Typography.body, fontWeight: '700', color: Colors.black },
  featuredTags: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  featuredBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  featuredPrice: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },
  featuredDistance: { ...Typography.caption, color: Colors.gray },

  // Sort
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    gap: Spacing.m,
  },
  resultCount: { ...Typography.secondary, color: Colors.darkGray, fontWeight: '600' },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.white,
    marginRight: 6,
    ...Shadows.level1,
  },
  sortChipActive: { backgroundColor: Colors.purpleDark },
  sortLabel: { ...Typography.caption, color: Colors.gray, fontWeight: '500' },
  sortLabelActive: { color: Colors.white, fontWeight: '700' },

  // Restaurant list
  listSection: { paddingHorizontal: Spacing.l },
  restaurantCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    marginBottom: Spacing.m,
    ...Shadows.level2,
  },
  restThumb: { height: 150 },
  restThumbImg: { borderTopLeftRadius: BorderRadius.large, borderTopRightRadius: BorderRadius.large },
  restThumbOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.s,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  restPromoBadge: {
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  restPromoText: { ...Typography.tiny, color: Colors.white, fontWeight: '700' },
  restDeliveryBadge: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  restDeliveryText: { ...Typography.tiny, color: Colors.white, fontWeight: '600' },
  restInfo: { padding: Spacing.l },
  restRow1: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  restName: { ...Typography.body, fontWeight: '700', color: Colors.black, flex: 1 },
  partnerBadge: {
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  partnerText: { ...Typography.tiny, color: Colors.gold, fontWeight: '700' },
  restRow2: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  restRating: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },
  restDot: { ...Typography.caption, color: Colors.lightGray },
  restDistance: { ...Typography.caption, color: Colors.gray },
  restPrice: { ...Typography.caption, color: Colors.gray },
  restTags: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  freeShipTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
  },
  freeShipText: { ...Typography.tiny, color: Colors.success, fontWeight: '700' },
  deliveryFee: { ...Typography.caption, color: Colors.gray, marginTop: 6 },

  // Empty
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxxl },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.m },
  emptyTitle: { ...Typography.h3, color: Colors.black },
  emptyDesc: { ...Typography.secondary, color: Colors.gray, marginTop: 4, textAlign: 'center' },

  // Merchant CTA
  merchantCta: {
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
  merchantCtaIcon: { fontSize: 32 },
  merchantCtaTitle: { ...Typography.body, fontWeight: '700', color: Colors.black },
  merchantCtaDesc: { ...Typography.caption, color: Colors.gray, marginTop: 2, lineHeight: 16 },
  merchantCtaBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.medium,
  },
  merchantCtaBtnText: { ...Typography.secondary, color: Colors.purpleDark, fontWeight: '700' },
});
