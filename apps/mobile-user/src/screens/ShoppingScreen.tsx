import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ImageBackground,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import {
  MOCK_SHOPS,
  SHOP_CATEGORIES,
  SHOP_PROMOS,
  type ShopCategory,
} from '../data/mockData';
import { useCart } from '../contexts/CartContext';
import { merchantsService } from '../services/merchants.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ShoppingScreen = ({ navigation }: any) => {
  const { totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'distance' | 'promo'>('default');
  const [shops, setShops] = useState<any[]>(MOCK_SHOPS);

  useEffect(() => {
    (async () => {
      try {
        const res = await merchantsService.list({ type: 'SHOP', limit: 50 });
        if (res?.data && res.data.length > 0) {
          const mapped = res.data.map((m: any) => ({
            id: m.id,
            name: m.name,
            category: 'general' as ShopCategory,
            rating: m.rating || 4.5,
            reviewCount: m.reviewCount || 0,
            distance: 1.0,
            deliveryTime: '30-60 phút',
            deliveryFee: 20000,
            tags: [m.type],
            image: m.imageUrl || null,
            isFeatured: false,
            promos: [],
            address: m.fullAddress || '',
          }));
          setShops(mapped);
        }
      } catch { /* keep mock */ }
    })();
  }, []);

  const filteredShops = useMemo(() => {
    let list = shops;

    if (selectedCategory !== 'all') {
      list = list.filter((s) => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'distance') list = [...list].sort((a, b) => a.distance - b.distance);
    else if (sortBy === 'promo') list = [...list].sort((a, b) => b.promos.length - a.promos.length);

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  const featuredShops = shops.filter((s: any) => s.isFeatured);

  const formatPrice = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'tr';
    if (n >= 1000) return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
    return n + 'đ';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mua sắm</Text>
          <Text style={styles.headerSubtitle}>Giao tận nơi từ cửa hàng đối tác</Text>
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
            placeholder="Tìm cửa hàng, sản phẩm..."
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
        {/* Category Grid */}
        <View style={styles.categoryGrid}>
          {SHOP_CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryCard,
                selectedCategory === cat.key && styles.categoryCardActive,
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === cat.key ? 'all' : cat.key)
              }
            >
              <Text style={styles.catGridIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.catGridLabel,
                  selectedCategory === cat.key && styles.catGridLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Promos */}
        {selectedCategory === 'all' && (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={SHOP_PROMOS}
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
                  <Text style={[styles.promoSub, { color: item.textColor, opacity: 0.85 }]}>
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Featured Shops */}
        {selectedCategory === 'all' && featuredShops.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏆 Cửa hàng nổi bật</Text>
              <Text style={styles.seeAll}>Xem tất cả →</Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={featuredShops}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: Spacing.l }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.featuredCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation?.navigate('MerchantStore', {
                      merchant: item,
                      type: 'shop',
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
                      <View style={styles.featuredBottomRow}>
                        <View style={styles.ratingBadge}>
                          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
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
                    <View style={styles.featuredMeta}>
                      <Text style={styles.featuredDelivery}>
                        🚚 {item.deliveryTime}
                      </Text>
                      <Text style={styles.featuredDist}>📍 {item.distance}km</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Hot Products Preview */}
        {selectedCategory === 'all' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Sản phẩm hot</Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={shops.flatMap((s: any) =>
                (s.products || [])
                  .filter((p: any) => p.popular)
                  .slice(0, 2)
                  .map((p: any) => ({ ...p, shopName: s.name, shopId: s.id })),
              ).slice(0, 8)}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: Spacing.l }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.hotProductCard} activeOpacity={0.85}>
                  <View style={styles.hotProductThumb}>
                    <Text style={styles.hotProductEmoji}>{item.image}</Text>
                  </View>
                  <View style={styles.hotProductInfo}>
                    <Text style={styles.hotProductName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <View style={styles.hotPriceRow}>
                      <Text style={styles.hotProductPrice}>{formatPrice(item.price)}</Text>
                      {item.originalPrice && (
                        <Text style={styles.hotProductOldPrice}>
                          {formatPrice(item.originalPrice)}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.hotProductShop} numberOfLines={1}>
                      {item.shopName}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Sort Options */}
        <View style={styles.sortRow}>
          <Text style={styles.resultCount}>
            {filteredShops.length} cửa hàng
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'default', label: 'Mặc định' },
              { key: 'rating', label: 'Đánh giá' },
              { key: 'distance', label: 'Gần nhất' },
              { key: 'promo', label: 'Ưu đãi' },
            ].map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[styles.sortChip, sortBy === s.key && styles.sortChipActive]}
                onPress={() => setSortBy(s.key as any)}
              >
                <Text
                  style={[styles.sortLabel, sortBy === s.key && styles.sortLabelActive]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Shop List */}
        <View style={styles.listSection}>
          {filteredShops.map((shop) => (
            <TouchableOpacity
              key={shop.id}
              style={styles.shopCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation?.navigate('MerchantStore', {
                  merchant: shop,
                  type: 'shop',
                })
              }
            >
              <ImageBackground
                source={{ uri: shop.coverImage }}
                style={styles.shopThumb}
                imageStyle={styles.shopThumbImg}
                resizeMode="cover"
              >
                <View style={styles.shopThumbOverlay}>
                  {shop.promos.length > 0 && (
                    <View style={styles.shopPromoBadge}>
                      <Text style={styles.shopPromoText}>{shop.promos[0]}</Text>
                    </View>
                  )}
                  <View style={styles.shopDeliveryBadge}>
                    <Text style={styles.shopDeliveryText}>
                      🚚 {shop.deliveryTime}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
              <View style={styles.shopInfo}>
                <View style={styles.shopRow1}>
                  <Text style={styles.shopName} numberOfLines={1}>
                    {shop.name}
                  </Text>
                  {shop.isPartner && (
                    <View style={styles.partnerBadge}>
                      <Text style={styles.partnerText}>Đối tác</Text>
                    </View>
                  )}
                </View>
                <View style={styles.shopRow2}>
                  <Text style={styles.shopRating}>
                    ⭐ {shop.rating} ({shop.reviewCount > 1000
                      ? (shop.reviewCount / 1000).toFixed(1) + 'K'
                      : shop.reviewCount})
                  </Text>
                  <Text style={styles.shopDot}>•</Text>
                  <Text style={styles.shopDistance}>{shop.distance}km</Text>
                </View>
                <Text style={styles.shopTags} numberOfLines={1}>
                  {shop.tags.join(' • ')}
                </Text>

                {/* Top products preview */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.shopProductsPreview}
                >
                  {shop.products.filter((p) => p.popular).slice(0, 3).map((product) => (
                    <View key={product.id} style={styles.miniProduct}>
                      <Text style={styles.miniProductEmoji}>{product.image}</Text>
                      <Text style={styles.miniProductPrice}>{formatPrice(product.price)}</Text>
                    </View>
                  ))}
                </ScrollView>

                {shop.deliveryFee === 0 ? (
                  <View style={styles.freeShipTag}>
                    <Text style={styles.freeShipText}>🚚 Freeship</Text>
                  </View>
                ) : (
                  <Text style={styles.deliveryFee}>
                    🚚 Phí giao: {formatPrice(shop.deliveryFee)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {filteredShops.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🛍️</Text>
              <Text style={styles.emptyTitle}>Chưa tìm thấy cửa hàng</Text>
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
            <Text style={styles.merchantCtaTitle}>Trở thành đối tác bán hàng</Text>
            <Text style={styles.merchantCtaDesc}>
              Mở cửa hàng online trên Lifestyle, miễn phí đăng ký trong 3 tháng!
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

  // Categories grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    gap: 8,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 32 - 24) / 4,
    alignItems: 'center',
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.large,
    backgroundColor: Colors.white,
    ...Shadows.level1,
  },
  categoryCardActive: { backgroundColor: Colors.purpleDark },
  catGridIcon: { fontSize: 24, marginBottom: 4 },
  catGridLabel: { ...Typography.tiny, color: Colors.darkGray, fontWeight: '600', textAlign: 'center' },
  catGridLabelActive: { color: Colors.white },

  // Promos
  promoScroll: { paddingHorizontal: Spacing.l, gap: Spacing.m, marginBottom: Spacing.m },
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
  promoSub: { ...Typography.caption, marginTop: 2 },

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

  // Featured
  featuredCard: {
    width: 240,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    marginRight: Spacing.m,
    ...Shadows.level2,
  },
  featuredThumb: { height: 130 },
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
  featuredBottomRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  ratingBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: { ...Typography.tiny, color: Colors.white, fontWeight: '700' },
  featuredInfo: { padding: Spacing.m },
  featuredName: { ...Typography.body, fontWeight: '700', color: Colors.black },
  featuredTags: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  featuredMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  featuredDelivery: { ...Typography.caption, color: Colors.info, fontWeight: '500' },
  featuredDist: { ...Typography.caption, color: Colors.gray },

  // Hot products
  hotProductCard: {
    width: 130,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    marginRight: Spacing.m,
    ...Shadows.level1,
  },
  hotProductThumb: {
    height: 80,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotProductEmoji: { fontSize: 36 },
  hotProductInfo: { padding: Spacing.s },
  hotProductName: { ...Typography.caption, fontWeight: '600', color: Colors.black, height: 34 },
  hotPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  hotProductPrice: { ...Typography.secondary, color: Colors.red, fontWeight: '700' },
  hotProductOldPrice: {
    ...Typography.tiny,
    color: Colors.gray,
    textDecorationLine: 'line-through',
  },
  hotProductShop: { ...Typography.tiny, color: Colors.gray, marginTop: 2 },

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

  // Shop list
  listSection: { paddingHorizontal: Spacing.l },
  shopCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    marginBottom: Spacing.m,
    ...Shadows.level2,
  },
  shopThumb: { height: 140 },
  shopThumbImg: { borderTopLeftRadius: BorderRadius.large, borderTopRightRadius: BorderRadius.large },
  shopThumbOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.s,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  shopPromoBadge: {
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  shopPromoText: { ...Typography.tiny, color: Colors.white, fontWeight: '700' },
  shopDeliveryBadge: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  shopDeliveryText: { ...Typography.tiny, color: Colors.white, fontWeight: '600' },
  shopInfo: { padding: Spacing.l },
  shopRow1: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shopName: { ...Typography.body, fontWeight: '700', color: Colors.black, flex: 1 },
  partnerBadge: {
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  partnerText: { ...Typography.tiny, color: Colors.gold, fontWeight: '700' },
  shopRow2: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  shopRating: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },
  shopDot: { ...Typography.caption, color: Colors.lightGray },
  shopDistance: { ...Typography.caption, color: Colors.gray },
  shopTags: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  shopProductsPreview: { marginTop: 8 },
  miniProduct: {
    width: 60,
    height: 60,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  miniProductEmoji: { fontSize: 22 },
  miniProductPrice: { ...Typography.tiny, color: Colors.red, fontWeight: '700', marginTop: 2 },
  freeShipTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 8,
  },
  freeShipText: { ...Typography.tiny, color: Colors.success, fontWeight: '700' },
  deliveryFee: { ...Typography.caption, color: Colors.gray, marginTop: 8 },

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
