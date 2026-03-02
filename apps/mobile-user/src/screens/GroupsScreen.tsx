import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { Card } from '../components/ui';
import { RUN_GROUPS } from '../data/mockData';

export const GroupsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.headerBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhóm chạy</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Empty state message */}
        <View style={styles.emptySection}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyTitle}>Bạn chưa tham gia nhóm nào.</Text>
          <Text style={styles.emptyDesc}>
            Hãy tham gia một nhóm để cùng nhau hoạt động và có thêm nhiều bạn mới.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]}>
            <Text style={styles.actionBtnText}>Tạo nhóm mới</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={[styles.actionBtnText, { color: Colors.primary }]}>
              Tham gia
            </Text>
          </TouchableOpacity>
        </View>

        {/* Suggested groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>

          {RUN_GROUPS.map((group) => (
            <Card key={group.id} style={styles.groupCard}>
              <Image source={{ uri: group.image }} style={styles.groupImage} />
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupMembers}>{group.members} thành viên</Text>
                <View style={styles.groupFooter}>
                  <View
                    style={[
                      styles.statusBadge,
                      group.status === 'PRIVATE' && styles.statusBadgePrivate,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        group.status === 'PRIVATE' && styles.statusTextPrivate,
                      ]}
                    >
                      {group.status === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.joinBtn}>
                    <Text style={styles.joinBtnText}>Tham gia</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={{ height: 80 }} />
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerBack: { fontSize: 24, color: Colors.purpleDark },
  headerTitle: {
    ...Typography.h3,
    flex: 1,
    marginLeft: Spacing.m,
    color: Colors.black,
  },
  settingsBtn: { padding: 4 },
  settingsIcon: { fontSize: 20 },

  // Empty state
  emptySection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.m },
  emptyTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.s },
  emptyDesc: {
    ...Typography.secondary,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.l,
    gap: Spacing.m,
    marginBottom: Spacing.l,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionBtnText: { ...Typography.body, fontWeight: '700', color: Colors.white },

  // Groups
  section: { paddingHorizontal: Spacing.l },
  sectionTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },

  groupCard: {
    flexDirection: 'row',
    marginBottom: Spacing.m,
    padding: 0,
    overflow: 'hidden',
  },
  groupImage: {
    width: 90,
    height: 90,
    backgroundColor: Colors.lightGray,
  },
  groupInfo: {
    flex: 1,
    padding: Spacing.m,
    justifyContent: 'space-between',
  },
  groupName: { ...Typography.body, fontWeight: '700', color: Colors.black },
  groupMembers: { ...Typography.caption, color: Colors.gray },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgePrivate: { backgroundColor: Colors.gray + '20' },
  statusText: { ...Typography.tiny, color: Colors.success, fontWeight: '600' },
  statusTextPrivate: { color: Colors.gray },
  joinBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: BorderRadius.small,
  },
  joinBtnText: { ...Typography.caption, color: Colors.white, fontWeight: '600' },
});
