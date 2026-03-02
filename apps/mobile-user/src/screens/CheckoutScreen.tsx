import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { useCart } from '../contexts/CartContext';
import {
  PaymentMethodSelector,
  DEFAULT_PAYMENT_METHODS,
  PaymentMethod,
} from '../components/PaymentMethodSelector';
import { QRPaymentModal } from '../components/QRPaymentModal';
import { ordersService } from '../services/orders.service';

export const CheckoutScreen = ({ navigation }: any) => {
  const { merchants, totalAmount, clearCart } = useCart();

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Delivery info
  const [address, setAddress] = useState('123 Nguyễn Du, Quận 1, TP.HCM');
  const [phone, setPhone] = useState('0901234567');
  const [note, setNote] = useState('');

  // Calculate totals
  const deliveryFee = merchants.reduce((sum, m) => sum + (m.deliveryFee || 0), 0);
  const finalTotal = totalAmount + deliveryFee + (selectedPayment?.fee || 0);

  const handleCheckout = async () => {
    if (!selectedPayment) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán');
      return;
    }

    if (selectedPayment.id === 'qr_sepay') {
      setShowQRModal(true);
      return;
    }

    try {
      for (const merchant of merchants) {
        await ordersService.create({
          merchantId: merchant.merchantId,
          type: merchant.type === 'food' ? 'FOOD_DELIVERY' : 'SHOPPING',
          items: merchant.items.map((item) => ({
            productId: item.productId || item.id,
            quantity: item.quantity,
            note: item.note,
          })),
          paymentMethod: selectedPayment.id,
          deliveryAddress: address,
          deliveryNote: note || undefined,
        });
      }
      handlePaymentSuccess();
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Thanh toán thất bại, thử lại sau');
    }
  };

  const handlePaymentSuccess = () => {
    setShowQRModal(false);
    clearCart();
    Alert.alert(
      'Thành công! 🎉',
      'Đơn hàng đã được xác nhận.\nBạn nhận được +50 Xu thưởng!',
      [
        {
          text: 'Về trang chủ',
          onPress: () => navigation?.navigate('MainTabs'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.headerBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh Toán</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📍</Text>
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
            <TouchableOpacity>
              <Text style={styles.editButton}>Sửa</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.addressName}>Nguyễn Văn An</Text>
            <Text style={styles.addressPhone}>{phone}</Text>
            <Text style={styles.addressDetail}>{address}</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📦</Text>
            <Text style={styles.sectionTitle}>Đơn hàng</Text>
          </View>
          {merchants.map((merchant) => (
            <View key={merchant.merchantId} style={styles.card}>
              <Text style={styles.merchantName}>{merchant.merchantName}</Text>
              {merchant.items.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                  <Text style={styles.orderItemQty}>{item.quantity}x</Text>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                  <Text style={styles.orderItemPrice}>
                    {(item.price * item.quantity).toLocaleString()}đ
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Note */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📝</Text>
            <Text style={styles.sectionTitle}>Ghi chú cho tài xế</Text>
          </View>
          <TextInput
            style={styles.noteInput}
            placeholder="Ví dụ: Gọi điện trước khi đến..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>💳</Text>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          </View>
          <PaymentMethodSelector
            amount={totalAmount}
            methods={DEFAULT_PAYMENT_METHODS}
            selectedMethod={selectedPayment?.id}
            onSelectMethod={setSelectedPayment}
            showXuBonus
          />
        </View>

        {/* Price Summary */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tạm tính</Text>
              <Text style={styles.priceValue}>{totalAmount.toLocaleString()}đ</Text>
            </View>
            {deliveryFee > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Phí giao hàng</Text>
                <Text style={styles.priceValue}>{deliveryFee.toLocaleString()}đ</Text>
              </View>
            )}
            {selectedPayment?.fee && selectedPayment.fee > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Phí thanh toán</Text>
                <Text style={[styles.priceValue, { color: Colors.error }]}>
                  +{selectedPayment.fee > 1 ? selectedPayment.fee.toLocaleString() : (totalAmount * selectedPayment.fee).toLocaleString()}đ
                </Text>
              </View>
            )}
            {selectedPayment?.xuBonus && (
              <View style={[styles.priceRow, styles.xuRow]}>
                <Text style={styles.xuLabel}>🎁 Xu thưởng</Text>
                <Text style={styles.xuValue}>+{selectedPayment.xuBonus} Xu</Text>
              </View>
            )}
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>{finalTotal.toLocaleString()}đ</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <View style={{ flex: 1, marginRight: Spacing.m }}>
          <Text style={styles.bottomLabel}>Tổng thanh toán</Text>
          <Text style={styles.bottomTotal}>{finalTotal.toLocaleString()}đ</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, !selectedPayment && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={!selectedPayment}
        >
          <Text style={styles.checkoutButtonText}>
            {selectedPayment?.id === 'qr_sepay' ? 'Quét QR Thanh Toán' : 'Đặt Hàng'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* QR Payment Modal */}
      <QRPaymentModal
        visible={showQRModal}
        amount={finalTotal}
        orderCode={`LS-${Date.now()}`}
        onClose={() => setShowQRModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </SafeAreaView>
  );
};

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

  // Section
  section: { marginTop: Spacing.l, paddingHorizontal: Spacing.l },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  sectionIcon: { fontSize: 20, marginRight: Spacing.s },
  sectionTitle: { ...Typography.body, fontWeight: '700', color: Colors.black, flex: 1 },
  editButton: { ...Typography.secondary, color: Colors.primary, fontWeight: '600' },

  // Card
  card: {
    backgroundColor: Colors.white,
    padding: Spacing.l,
    borderRadius: BorderRadius.medium,
    ...Shadows.level1,
  },

  // Address
  addressName: { ...Typography.body, fontWeight: '700', color: Colors.black },
  addressPhone: { ...Typography.secondary, color: Colors.gray, marginTop: 2 },
  addressDetail: {
    ...Typography.secondary,
    color: Colors.darkGray,
    marginTop: Spacing.s,
    lineHeight: 18,
  },

  // Merchant
  merchantName: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.s,
  },

  // Order Items
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.s,
  },
  orderItemQty: {
    ...Typography.caption,
    color: Colors.gray,
    width: 40,
  },
  orderItemName: {
    ...Typography.secondary,
    color: Colors.darkGray,
    flex: 1,
  },
  orderItemPrice: {
    ...Typography.secondary,
    fontWeight: '600',
    color: Colors.black,
  },

  // Note Input
  noteInput: {
    ...Typography.secondary,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Price Rows
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.s,
  },
  priceLabel: { ...Typography.secondary, color: Colors.gray },
  priceValue: { ...Typography.secondary, fontWeight: '600', color: Colors.black },

  xuRow: {
    backgroundColor: Colors.gold + '10',
    marginHorizontal: -Spacing.l,
    paddingHorizontal: Spacing.l,
    marginVertical: Spacing.s,
  },
  xuLabel: { ...Typography.secondary, color: Colors.gold, fontWeight: '600' },
  xuValue: { ...Typography.secondary, color: Colors.gold, fontWeight: '700' },

  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    marginTop: Spacing.s,
    paddingTop: Spacing.m,
  },
  totalLabel: { ...Typography.body, fontWeight: '700', color: Colors.black },
  totalValue: { ...Typography.h3, fontWeight: '800', color: Colors.primary },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.l,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    ...Shadows.level3,
  },
  bottomLabel: { ...Typography.caption, color: Colors.gray },
  bottomTotal: { ...Typography.h3, fontWeight: '800', color: Colors.primary },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
  },
  checkoutButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  checkoutButtonText: { ...Typography.body, color: Colors.white, fontWeight: '700' },
});
