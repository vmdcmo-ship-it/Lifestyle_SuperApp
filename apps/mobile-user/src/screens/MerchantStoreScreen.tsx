import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { useCart, createFoodCartItem, createProductCartItem } from '../contexts/CartContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const MerchantStoreScreen = ({ navigation, route }: any) => {
  const { merchant, type } = route?.params ?? {};
  const { totalItems, addItem, getItemQuantity, updateQuantity } = useCart();
  const [showCart, setShowCart] = useState(false);

  if (!merchant) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>🏪</Text>
          <Text style={styles.emptyTitle}>Không tìm thấy cửa hàng</Text>
          <TouchableOpacity style={styles.goBackBtn} onPress={() => navigation?.goBack()}>
            <Text style={styles.goBackText}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isFood = type === 'food';
  const items = isFood ? merchant.menu : merchant.products;

  const formatPrice = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'tr';
    return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
  };

  const addToCart = (item: any) => {
    if (isFood) {
      addItem(
        createFoodCartItem({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          merchantId: merchant.id,
          merchantName: merchant.name,
          image: item.image,
        })
      );
    } else {
      addItem(
        createProductCartItem({
          productId: item.id,
          name: item.name,
          price: item.price,
          merchantId: merchant.id,
          merchantName: merchant.name,
          image: item.image,
          unit: item.unit,
        })
      );
    }
  };

  const getItemQty = (itemId: string) => {
    const cartId = isFood
      ? `food_${merchant.id}_${itemId}`
      : `product_${merchant.id}_${itemId}`;
    return getItemQuantity(cartId);
  };

  const removeFromCart = (itemId: string) => {
    const cartId = isFood
      ? `food_${merchant.id}_${itemId}`
      : `product_${merchant.id}_${itemId}`;
    const currentQty = getItemQty(itemId);
    if (currentQty > 0) {
      updateQuantity(cartId, currentQty - 1);
    }
  };

  const popularItems = items?.filter((i: any) => i.popular) ?? [];
  const otherItems = items?.filter((i: any) => !i.popular) ?? [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <ImageBackground
          source={{ uri: merchant.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        >
          <View style={styles.coverOverlay}>
            <TouchableOpacity
              style={styles.coverBackBtn}
              onPress={() => navigation?.goBack()}
            >
              <Text style={styles.coverBackIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.coverActions}>
              <TouchableOpacity style={styles.coverActionBtn}>
                <Text style={styles.coverActionIcon}>❤️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.coverActionBtn}>
                <Text style={styles.coverActionIcon}>📤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Store Info Card */}
        <View style={styles.storeCard}>
          <View style={styles.storeHeader}>
            <View style={styles.storeLogo}>
              <Text style={styles.storeLogoEmoji}>{merchant.logo}</Text>
            </View>
            <View style={styles.storeHeaderInfo}>
              <View style={styles.storeNameRow}>
                <Text style={styles.storeName}>{merchant.name}</Text>
                {merchant.isPartner && (
                  <View style={styles.partnerBadge}>
                    <Text style={styles.partnerBadgeText}>✓ Đối tác</Text>
                  </View>
                )}
              </View>
              <View style={styles.storeMetaRow}>
                <Text style={styles.storeRating}>
                  ⭐ {merchant.rating}
                </Text>
                <Text style={styles.storeReviews}>
                  ({merchant.reviewCount > 1000
                    ? (merchant.reviewCount / 1000).toFixed(1) + 'K'
                    : merchant.reviewCount}{' '}
                  đánh giá)
                </Text>
              </View>
            </View>
          </View>

          {/* Store Details */}
          <View style={styles.storeDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText}>{merchant.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🕐</Text>
              <Text style={styles.detailText}>{merchant.openHours}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>{isFood ? '🛵' : '🚚'}</Text>
              <Text style={styles.detailText}>
                Giao hàng: {isFood ? merchant.deliveryTime + ' phút' : merchant.deliveryTime}
                {merchant.deliveryFee === 0
                  ? ' • Freeship'
                  : ' • Phí giao ' + formatPrice(merchant.deliveryFee)}
              </Text>
            </View>
            {merchant.minOrder > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>💰</Text>
                <Text style={styles.detailText}>
                  Đơn tối thiểu: {formatPrice(merchant.minOrder)}
                </Text>
              </View>
            )}
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {merchant.tags?.map((tag: string, i: number) => (
              <View key={i} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Promos */}
          {merchant.promos?.length > 0 && (
            <View style={styles.promosSection}>
              {merchant.promos.map((promo: string, i: number) => (
                <View key={i} style={styles.promoRow}>
                  <Text style={styles.promoIcon}>🎫</Text>
                  <Text style={styles.promoText}>{promo}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Popular Items */}
        {popularItems.length > 0 && (
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>
              🔥 {isFood ? 'Món bán chạy' : 'Sản phẩm hot'}
            </Text>
            {popularItems.map((item: any) => (
              <MenuItemCard
                key={item.id}
                item={item}
                isFood={isFood}
                qty={getItemQty(item.id)}
                onAdd={() => addToCart(item)}
                onRemove={() => removeFromCart(item.id)}
                formatPrice={formatPrice}
              />
            ))}
          </View>
        )}

        {/* All Items */}
        {otherItems.length > 0 && (
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>
              📋 {isFood ? 'Menu' : 'Tất cả sản phẩm'}
            </Text>
            {otherItems.map((item: any) => (
              <MenuItemCard
                key={item.id}
                item={item}
                isFood={isFood}
                qty={getItemQty(item.id)}
                onAdd={() => addToCart(item)}
                onRemove={() => removeFromCart(item.id)}
                formatPrice={formatPrice}
              />
            ))}
          </View>
        )}

        {/* Merchant Info */}
        <View style={styles.merchantInfoSection}>
          <Text style={styles.merchantInfoTitle}>Thông tin cửa hàng</Text>
          <View style={styles.merchantInfoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Mã đối tác</Text>
              <Text style={styles.infoValue}>{merchant.merchantId}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phương thức thanh toán</Text>
              <Text style={styles.infoValue}>Ví Lifestyle, MoMo, Tiền mặt</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Chính sách hoàn tiền</Text>
              <Text style={styles.infoValue}>Hoàn 100% nếu sai đơn / thiếu hàng</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          activeOpacity={0.9}
          onPress={() => navigation?.navigate('Cart')}
        >
          <View style={styles.cartBarLeft}>
            <View style={styles.cartBarBadge}>
              <Text style={styles.cartBarBadgeText}>{totalItems}</Text>
            </View>
            <Text style={styles.cartBarLabel}>
              {isFood ? '🛒 Giỏ hàng' : '🛍️ Giỏ hàng'}
            </Text>
          </View>
          <Text style={styles.cartBarArrow}>→</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

// ─── Menu/Product Item Component ─────────────────────────────────────────────

const MenuItemCard = ({
  item,
  isFood,
  qty,
  onAdd,
  onRemove,
  formatPrice,
}: {
  item: any;
  isFood: boolean;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  formatPrice: (n: number) => string;
}) => (
  <View style={menuStyles.card}>
    <View style={menuStyles.cardLeft}>
      <Text style={menuStyles.cardName}>{item.name}</Text>
      <Text style={menuStyles.cardDesc} numberOfLines={2}>
        {item.desc}
      </Text>
      <View style={menuStyles.priceRow}>
        <Text style={menuStyles.cardPrice}>{formatPrice(item.price)}</Text>
        {!isFood && item.originalPrice && (
          <Text style={menuStyles.cardOldPrice}>
            {formatPrice(item.originalPrice)}
          </Text>
        )}
        {!isFood && item.unit && (
          <Text style={menuStyles.cardUnit}>/{item.unit}</Text>
        )}
      </View>
    </View>
    <View style={menuStyles.cardRight}>
      <View style={menuStyles.thumbWrap}>
        <Text style={menuStyles.thumbEmoji}>{item.image}</Text>
      </View>
      {qty > 0 ? (
        <View style={menuStyles.qtyRow}>
          <TouchableOpacity style={menuStyles.qtyBtn} onPress={onRemove}>
            <Text style={menuStyles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={menuStyles.qtyText}>{qty}</Text>
          <TouchableOpacity style={menuStyles.qtyBtnAdd} onPress={onAdd}>
            <Text style={menuStyles.qtyBtnAddText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={menuStyles.addBtn} onPress={onAdd}>
          <Text style={menuStyles.addBtnText}>+ Thêm</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const menuStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.s,
    ...Shadows.level1,
    gap: Spacing.m,
  },
  cardLeft: { flex: 1, justifyContent: 'center' },
  cardName: { ...Typography.body, fontWeight: '600', color: Colors.black },
  cardDesc: { ...Typography.caption, color: Colors.gray, marginTop: 4, lineHeight: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  cardPrice: { ...Typography.body, fontWeight: '700', color: Colors.red },
  cardOldPrice: {
    ...Typography.caption,
    color: Colors.gray,
    textDecorationLine: 'line-through',
  },
  cardUnit: { ...Typography.caption, color: Colors.gray },
  cardRight: { alignItems: 'center', gap: 8 },
  thumbWrap: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 36 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 18, color: Colors.gray, fontWeight: '700' },
  qtyText: { ...Typography.body, fontWeight: '700', color: Colors.black, minWidth: 20, textAlign: 'center' },
  qtyBtnAdd: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnAddText: { fontSize: 18, color: Colors.purpleDark, fontWeight: '700' },
  addBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  addBtnText: { ...Typography.caption, fontWeight: '700', color: Colors.purpleDark },
});

// ─── Main Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Empty
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.l },
  emptyTitle: { ...Typography.h2, color: Colors.black },
  goBackBtn: { marginTop: Spacing.l, padding: Spacing.m },
  goBackText: { ...Typography.body, color: Colors.gold, fontWeight: '600' },

  // Cover
  coverImage: { height: 220 },
  coverOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.l,
    paddingTop: Spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  coverBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverBackIcon: { fontSize: 22, color: Colors.black },
  coverActions: { flexDirection: 'row', gap: 8 },
  coverActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverActionIcon: { fontSize: 18 },

  // Store Card
  storeCard: {
    backgroundColor: Colors.white,
    marginTop: -20,
    marginHorizontal: Spacing.l,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level2,
  },
  storeHeader: { flexDirection: 'row', gap: Spacing.m },
  storeLogo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeLogoEmoji: { fontSize: 28 },
  storeHeaderInfo: { flex: 1, justifyContent: 'center' },
  storeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  storeName: { ...Typography.h3, fontWeight: '700', color: Colors.black },
  partnerBadge: {
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  partnerBadgeText: { ...Typography.tiny, color: Colors.success, fontWeight: '700' },
  storeMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  storeRating: { ...Typography.secondary, color: Colors.gold, fontWeight: '700' },
  storeReviews: { ...Typography.caption, color: Colors.gray },

  // Details
  storeDetails: { marginTop: Spacing.l, gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailIcon: { fontSize: 16, width: 24, textAlign: 'center' },
  detailText: { ...Typography.secondary, color: Colors.darkGray, flex: 1 },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.m, gap: 6 },
  tagChip: {
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },

  // Promos
  promosSection: {
    marginTop: Spacing.m,
    backgroundColor: Colors.red + '08',
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    gap: 6,
  },
  promoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  promoIcon: { fontSize: 16 },
  promoText: { ...Typography.secondary, color: Colors.red, fontWeight: '600' },

  // Menu Section
  menuSection: {
    marginTop: Spacing.l,
    paddingHorizontal: Spacing.l,
  },
  menuSectionTitle: {
    ...Typography.h3,
    color: Colors.black,
    marginBottom: Spacing.m,
  },

  // Merchant Info
  merchantInfoSection: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.l,
  },
  merchantInfoTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },
  merchantInfoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level1,
  },
  infoItem: { paddingVertical: 8 },
  infoLabel: { ...Typography.caption, color: Colors.gray },
  infoValue: { ...Typography.secondary, color: Colors.black, fontWeight: '500', marginTop: 2 },
  infoDivider: { height: 1, backgroundColor: Colors.offWhite },

  // Cart Bar
  cartBar: {
    position: 'absolute',
    bottom: 24,
    left: Spacing.l,
    right: Spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.purpleDark,
    borderRadius: BorderRadius.large,
    paddingVertical: 14,
    paddingHorizontal: Spacing.l,
    ...Shadows.level3,
    gap: Spacing.m,
  },
  cartBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  cartBarBadge: {
    backgroundColor: Colors.gold,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBarBadgeText: { ...Typography.caption, color: Colors.purpleDark, fontWeight: '800' },
  cartBarLabel: { ...Typography.body, color: Colors.white, fontWeight: '600' },
  cartBarTotal: { ...Typography.body, color: Colors.gold, fontWeight: '800' },
  cartBarArrow: { fontSize: 18, color: Colors.gold },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.offWhite,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lightGray,
    alignSelf: 'center',
    marginBottom: Spacing.m,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: { ...Typography.h2, color: Colors.black },
  modalClose: { fontSize: 20, color: Colors.gray, padding: 4 },
  modalSubtitle: { ...Typography.caption, color: Colors.gray, marginTop: 4 },

  // Cart items
  cartList: { paddingHorizontal: Spacing.l, maxHeight: 300 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.offWhite,
    gap: Spacing.m,
  },
  cartItemEmoji: { fontSize: 28 },
  cartItemInfo: { flex: 1 },
  cartItemName: { ...Typography.secondary, fontWeight: '600', color: Colors.black },
  cartItemPrice: { ...Typography.caption, color: Colors.red, fontWeight: '600', marginTop: 2 },
  cartQtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 18, color: Colors.gray, fontWeight: '700' },
  qtyText: { ...Typography.body, fontWeight: '700', color: Colors.black, minWidth: 20, textAlign: 'center' },
  qtyBtnAdd: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnAddText: { fontSize: 18, color: Colors.purpleDark, fontWeight: '700' },

  // Cart Summary
  cartSummary: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.l,
    borderTopWidth: 1,
    borderTopColor: Colors.offWhite,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: { ...Typography.secondary, color: Colors.gray },
  summaryValue: { ...Typography.secondary, color: Colors.black, fontWeight: '500' },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.offWhite,
    marginVertical: 8,
  },
  summaryTotal: { ...Typography.body, color: Colors.black, fontWeight: '700' },
  summaryTotalValue: { ...Typography.h3, color: Colors.red, fontWeight: '800' },
  checkoutBtn: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.large,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.l,
  },
  checkoutBtnText: { ...Typography.body, color: Colors.purpleDark, fontWeight: '800' },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.m,
    gap: 8,
  },
  paymentLabel: { ...Typography.caption, color: Colors.gray },
  paymentMethod: { ...Typography.caption, color: Colors.black, fontWeight: '600' },
  paymentChange: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },
});
