import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ViewToken,
  Animated,
  Modal,
  Pressable,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { Avatar, Badge } from '../components/ui';
import {
  MOCK_SPOTLIGHT_REELS,
  SPOTLIGHT_CATEGORIES,
  SpotlightCategory,
} from '../data/mockData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = SCREEN_HEIGHT - 90;

// ─── CTA Config per target type ─────────────────────────────────────────────

const CTA_CONFIG: Record<string, { emoji: string; label: string }> = {
  RESTAURANT: { emoji: '🍜', label: 'Đặt bàn ngay' },
  CAFE: { emoji: '☕', label: 'Xem menu' },
  INSURANCE: { emoji: '🛡️', label: 'Tìm hiểu thêm' },
  TRAVEL: { emoji: '✈️', label: 'Xem chi tiết' },
  RESORT: { emoji: '🏨', label: 'Đặt phòng ngay' },
  HOTEL: { emoji: '🛏️', label: 'Xem giá phòng' },
  SPA: { emoji: '💆', label: 'Đặt lịch Spa' },
  MASSAGE: { emoji: '🧘', label: 'Đặt lịch ngay' },
  WELLNESS: { emoji: '🌿', label: 'Đặt lịch ngay' },
  FASHION: { emoji: '🛍️', label: 'Mua sắm ngay' },
};

// ─── Single Reel Item ───────────────────────────────────────────────────────

/** Link mua sản phẩm: nội bộ (KODO) hoặc affiliate (Shopee, TikTok Shop) */
type ProductLinkType = 'INTERNAL' | 'SHOPEE' | 'TIKTOK_SHOP';

interface ReelItemProps {
  item: (typeof MOCK_SPOTLIGHT_REELS)[0] & {
    productLinks?: Array<{ type: ProductLinkType; url: string; label?: string }>;
  };
  isActive: boolean;
}

const PRODUCT_LINK_LABELS: Record<ProductLinkType, string> = {
  INTERNAL: 'Mua trên KODO',
  SHOPEE: 'Mua trên Shopee',
  TIKTOK_SHOP: 'Mua trên TikTok Shop',
};

const SERVICE_OPTIONS = [
  { id: 'motorbike', icon: '🏍️', label: 'Gọi xe máy', screen: 'Booking' as const, vehicleType: 'MOTORBIKE' },
  { id: 'car', icon: '🚗', label: 'Gọi xe ô tô / taxi', screen: 'Booking' as const, vehicleType: 'CAR_4' },
  { id: 'food', icon: '🍜', label: 'Đặt món', screen: 'FoodDelivery' as const },
];

const ReelItem: React.FC<ReelItemProps> = ({ item, isActive }) => {
  const navigation = useNavigation<any>();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  const productLinks = (item as ReelItemProps['item']).productLinks ?? [];
  const hasProductLinks = productLinks.length > 0;

  const handleProductLink = (link: { type: ProductLinkType; url: string; label?: string }) => {
    setShowProductModal(false);
    if (link.type === 'INTERNAL') {
      navigation.navigate('Shopping', { spotlightItemId: item.id });
    } else {
      Linking.openURL(link.url).catch(() => {});
    }
  };

  const handleServiceOption = (opt: (typeof SERVICE_OPTIONS)[0]) => {
    setShowServiceModal(false);
    const destination = item.title; // Có thể mở rộng: item.address hoặc địa chỉ từ tags
    if (opt.screen === 'Booking') {
      navigation.navigate('Booking', { destination, vehicleType: opt.vehicleType });
    } else {
      navigation.navigate('FoodDelivery', { destination });
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const formatCount = (n: number) =>
    n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);

  const cta = CTA_CONFIG[item.targetType] || { emoji: '👉', label: 'Xem chi tiết' };

  return (
    <View style={[styles.reelContainer, { height: ITEM_HEIGHT }]}>
      {/* Background (video placeholder) */}
      <View style={[styles.reelBackground, { backgroundColor: item.thumbnailColor }]}>
        {isActive && (
          <View style={styles.playingIndicator}>
            <View style={[styles.playBar, { height: 20 }]} />
            <View style={[styles.playBar, { height: 30 }]} />
            <View style={[styles.playBar, { height: 14 }]} />
            <View style={[styles.playBar, { height: 24 }]} />
          </View>
        )}
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: isActive ? '65%' : '0%' }]}
          />
        </View>
      </View>

      {/* Right action bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.creatorAvatarWrap}>
            <Avatar name={item.creatorName} size={44} verified={item.verified} />
          </View>
          <View style={styles.followBadge}>
            <Text style={styles.followPlus}>+</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={handleLike}>
          <Animated.Text
            style={[
              styles.actionIcon,
              { transform: [{ scale: heartScale }] },
              liked && { color: Colors.red },
            ]}
          >
            {liked ? '❤️' : '🤍'}
          </Animated.Text>
          <Text style={styles.actionCount}>
            {formatCount(item.likes + (liked ? 1 : 0))}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{formatCount(item.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>↗️</Text>
          <Text style={styles.actionCount}>{formatCount(item.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => setSaved(!saved)}
        >
          <Text style={styles.actionIcon}>{saved ? '🔖' : '📑'}</Text>
          <Text style={styles.actionCount}>Lưu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => setShowServiceModal(true)}
        >
          <Text style={styles.actionIcon}>🚗</Text>
          <Text style={styles.actionCount}>Đi đến</Text>
        </TouchableOpacity>

        {hasProductLinks && (
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setShowProductModal(true)}
          >
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionCount}>Mua</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showProductModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProductModal(false)}
      >
        <Pressable
          style={styles.serviceModalOverlay}
          onPress={() => setShowProductModal(false)}
        >
          <View
            style={styles.serviceModalContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.serviceModalTitle}>Mua sản phẩm</Text>
            {productLinks.map((link, i) => (
              <TouchableOpacity
                key={i}
                style={styles.serviceOption}
                onPress={() => handleProductLink(link)}
                activeOpacity={0.7}
              >
                <Text style={styles.serviceOptionIcon}>
                  {link.type === 'INTERNAL' ? '🛍️' : link.type === 'SHOPEE' ? '🛒' : '📦'}
                </Text>
                <Text style={styles.serviceOptionLabel}>
                  {link.label || PRODUCT_LINK_LABELS[link.type]}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.serviceCancel}
              onPress={() => setShowProductModal(false)}
            >
              <Text style={styles.serviceCancelText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showServiceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowServiceModal(false)}
      >
        <Pressable
          style={styles.serviceModalOverlay}
          onPress={() => setShowServiceModal(false)}
        >
          <View
            style={styles.serviceModalContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.serviceModalTitle}>Gọi dịch vụ di chuyển</Text>
            {SERVICE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.serviceOption}
                onPress={() => handleServiceOption(opt)}
                activeOpacity={0.7}
              >
                <Text style={styles.serviceOptionIcon}>{opt.icon}</Text>
                <Text style={styles.serviceOptionLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.serviceCancel}
              onPress={() => setShowServiceModal(false)}
            >
              <Text style={styles.serviceCancelText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Bottom info overlay */}
      <View style={styles.bottomOverlay}>
        <View style={styles.creatorRow}>
          <Text style={styles.creatorName}>@{item.creatorName}</Text>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          )}
          <Badge
            label={item.creatorTier}
            variant={
              item.creatorTier === 'CELEBRITY'
                ? 'warning'
                : item.creatorTier === 'INFLUENCER'
                ? 'info'
                : 'success'
            }
          />
        </View>

        <Text style={styles.reelTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.reelDesc} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.tagsRow}>
          {item.tags.map((tag, i) => (
            <Text key={i} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.ratingChip}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
          <View style={styles.targetChip}>
            <Text style={styles.targetText}>
              📍 {item.targetType}
            </Text>
          </View>
          <Text style={styles.viewsText}>
            👁 {formatCount(item.views)} lượt xem
          </Text>
        </View>

        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>
            {cta.emoji} {cta.label}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Main Spotlight Screen ──────────────────────────────────────────────────

export const SpotlightScreen = () => {
  const navigation = useNavigation<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<SpotlightCategory>('FOR_YOU');
  const flatListRef = useRef<FlatList>(null);

  const filteredReels = useMemo(() => {
    if (activeCategory === 'FOR_YOU') return MOCK_SPOTLIGHT_REELS;
    if (activeCategory === 'FOLLOWING') {
      return MOCK_SPOTLIGHT_REELS.filter((r) => r.verified);
    }
    return MOCK_SPOTLIGHT_REELS.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const handleCategoryChange = (cat: SpotlightCategory) => {
    setActiveCategory(cat);
    setActiveIndex(0);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  return (
    <View style={styles.container}>
      {/* Top bar with scrollable categories */}
      <SafeAreaView edges={['top']} style={styles.topBar}>
        <View style={styles.topBarHeader}>
          <Text style={styles.topTitle}>Spotlight</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('FindNear')}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={{ fontSize: 22, color: Colors.white }}>📍</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{ fontSize: 20, color: Colors.white }}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {SPOTLIGHT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const count =
              cat.key === 'FOR_YOU'
                ? MOCK_SPOTLIGHT_REELS.length
                : cat.key === 'FOLLOWING'
                ? MOCK_SPOTLIGHT_REELS.filter((r) => r.verified).length
                : MOCK_SPOTLIGHT_REELS.filter((r) => r.category === cat.key).length;

            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                onPress={() => handleCategoryChange(cat.key)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    isActive && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
                {count > 0 && isActive && (
                  <View style={styles.categoryCount}>
                    <Text style={styles.categoryCountText}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      {/* Vertical swipe reels */}
      {filteredReels.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={filteredReels}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ReelItem item={item} isActive={index === activeIndex} />
          )}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>Chưa có nội dung</Text>
          <Text style={styles.emptySubtitle}>
            Hãy quay lại sau hoặc chọn danh mục khác
          </Text>
        </View>
      )}
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },

  // Top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
    paddingBottom: 4,
  },
  topTitle: {
    ...Typography.h2,
    color: Colors.gold,
    fontWeight: '700',
  },

  // Scrollable categories
  categoriesContainer: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.s,
    gap: 6,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    gap: 4,
  },
  categoryTabActive: {
    backgroundColor: Colors.gold,
  },
  categoryIcon: { fontSize: 14 },
  categoryLabel: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: Colors.purpleDark,
    fontWeight: '700',
  },
  categoryCount: {
    backgroundColor: Colors.purpleDark,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginLeft: 2,
  },
  categoryCountText: {
    ...Typography.tiny,
    color: Colors.white,
    fontWeight: '700',
  },

  // Reel
  reelContainer: {
    width: SCREEN_WIDTH,
    position: 'relative',
  },
  reelBackground: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressFill: {
    height: 3,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    opacity: 0.3,
  },
  playBar: {
    width: 4,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },

  // Action bar (right side)
  actionBar: {
    position: 'absolute',
    right: 12,
    bottom: 220,
    alignItems: 'center',
    gap: 20,
  },
  actionItem: { alignItems: 'center' },
  actionIcon: { fontSize: 28 },
  actionCount: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
    marginTop: 2,
  },
  creatorAvatarWrap: {
    borderWidth: 2,
    borderColor: Colors.gold,
    borderRadius: 25,
    padding: 2,
  },
  followBadge: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followPlus: { fontSize: 14, color: Colors.purpleDark, fontWeight: '700' },

  // Bottom overlay
  bottomOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 60,
    paddingHorizontal: Spacing.l,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  creatorName: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.info,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: { fontSize: 9, color: Colors.white, fontWeight: '700' },
  reelTitle: {
    ...Typography.h3,
    color: Colors.white,
    marginBottom: 4,
  },
  reelDesc: {
    ...Typography.secondary,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    ...Typography.caption,
    color: Colors.gold,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ratingChip: {
    backgroundColor: 'rgba(253,184,19,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ratingText: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },
  targetChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  targetText: { ...Typography.caption, color: Colors.white },
  viewsText: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  ctaButton: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    ...Typography.body,
    color: Colors.purpleDark,
    fontWeight: '700',
  },

  // Service modal (gọi xe / đặt món)
  serviceModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  serviceModalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.l,
    paddingBottom: Spacing.xxl,
  },
  serviceModalTitle: {
    ...Typography.h3,
    color: Colors.purpleDark,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.m,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.medium,
    marginBottom: 8,
    gap: 12,
  },
  serviceOptionIcon: { fontSize: 24 },
  serviceOptionLabel: {
    ...Typography.body,
    color: Colors.purpleDark,
    fontWeight: '600',
  },
  serviceCancel: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  serviceCancelText: {
    ...Typography.body,
    color: Colors.gray,
    fontWeight: '500',
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.l },
  emptyTitle: { ...Typography.h2, color: Colors.white, marginBottom: 8 },
  emptySubtitle: {
    ...Typography.secondary,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
});
