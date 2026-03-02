import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

export type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  priority: number;
  recommended?: boolean;
  fee: number; // Percentage (0-1) or fixed amount
  xuBonus?: number;
  processingTime?: string;
  badge?: string;
  balance?: number; // For wallet
  lastDigits?: string; // For cards/e-wallets
  description?: string;
};

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'qr_sepay',
    name: 'QR Code - Chuyển khoản',
    icon: '🏆',
    priority: 1,
    recommended: true,
    fee: 0,
    xuBonus: 50,
    processingTime: '< 30s',
    badge: 'ĐỀ XUẤT',
    description: 'Nhanh nhất • Miễn phí • Tặng thêm Xu',
  },
  {
    id: 'lifestyle_wallet',
    name: 'Ví Lifestyle',
    icon: '💰',
    priority: 2,
    fee: 0,
    xuBonus: 0,
    balance: 2450000,
    description: 'Thanh toán tức thì',
  },
  {
    id: 'momo',
    name: 'MoMo',
    icon: '🟣',
    priority: 3,
    fee: 0,
    xuBonus: 0,
    lastDigits: '****0800',
    description: 'Ví điện tử',
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    icon: '🔷',
    priority: 4,
    fee: 0,
    xuBonus: 0,
    lastDigits: '****0567',
    description: 'Ví điện tử',
  },
  {
    id: 'atm_card',
    name: 'Thẻ ATM/Visa',
    icon: '💳',
    priority: 5,
    fee: 0,
    xuBonus: 0,
    description: 'Thẻ ngân hàng',
  },
  {
    id: 'cod',
    name: 'COD - Thanh toán khi nhận',
    icon: '💵',
    priority: 6,
    fee: 15000, // Fixed fee
    xuBonus: 0,
    description: 'Phí thu hộ: 15,000đ',
  },
];

interface PaymentMethodSelectorProps {
  amount: number;
  methods?: PaymentMethod[];
  selectedMethod?: string;
  onSelectMethod: (method: PaymentMethod) => void;
  onConfirm?: () => void;
  showXuBonus?: boolean;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  methods = DEFAULT_PAYMENT_METHODS,
  selectedMethod,
  onSelectMethod,
  onConfirm,
  showXuBonus = true,
}) => {
  const sortedMethods = [...methods].sort((a, b) => a.priority - b.priority);
  const recommended = sortedMethods.find((m) => m.recommended);
  const others = sortedMethods.filter((m) => !m.recommended);

  const calculateTotal = (method: PaymentMethod) => {
    const fee = method.fee > 1 ? method.fee : amount * method.fee;
    return amount + fee;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn Phương Thức Thanh Toán</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recommended Method */}
        {recommended && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>⭐ ĐỀ XUẤT CHO BẠN</Text>
            <TouchableOpacity
              style={[
                styles.recommendedCard,
                selectedMethod === recommended.id && styles.selectedCard,
              ]}
              onPress={() => onSelectMethod(recommended)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodIcon}>{recommended.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recommendedName}>{recommended.name}</Text>
                    <Text style={styles.recommendedDesc}>
                      {recommended.description}
                    </Text>
                  </View>
                </View>
                {recommended.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{recommended.badge}</Text>
                  </View>
                )}
              </View>

              {showXuBonus && recommended.xuBonus && (
                <View style={styles.xuBonusRow}>
                  <Text style={styles.xuBonusIcon}>🎁</Text>
                  <Text style={styles.xuBonusText}>
                    +{recommended.xuBonus} Xu thưởng
                  </Text>
                </View>
              )}

              <View style={styles.selectButton}>
                <Text style={styles.selectButtonText}>
                  {selectedMethod === recommended.id ? '✓ Đã chọn' : 'Chọn ngay'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Other Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Phương thức khác:</Text>
          {others.map((method) => {
            const isSelected = selectedMethod === method.id;
            const canUse =
              method.id !== 'lifestyle_wallet' || (method.balance && method.balance >= amount);

            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  isSelected && styles.selectedCard,
                  !canUse && styles.disabledCard,
                ]}
                onPress={() => canUse && onSelectMethod(method)}
                disabled={!canUse}
              >
                <View style={styles.radio}>
                  {isSelected && <View style={styles.radioActive} />}
                </View>

                <Text style={styles.methodIcon}>{method.icon}</Text>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.methodName, !canUse && styles.disabledText]}>
                    {method.name}
                  </Text>
                  {method.lastDigits && (
                    <Text style={styles.methodDetail}>{method.lastDigits}</Text>
                  )}
                  {method.balance !== undefined && (
                    <Text
                      style={[
                        styles.methodDetail,
                        !canUse && { color: Colors.error },
                      ]}
                    >
                      Số dư: {method.balance.toLocaleString()}đ
                      {!canUse && ' (Không đủ)'}
                    </Text>
                  )}
                  {method.fee > 0 && (
                    <Text style={styles.feeText}>
                      Phí: {method.fee > 1 ? `${method.fee.toLocaleString()}đ` : `${(method.fee * 100).toFixed(1)}%`}
                    </Text>
                  )}
                </View>

                {method.xuBonus && showXuBonus && (
                  <Text style={styles.xuBadge}>+{method.xuBonus} Xu</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{amount.toLocaleString()}đ</Text>
          </View>
          {selectedMethod && (
            <>
              {(() => {
                const method = methods.find((m) => m.id === selectedMethod);
                if (!method) return null;
                const fee = method.fee > 1 ? method.fee : amount * method.fee;
                if (fee === 0) return null;
                return (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Phí thanh toán</Text>
                    <Text style={styles.summaryValue}>{fee.toLocaleString()}đ</Text>
                  </View>
                );
              })()}
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Tổng cộng</Text>
                <Text style={styles.totalValue}>
                  {calculateTotal(
                    methods.find((m) => m.id === selectedMethod)!
                  ).toLocaleString()}đ
                </Text>
              </View>
            </>
          )}
        </View>

        {onConfirm && (
          <TouchableOpacity
            style={[styles.confirmButton, !selectedMethod && styles.confirmButtonDisabled]}
            onPress={onConfirm}
            disabled={!selectedMethod}
          >
            <Text style={styles.confirmButtonText}>Xác Nhận Thanh Toán</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: {
    ...Typography.h3,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    color: Colors.black,
  },

  // Section
  section: { paddingHorizontal: Spacing.l, marginBottom: Spacing.l },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.gray,
    fontWeight: '700',
    marginBottom: Spacing.s,
    textTransform: 'uppercase',
  },

  // Recommended Card
  recommendedCard: {
    backgroundColor: Colors.gold + '10',
    borderRadius: BorderRadius.large,
    borderWidth: 2,
    borderColor: Colors.gold,
    padding: Spacing.l,
    ...Shadows.level2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.m,
  },
  methodInfo: { flexDirection: 'row', flex: 1 },
  methodIcon: { fontSize: 28, marginRight: Spacing.m },
  recommendedName: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.black,
  },
  recommendedDesc: {
    ...Typography.caption,
    color: Colors.darkGray,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...Typography.tiny,
    color: Colors.white,
    fontWeight: '700',
  },

  xuBonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.m,
  },
  xuBonusIcon: { fontSize: 20, marginRight: Spacing.s },
  xuBonusText: {
    ...Typography.secondary,
    color: Colors.gold,
    fontWeight: '700',
  },

  selectButton: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  selectButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },

  // Method Card
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.s,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  selectedCard: {
    borderColor: Colors.gold,
    borderWidth: 2,
    backgroundColor: Colors.gold + '05',
  },
  disabledCard: {
    opacity: 0.5,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray,
    marginRight: Spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gold,
  },

  methodName: {
    ...Typography.secondary,
    fontWeight: '600',
    color: Colors.black,
  },
  methodDetail: {
    ...Typography.caption,
    color: Colors.gray,
    marginTop: 2,
  },
  feeText: {
    ...Typography.tiny,
    color: Colors.error,
    marginTop: 2,
  },
  disabledText: { color: Colors.gray },

  xuBadge: {
    ...Typography.tiny,
    color: Colors.gold,
    fontWeight: '700',
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },

  // Summary
  summary: {
    backgroundColor: Colors.white,
    padding: Spacing.l,
    borderRadius: BorderRadius.medium,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,
    ...Shadows.level1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.s,
  },
  summaryLabel: { ...Typography.secondary, color: Colors.gray },
  summaryValue: { ...Typography.secondary, color: Colors.black, fontWeight: '600' },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.s,
    marginTop: Spacing.s,
    marginBottom: 0,
  },
  totalLabel: { ...Typography.body, fontWeight: '700', color: Colors.black },
  totalValue: { ...Typography.h3, color: Colors.primary, fontWeight: '800' },

  // Confirm Button
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.l,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.xl,
    ...Shadows.level2,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  confirmButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
