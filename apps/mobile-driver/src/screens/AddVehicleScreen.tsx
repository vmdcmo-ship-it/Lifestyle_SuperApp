import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { driverService } from '../services/driver.service';
import { useAuth } from '../context/AuthContext';
import { isDemoDriverEmail } from '../data/mockData';
import {
  VEHICLE_GROUPS,
  getVehicleTypeForClass,
  type VehicleTypeValue,
} from '../constants/vehicleTypes';
import { PLACEHOLDER_IMAGE_URL } from '../constants/upload';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

type Step = 1 | 2 | 3;

export function AddVehicleScreen() {
  const navigation = useNavigation();
  const isDemo = isDemoDriverEmail(useAuth().user?.email ?? null);

  const [step, setStep] = useState<Step>(1);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleTypeValue | null>(null);
  const [selectedVehicleClass, setSelectedVehicleClass] = useState<string | null>(null);

  const [licensePlate, setLicensePlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [registrationIssueDate, setRegistrationIssueDate] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insuranceIssueDate, setInsuranceIssueDate] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [inspectionNumber, setInspectionNumber] = useState('');
  const [inspectionIssueDate, setInspectionIssueDate] = useState('');
  const [inspectionExpiry, setInspectionExpiry] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const group = VEHICLE_GROUPS.find((g) => g.id === selectedGroupId);
  const needClassSelection = group && (group.vehicleTypes[0] === 'TRUCK' || group.vehicleTypes.length > 1);

  const canGoStep2 = selectedGroupId && (group?.vehicleTypes.length === 1 && group.vehicleTypes[0] !== 'TRUCK' ? true : !!selectedVehicleType || !!selectedVehicleClass);
  const vehicleTypeForApi: VehicleTypeValue =
    selectedVehicleType ?? (selectedVehicleClass ? getVehicleTypeForClass(selectedVehicleClass) : 'BIKE');
  const vehicleClassForApi = selectedVehicleClass && vehicleTypeForApi === 'TRUCK' ? selectedVehicleClass : undefined;

  const handleGroupSelect = (id: string) => {
    setSelectedGroupId(id);
    setSelectedVehicleType(null);
    setSelectedVehicleClass(null);
    const g = VEHICLE_GROUPS.find((x) => x.id === id);
    if (g && g.vehicleTypes.length === 1 && g.vehicleTypes[0] !== 'TRUCK') {
      setSelectedVehicleType(g.vehicleTypes[0]);
    }
  };

  const handleStep2Select = (value: string) => {
    if (group?.id === 'TRUCK') {
      setSelectedVehicleClass(value);
      setSelectedVehicleType('TRUCK');
    } else {
      setSelectedVehicleType(value as VehicleTypeValue);
      setSelectedVehicleClass(null);
    }
  };

  const validateStep3 = () => {
    if (!licensePlate.trim()) return 'Vui lòng nhập biển số xe.';
    if (!brand.trim()) return 'Vui lòng nhập thương hiệu.';
    if (!model.trim()) return 'Vui lòng nhập model/dòng xe.';
    if (!color.trim()) return 'Vui lòng nhập màu sắc.';
    const y = parseInt(year, 10);
    if (!year || isNaN(y) || y < 1990 || y > new Date().getFullYear() + 1) return 'Vui lòng nhập năm sản xuất hợp lệ.';
    if (!registrationNumber.trim()) return 'Vui lòng nhập số đăng ký xe.';
    if (!registrationIssueDate.trim()) return 'Vui lòng nhập ngày cấp đăng ký.';
    if (!insuranceNumber.trim()) return 'Vui lòng nhập số bảo hiểm.';
    if (!insuranceProvider.trim()) return 'Vui lòng nhập nhà bảo hiểm.';
    if (!insuranceIssueDate.trim()) return 'Vui lòng nhập ngày cấp bảo hiểm.';
    if (!insuranceExpiry.trim()) return 'Vui lòng nhập ngày hết hạn bảo hiểm.';
    const needsInspection = vehicleTypeForApi === 'CAR_4_SEATS' || vehicleTypeForApi === 'CAR_7_SEATS' || vehicleTypeForApi === 'TRUCK';
    if (needsInspection) {
      if (!inspectionNumber.trim()) return 'Vui lòng nhập số giấy kiểm định (bắt buộc với ô tô, xe tải).';
      if (!inspectionIssueDate.trim()) return 'Vui lòng nhập ngày cấp giấy kiểm định.';
      if (!inspectionExpiry.trim()) return 'Vui lòng nhập ngày hết hạn giấy kiểm định.';
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validateStep3();
    if (err) {
      Alert.alert('Thiếu thông tin', err);
      return;
    }
    if (isDemo) {
      Alert.alert('Demo', 'Tài khoản demo không thêm xe thật. Đăng nhập tài khoản tài xế thật để thêm xe.');
      return;
    }
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        vehicleType: vehicleTypeForApi,
        vehicleClass: vehicleClassForApi,
        licensePlate: licensePlate.trim(),
        brand: brand.trim(),
        model: model.trim(),
        year: parseInt(year, 10),
        color: color.trim(),
        frontImage: PLACEHOLDER_IMAGE_URL,
        backImage: PLACEHOLDER_IMAGE_URL,
        leftImage: PLACEHOLDER_IMAGE_URL,
        rightImage: PLACEHOLDER_IMAGE_URL,
        plateCloseupImage: PLACEHOLDER_IMAGE_URL,
        registrationNumber: registrationNumber.trim(),
        registrationIssueDate: registrationIssueDate.trim(),
        registrationImage: PLACEHOLDER_IMAGE_URL,
        insuranceNumber: insuranceNumber.trim(),
        insuranceProvider: insuranceProvider.trim(),
        insuranceIssueDate: insuranceIssueDate.trim(),
        insuranceExpiry: insuranceExpiry.trim(),
        insuranceImage: PLACEHOLDER_IMAGE_URL,
      };
      if (vehicleTypeForApi === 'CAR_4_SEATS' || vehicleTypeForApi === 'CAR_7_SEATS' || vehicleTypeForApi === 'TRUCK') {
        payload.inspectionNumber = inspectionNumber.trim();
        payload.inspectionIssueDate = inspectionIssueDate.trim();
        payload.inspectionExpiry = inspectionExpiry.trim();
      }
      await driverService.addVehicle(payload);
      Alert.alert('Thành công', 'Đã gửi thông tin xe. Hồ sơ sẽ được duyệt trong thời gian sớm nhất.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message ?? 'Không thể thêm xe. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Chọn nhóm xe</Text>
      <Text style={styles.stepDesc}>Phân loại theo bảng giá dịch vụ, phù hợp thị trường Việt Nam.</Text>
      {VEHICLE_GROUPS.map((g) => (
        <TouchableOpacity
          key={g.id}
          style={[styles.groupCard, selectedGroupId === g.id && styles.groupCardSelected]}
          onPress={() => handleGroupSelect(g.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.groupIcon}>{g.icon}</Text>
          <Text style={styles.groupLabel}>{g.label}</Text>
          <Text style={styles.groupDesc}>{g.description}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.nextBtn, !selectedGroupId && styles.nextBtnDisabled]}
        onPress={() => {
          const needStep2 = group && (group.vehicleTypes.length > 1 || group.vehicleTypes[0] === 'TRUCK');
          setStep(needStep2 ? 2 : 3);
        }}
        disabled={!selectedGroupId}
      >
        <Text style={styles.nextBtnText}>Tiếp</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => {
    if (!group) return null;
    return (
      <>
        <TouchableOpacity onPress={() => setStep(1)} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Đổi nhóm xe</Text>
        </TouchableOpacity>
        <Text style={styles.stepTitle}>
          {group.id === 'TRUCK' ? 'Chọn loại xe tải' : 'Chọn loại xe ô tô'}
        </Text>
        {(group.vehicleClasses ?? []).map((c) => (
          <TouchableOpacity
            key={c.value}
            style={[
              styles.classCard,
              (group.id === 'TRUCK' ? selectedVehicleClass === c.value : selectedVehicleType === c.value) && styles.classCardSelected,
            ]}
            onPress={() => handleStep2Select(c.value)}
          >
            <Text style={styles.classLabel}>{c.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.nextBtn, !canGoStep2 && styles.nextBtnDisabled]}
          onPress={() => setStep(3)}
          disabled={!canGoStep2}
        >
          <Text style={styles.nextBtnText}>Tiếp</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderStep3 = () => (
    <>
      <TouchableOpacity onPress={() => setStep(needClassSelection ? 2 : 1)} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Đổi loại xe</Text>
      </TouchableOpacity>
      <Text style={styles.stepTitle}>Thông tin theo giấy đăng ký / đăng kiểm</Text>
      <Text style={styles.stepDesc}>Điền đúng theo giấy tờ để nền tảng phân loại và tính giá dịch vụ.</Text>

      <Text style={styles.sectionLabel}>Thông tin xe</Text>
      <TextInput style={styles.input} value={licensePlate} onChangeText={setLicensePlate} placeholder="Biển số xe *" placeholderTextColor={Colors.gray} />
      <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="Thương hiệu (VD: Honda, Toyota) *" placeholderTextColor={Colors.gray} />
      <TextInput style={styles.input} value={model} onChangeText={setModel} placeholder="Model / dòng xe *" placeholderTextColor={Colors.gray} />
      <TextInput style={styles.input} value={color} onChangeText={setColor} placeholder="Màu sắc *" placeholderTextColor={Colors.gray} />
      <TextInput style={styles.input} value={year} onChangeText={setYear} placeholder="Năm sản xuất (VD: 2024) *" placeholderTextColor={Colors.gray} keyboardType="number-pad" />

      <Text style={styles.sectionLabel}>Giấy đăng ký xe</Text>
      <TextInput style={styles.input} value={registrationNumber} onChangeText={setRegistrationNumber} placeholder="Số đăng ký *" placeholderTextColor={Colors.gray} />
      <TextInput style={styles.input} value={registrationIssueDate} onChangeText={setRegistrationIssueDate} placeholder="Ngày cấp (YYYY-MM-DD) *" placeholderTextColor={Colors.gray} />

      {(vehicleTypeForApi === 'CAR_4_SEATS' || vehicleTypeForApi === 'CAR_7_SEATS' || vehicleTypeForApi === 'TRUCK') && (
        <>
          <Text style={styles.sectionLabel}>Giấy kiểm định</Text>
          <TextInput style={styles.input} value={inspectionNumber} onChangeText={setInspectionNumber} placeholder="Số giấy kiểm định *" placeholderTextColor={Colors.gray} />
          <TextInput style={styles.input} value={inspectionIssueDate} onChangeText={setInspectionIssueDate} placeholder="Ngày cấp (YYYY-MM-DD) *" placeholderTextColor={Colors.gray} />
          <TextInput style={styles.input} value={inspectionExpiry} onChangeText={setInspectionExpiry} placeholder="Ngày hết hạn (YYYY-MM-DD) *" placeholderTextColor={Colors.gray} />
        </>
      )}

      <Text style={styles.sectionLabel}>Bảo hiểm TNDS</Text>
      <TextInput style={styles.input} value={insuranceNumber} onChangeText={setInsuranceNumber} placeholder="Số bảo hiểm *" placeholderTextColor={Colors.gray} />
      <TextInput style={styles.input} value={insuranceProvider} onChangeText={setInsuranceProvider} placeholder="Nhà bảo hiểm *" placeholderTextColor={Colors.gray} />
      <TextInput style={styles.input} value={insuranceIssueDate} onChangeText={setInsuranceIssueDate} placeholder="Ngày cấp (YYYY-MM-DD) *" placeholderTextColor={Colors.gray} />
      <TextInput style={styles.input} value={insuranceExpiry} onChangeText={setInsuranceExpiry} placeholder="Ngày hết hạn (YYYY-MM-DD) *" placeholderTextColor={Colors.gray} />

      <Text style={styles.imageNote}>Ảnh giấy tờ và ảnh xe (trước, sau, trái, phải, ảnh biển số) sẽ được bổ sung tính năng chụp/tải ảnh trong bản cập nhật.</Text>

      <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.submitBtnText}>{submitting ? 'Đang gửi...' : 'Gửi hồ sơ xe'}</Text>
      </TouchableOpacity>
    </>
  );

  const showStep2 = step === 2 && needClassSelection;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm phương tiện</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {step === 1 && renderStep1()}
          {showStep2 && renderStep2()}
          {step === 3 && renderStep3()}
          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  backBtn: { minWidth: 80 },
  backBtnText: { ...Typography.body, color: Colors.info, fontWeight: '600' },
  headerTitle: { ...Typography.h3, color: Colors.purpleDark },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.l },
  backLink: { marginBottom: Spacing.m },
  backLinkText: { ...Typography.body, color: Colors.info },
  stepTitle: { ...Typography.h2, color: Colors.purpleDark, marginBottom: Spacing.xs },
  stepDesc: { ...Typography.secondary, color: Colors.gray, marginBottom: Spacing.l },
  sectionLabel: { ...Typography.caption, color: Colors.gray, marginTop: Spacing.m, marginBottom: Spacing.s, textTransform: 'uppercase' },
  groupCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.level1,
  },
  groupCardSelected: { borderColor: Colors.gold },
  groupIcon: { fontSize: 32, marginBottom: Spacing.xs },
  groupLabel: { ...Typography.h3, color: Colors.black },
  groupDesc: { ...Typography.caption, color: Colors.gray },
  classCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginBottom: Spacing.s,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  classCardSelected: { borderColor: Colors.gold },
  classLabel: { ...Typography.body, color: Colors.black },
  nextBtn: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.m,
    alignItems: 'center',
    marginTop: Spacing.l,
  },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    marginBottom: Spacing.s,
  },
  imageNote: { ...Typography.caption, color: Colors.gray, marginTop: Spacing.m, fontStyle: 'italic' },
  submitBtn: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.m,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },
});
