import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { MOCK_PRODUCTS } from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export const ProductsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Add product form state
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Phở');

  const categories = [...new Set(MOCK_PRODUCTS.map((p) => p.category))];

  const filteredProducts = searchText
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchText.toLowerCase()) ||
          p.category.toLowerCase().includes(searchText.toLowerCase()),
      )
    : MOCK_PRODUCTS;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sản phẩm</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addBtnText}>
            {showAddForm ? '✕ Đóng' : '+ Thêm mới'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm sản phẩm..."
            placeholderTextColor={Colors.gray}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ─── Add Product Form ───────────────────────────── */}
        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>📝 Thêm sản phẩm mới</Text>

            {/* Image upload */}
            <TouchableOpacity style={styles.imageUpload}>
              <Text style={styles.imageUploadIcon}>📷</Text>
              <Text style={styles.imageUploadText}>Thêm ảnh sản phẩm</Text>
              <Text style={styles.imageUploadHint}>JPG, PNG (max 5MB)</Text>
            </TouchableOpacity>

            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Tên sản phẩm *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="VD: Phở Bò Đặc Biệt"
                placeholderTextColor={Colors.gray}
                value={newName}
                onChangeText={setNewName}
              />
            </View>

            {/* Price */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Giá (VNĐ) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="VD: 55000"
                placeholderTextColor={Colors.gray}
                value={newPrice}
                onChangeText={setNewPrice}
                keyboardType="numeric"
              />
            </View>

            {/* Category */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Danh mục</Text>
              <View style={styles.categoryRow}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      newCategory === cat && styles.categoryChipActive,
                    ]}
                    onPress={() => setNewCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        newCategory === cat && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Mô tả</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Mô tả chi tiết sản phẩm..."
                placeholderTextColor={Colors.gray}
                value={newDesc}
                onChangeText={setNewDesc}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* AI SEO suggestion */}
            <View style={styles.aiSuggestion}>
              <Text style={styles.aiIcon}>🤖</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiTitle}>Gợi ý AI SEO</Text>
                <Text style={styles.aiText}>
                  Thêm từ khóa: "truyền thống", "nước dùng", "Sài Gòn" để tăng
                  khả năng tìm kiếm.
                </Text>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitText}>Lưu sản phẩm</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── Products List ──────────────────────────────── */}
        <View style={styles.statsBar}>
          <Text style={styles.statsBarText}>
            {MOCK_PRODUCTS.filter((p) => p.status === 'ACTIVE').length} đang bán •{' '}
            {MOCK_PRODUCTS.filter((p) => p.status === 'OUT_OF_STOCK').length} hết hàng
          </Text>
        </View>

        {filteredProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productImage}>
              <Text style={{ fontSize: 32 }}>
                {product.category === 'Phở'
                  ? '🍜'
                  : product.category === 'Bún'
                  ? '🍲'
                  : product.category === 'Đồ uống'
                  ? '🧊'
                  : '🥗'}
              </Text>
            </View>
            <View style={styles.productInfo}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{product.name}</Text>
                <View
                  style={[
                    styles.productStatus,
                    {
                      backgroundColor:
                        product.status === 'ACTIVE'
                          ? '#E8F5E9'
                          : '#FFEBEE',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.productStatusText,
                      {
                        color:
                          product.status === 'ACTIVE'
                            ? Colors.success
                            : Colors.error,
                      },
                    ]}
                  >
                    {product.status === 'ACTIVE' ? 'Đang bán' : 'Hết hàng'}
                  </Text>
                </View>
              </View>
              <Text style={styles.productPrice}>{formatVND(product.price)}</Text>
              <Text style={styles.productDesc} numberOfLines={1}>
                {product.description}
              </Text>
              <View style={styles.productMeta}>
                <Text style={styles.productSold}>📦 {product.sold} đã bán</Text>
                <Text style={styles.productRating}>⭐ {product.rating}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.l,
    backgroundColor: Colors.white,
  },
  title: { ...Typography.h1, color: Colors.black },
  addBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.medium,
  },
  addBtnText: { ...Typography.secondary, color: Colors.purpleDark, fontWeight: '700' },

  searchContainer: { paddingHorizontal: Spacing.l, paddingBottom: Spacing.m, backgroundColor: Colors.white },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.m,
    height: 40,
  },
  searchInput: { flex: 1, ...Typography.secondary, color: Colors.black },

  // Add form
  addForm: {
    backgroundColor: Colors.white,
    margin: Spacing.l,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level2,
  },
  formTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.l },
  imageUpload: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  imageUploadIcon: { fontSize: 36, marginBottom: 8 },
  imageUploadText: { ...Typography.body, color: Colors.darkGray, fontWeight: '500' },
  imageUploadHint: { ...Typography.caption, color: Colors.gray, marginTop: 4 },

  fieldGroup: { marginBottom: Spacing.l },
  fieldLabel: { ...Typography.secondary, color: Colors.darkGray, fontWeight: '600', marginBottom: 6 },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.m,
    ...Typography.body,
    color: Colors.black,
  },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: Spacing.m },

  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.s },
  categoryChip: {
    paddingHorizontal: Spacing.m,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  categoryChipActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '15' },
  categoryChipText: { ...Typography.secondary, color: Colors.gray },
  categoryChipTextActive: { color: Colors.purpleDark, fontWeight: '600' },

  aiSuggestion: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    gap: 8,
    marginBottom: Spacing.l,
  },
  aiIcon: { fontSize: 20 },
  aiTitle: { ...Typography.secondary, color: Colors.info, fontWeight: '600' },
  aiText: { ...Typography.caption, color: Colors.darkGray, marginTop: 2 },

  submitBtn: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },

  // Stats
  statsBar: { paddingHorizontal: Spacing.l, paddingVertical: Spacing.m },
  statsBarText: { ...Typography.secondary, color: Colors.gray },

  // Product card
  productCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.s,
    borderRadius: BorderRadius.large,
    padding: Spacing.m,
    ...Shadows.level1,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: { flex: 1, marginLeft: Spacing.m },
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { ...Typography.body, fontWeight: '600', color: Colors.black, flex: 1 },
  productStatus: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginLeft: 4 },
  productStatusText: { ...Typography.tiny, fontWeight: '700' },
  productPrice: { ...Typography.h3, color: Colors.gold, marginTop: 2 },
  productDesc: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  productMeta: { flexDirection: 'row', gap: Spacing.l, marginTop: 4 },
  productSold: { ...Typography.tiny, color: Colors.gray },
  productRating: { ...Typography.tiny, color: Colors.gold, fontWeight: '600' },
  editBtn: { justifyContent: 'center', paddingLeft: Spacing.s },
  editIcon: { fontSize: 18 },
});
