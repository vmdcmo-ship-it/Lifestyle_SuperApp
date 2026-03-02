import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { insuranceService } from '../services/insurance.service';
import { isDemoDriverEmail } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { INSURANCE_PRODUCT_CATALOG } from '../data/insuranceProducts';

function formatVND(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + 'đ';
}

export function InsuranceProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { user } = useAuth();
  const isDemo = isDemoDriverEmail(user?.email ?? null);
  const productId = route.params?.productId ?? '';

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [paymentPeriod, setPaymentPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [submitting, setSubmitting] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryPhone, setBeneficiaryPhone] = useState('');

  const catalogProduct = INSURANCE_PRODUCT_CATALOG.find((p) => p.id === productId);

  const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const loadProduct = useCallback(async () => {
    if (isDemo || !productId || !isUuid(productId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await insuranceService.getProduct(productId);
      setProduct(res);
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [isDemo, productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handlePurchase = async () => {
    if (isDemo) {
      Alert.alert('Thông báo', 'Tài khoản demo chưa hỗ trợ mua bảo hiểm. Vui lòng đăng nhập tài khoản thật.');
      return;
    }
    if (!product) {
      Alert.alert('Lỗi', 'Không tìm thấy sản phẩm.');
      return;
    }
    setSubmitting(true);
    try {
      const startDate = new Date();
      startDate.setDate(1);
      const startStr = startDate.toISOString().slice(0, 10);
      await insuranceService.purchasePolicy({
        productId: product.id,
        startDate: startStr,
        paymentPeriod,
        beneficiaryName: beneficiaryName.trim() || undefined,
        beneficiaryPhone: beneficiaryPhone.trim() || undefined,
      });
      Alert.alert('Thành công', 'Đăng ký bảo hiểm thành công! Bạn có thể xem hợp đồng tại mục Bảo hiểm của tôi.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message ?? 'Không thể đăng ký. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !isDemo) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayProduct = product ?? catalogProduct;
  const premium = product
    ? paymentPeriod === 'yearly'
      ? Number(product.premiumYearly ?? product.premium_yearly ?? 0)
      : Number(product.premiumMonthly ?? product.premium_monthly ?? 0)
    : 0;
  const canPurchase = !!product && !isDemo;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.productCard, catalogProduct && { backgroundColor: catalogProduct.color }]}>
          <Text style={styles.productIcon}>{catalogProduct?.icon ?? '📋'}</Text>
          <Text style={[styles.productTitle, catalogProduct && { color: catalogProduct.textColor }]}>
            {displayProduct?.name ?? displayProduct?.title ?? 'Bảo hiểm'}
          </Text>
          <Text style={[styles.productSubtitle, catalogProduct && { color: catalogProduct.textColor }]}>
            {displayProduct?.description ?? displayProduct?.subtitle ?? ''}
          </Text>
        </View>

        {product && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin gói</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nhà cung cấp</Text>
                <Text style={styles.infoValue}>{product.provider ?? '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mức bồi thường</Text>
                <Text style={styles.infoValue}>{formatVND(Number(product.coverageAmount ?? 0))}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chọn kỳ đóng</Text>
              <View style={styles.periodRow}>
                <TouchableOpacity
                  style={[styles.periodBtn, paymentPeriod === 'monthly' && styles.periodBtnActive]}
                  onPress={() => setPaymentPeriod('monthly')}
                >
                  <Text style={[styles.periodLabel, paymentPeriod === 'monthly' && styles.periodLabelActive]}>
                    Hàng tháng
                  </Text>
                  <Text style={[styles.periodPrice, paymentPeriod === 'monthly' && styles.periodPriceActive]}>
                    {formatVND(Number(product.premiumMonthly ?? 0))}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.periodBtn, paymentPeriod === 'yearly' && styles.periodBtnActive]}
                  onPress={() => setPaymentPeriod('yearly')}
                >
                  <Text style={[styles.periodLabel, paymentPeriod === 'yearly' && styles.periodLabelActive]}>
                    Hàng năm
                  </Text>
                  <Text style={[styles.periodPrice, paymentPeriod === 'yearly' && styles.periodPriceActive]}>
                    {formatVND(Number(product.premiumYearly ?? 0))}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Người thụ hưởng (tùy chọn)</Text>
              <TextInput
                style={styles.input}
                value={beneficiaryName}
                onChangeText={setBeneficiaryName}
                placeholder="Họ tên người thụ hưởng"
                placeholderTextColor={Colors.gray}
              />
              <TextInput
                style={styles.input}
                value={beneficiaryPhone}
                onChangeText={setBeneficiaryPhone}
                placeholder="Số điện thoại"
                placeholderTextColor={Colors.gray}
                keyboardType="phone-pad"
              />
            </View>

            {canPurchase && (
              <TouchableOpacity
                style={[styles.purchaseBtn, submitting && styles.purchaseBtnDisabled]}
                onPress={handlePurchase}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={Colors.purpleDark} />
                ) : (
                  <Text style={styles.purchaseBtnText}>
                    Xác nhận đăng ký · {formatVND(premium)}/{paymentPeriod === 'yearly' ? 'năm' : 'tháng'}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </>
        )}

        {!product && !isDemo && catalogProduct && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Sản phẩm chưa có trên hệ thống</Text>
            <Text style={styles.emptyHint}>
              Bạn có thể cập nhật BH TNDS tại mục Phương tiện hoặc liên hệ hỗ trợ để đăng ký gói {catalogProduct.title}.
            </Text>
          </View>
        )}

        {isDemo && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Tài khoản demo</Text>
            <Text style={styles.emptyHint}>Đăng nhập tài khoản thật để mua bảo hiểm.</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { ...Typography.body, color: Colors.gray },
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
  backText: { ...Typography.body, color: Colors.info, fontWeight: '600' },
  headerTitle: { ...Typography.h3, color: Colors.purpleDark },
  scroll: { flex: 1 },
  productCard: {
    margin: Spacing.l,
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    ...Shadows.level1,
  },
  productIcon: { fontSize: 48, marginBottom: Spacing.m },
  productTitle: { ...Typography.h2, color: Colors.black, marginBottom: 4 },
  productSubtitle: { ...Typography.secondary, color: Colors.darkGray },
  section: { padding: Spacing.l, paddingTop: 0 },
  sectionTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.s, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  infoLabel: { ...Typography.body, color: Colors.gray },
  infoValue: { ...Typography.body, fontWeight: '600', color: Colors.black },
  periodRow: { flexDirection: 'row', gap: Spacing.m },
  periodBtn: {
    flex: 1,
    padding: Spacing.l,
    borderRadius: BorderRadius.medium,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    alignItems: 'center',
  },
  periodBtnActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '15' },
  periodLabel: { ...Typography.body, color: Colors.gray },
  periodLabelActive: { color: Colors.purpleDark, fontWeight: '600' },
  periodPrice: { ...Typography.h3, color: Colors.black, marginTop: 4 },
  periodPriceActive: { color: Colors.purpleDark },
  input: {
    ...Typography.body,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  purchaseBtn: {
    marginHorizontal: Spacing.l,
    marginTop: Spacing.l,
    padding: Spacing.l,
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  purchaseBtnDisabled: { opacity: 0.7 },
  purchaseBtnText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  emptyCard: {
    margin: Spacing.l,
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    ...Shadows.level1,
  },
  emptyText: { ...Typography.body, fontWeight: '600', color: Colors.black },
  emptyHint: { ...Typography.caption, color: Colors.gray, marginTop: 8 },
});
