import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { useCart, CartMerchant, CartItem } from '../contexts/CartContext';

export const CartScreen = ({ navigation }: any) => {
  const {
    merchants,
    totalItems,
    totalAmount,
    updateQuantity,
    updateNote,
    removeItem,
    clearCart,
  } = useCart();

  const [expandedMerchants, setExpandedMerchants] = useState<Set<string>>(new Set());

  const toggleMerchant = (merchantId: string) => {
    setExpandedMerchants((prev) => {
      const next = new Set(prev);
      if (next.has(merchantId)) {
        next.delete(merchantId);
      } else {
        next.add(merchantId);
      }
      return next;
    });
  };

  const handleClearCart = () => {
    Alert.alert('Xóa giỏ hàng', 'Bạn có chắc muốn xóa tất cả sản phẩm?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: clearCart },
    ]);
  };

  const handleCheckout = () => {
    navigation?.navigate('Checkout');
  };

  if (merchants.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Text style={styles.headerBack}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Giỏ Hàng</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
          <Text style={styles.emptyDesc}>Hãy thêm sản phẩm vào giỏ hàng nhé!</Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.continueButtonText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.headerBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ Hàng ({totalItems})</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.headerAction}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items by Merchant */}
        {merchants.map((merchant) => (
          <MerchantSection
            key={merchant.merchantId}
            merchant={merchant}
            expanded={expandedMerchants.has(merchant.merchantId)}
            onToggle={() => toggleMerchant(merchant.merchantId)}
            onUpdateQuantity={updateQuantity}
            onUpdateNote={updateNote}
            onRemoveItem={removeItem}
          />
        ))}

        <View style={{ height: 180 }} />
      </ScrollView>

      {/* Bottom Summary */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tạm tính ({totalItems} món)</Text>
          <Text style={styles.summaryValue}>{totalAmount.toLocaleString()}đ</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ─── Merchant Section Component ──────────────────────────────────────────────

interface MerchantSectionProps {
  merchant: CartMerchant;
  expanded: boolean;
  onToggle: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onUpdateNote: (itemId: string, note: string) => void;
  onRemoveItem: (itemId: string) => void;
}

const MerchantSection: React.FC<MerchantSectionProps> = ({
  merchant,
  expanded,
  onToggle,
  onUpdateQuantity,
  onUpdateNote,
  onRemoveItem,
}) => {
  return (
    <View style={styles.merchantSection}>
      {/* Merchant Header */}
      <TouchableOpacity style={styles.merchantHeader} onPress={onToggle}>
        <View style={{ flex: 1 }}>
          <Text style={styles.merchantName}>{merchant.merchantName}</Text>
          <Text style={styles.merchantInfo}>
            {merchant.items.length} món • {merchant.subtotal.toLocaleString()}đ
          </Text>
        </View>
        <Text style={styles.toggleIcon}>{expanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {/* Items */}
      {expanded &&
        merchant.items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onUpdateNote={onUpdateNote}
            onRemove={onRemoveItem}
          />
        ))}
    </View>
  );
};

// ─── Cart Item Row Component ─────────────────────────────────────────────────

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onUpdateNote: (itemId: string, note: string) => void;
  onRemove: (itemId: string) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onUpdateNote,
  onRemove,
}) => {
  const [showNoteInput, setShowNoteInput] = useState(false);

  return (
    <View style={styles.itemRow}>
      {/* Image */}
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      ) : (
        <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
          <Text style={styles.itemImageIcon}>
            {item.type === 'food' ? '🍜' : '🛍️'}
          </Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        {/* Name & Price */}
        <Text style={styles.itemName}>{item.name}</Text>
        {item.unit && <Text style={styles.itemUnit}>Đơn vị: {item.unit}</Text>}
        <Text style={styles.itemPrice}>{item.price.toLocaleString()}đ</Text>

        {/* Quantity Controls */}
        <View style={styles.quantityRow}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.itemSubtotal}>
            {(item.price * item.quantity).toLocaleString()}đ
          </Text>
        </View>

        {/* Note */}
        {showNoteInput ? (
          <TextInput
            style={styles.noteInput}
            placeholder="Ghi chú (vd: không hành)"
            value={item.note}
            onChangeText={(text) => onUpdateNote(item.id, text)}
            onBlur={() => setShowNoteInput(false)}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={() => setShowNoteInput(true)}>
            <Text style={styles.noteButton}>
              {item.note ? `📝 ${item.note}` : '+ Thêm ghi chú'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Remove Button */}
      <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
        <Text style={styles.removeButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerBack: { fontSize: 24, color: Colors.black },
  headerTitle: { ...Typography.h3, color: Colors.black },
  headerAction: { ...Typography.secondary, color: Colors.error, fontWeight: '600' },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  emptyIcon: { fontSize: 80, marginBottom: Spacing.l },
  emptyTitle: { ...Typography.h2, color: Colors.black, marginBottom: Spacing.s },
  emptyDesc: {
    ...Typography.secondary,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
  },
  continueButtonText: { ...Typography.body, color: Colors.white, fontWeight: '700' },

  // Merchant Section
  merchantSection: {
    backgroundColor: Colors.white,
    marginTop: Spacing.m,
    marginHorizontal: Spacing.m,
    borderRadius: BorderRadius.medium,
    ...Shadows.level1,
  },
  merchantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  merchantName: { ...Typography.body, fontWeight: '700', color: Colors.black },
  merchantInfo: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  toggleIcon: { fontSize: 16, color: Colors.gray },

  // Item Row
  itemRow: {
    flexDirection: 'row',
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.offWhite,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.small,
    marginRight: Spacing.m,
    backgroundColor: Colors.lightGray,
  },
  itemImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImageIcon: { fontSize: 32 },
  itemName: { ...Typography.secondary, fontWeight: '600', color: Colors.black },
  itemUnit: { ...Typography.tiny, color: Colors.gray, marginTop: 2 },
  itemPrice: { ...Typography.secondary, color: Colors.primary, marginTop: 4 },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.s,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.small,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: { ...Typography.body, color: Colors.primary, fontWeight: '700' },
  quantityText: {
    ...Typography.secondary,
    fontWeight: '600',
    color: Colors.black,
    minWidth: 32,
    textAlign: 'center',
  },
  itemSubtotal: { ...Typography.secondary, fontWeight: '700', color: Colors.black },

  noteInput: {
    ...Typography.caption,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.small,
    padding: Spacing.s,
    marginTop: Spacing.s,
  },
  noteButton: {
    ...Typography.caption,
    color: Colors.primary,
    marginTop: Spacing.s,
  },

  removeButton: {
    padding: Spacing.s,
    marginLeft: Spacing.s,
  },
  removeButtonText: { fontSize: 20 },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: Spacing.l,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    ...Shadows.level3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.m,
  },
  summaryLabel: { ...Typography.secondary, color: Colors.gray },
  summaryValue: { ...Typography.h3, fontWeight: '800', color: Colors.primary },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.l,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  checkoutButtonText: { ...Typography.body, color: Colors.white, fontWeight: '700', fontSize: 16 },
});
