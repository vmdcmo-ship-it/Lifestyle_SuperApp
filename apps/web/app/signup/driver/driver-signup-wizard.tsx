'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KodoLogo } from '@/components/kodo-logo';
import {
  DriverFormData,
  initialFormData,
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
} from './utils/form-storage';
import { ProgressIndicator } from './components/progress-indicator';
import { StepNavigation } from './components/step-navigation';
import { Step1PersonalInfo } from './components/steps/step1-personal-info';
import { Step2IdentityEKYC } from './components/steps/step2-identity-ekyc';
import { Step3DriverLicense } from './components/steps/step3-driver-license';
import { Step4CriminalRecord } from './components/steps/step4-criminal-record';
import { Step5VehicleInfo } from './components/steps/step5-vehicle-info';
import { Step6Insurance } from './components/steps/step6-insurance';
import { Step7BankAccount } from './components/steps/step7-bank-account';
import { Step8Terms } from './components/steps/step8-terms';

const STEP_TITLES = [
  'Thông tin cá nhân',
  'CCCD & eKYC',
  'Giấy phép lái xe',
  'Lý lịch tư pháp',
  'Phương tiện',
  'Bảo hiểm TNDS',
  'Tài khoản ngân hàng',
  'Xác nhận',
];

export function DriverSignupWizard() {
  const router = useRouter();
  const [formData, setFormData] = useState<DriverFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);

  // Check for existing draft on mount
  useEffect(() => {
    if (hasDraft()) {
      setShowDraftPrompt(true);
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (formData.currentStep > 1) {
      saveDraft(formData);
    }
  }, [formData]);

  const handleLoadDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setFormData(draft);
    }
    setShowDraftPrompt(false);
  };

  const handleStartNew = () => {
    clearDraft();
    setShowDraftPrompt(false);
  };

  const handleChange = (field: keyof DriverFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (formData.currentStep) {
      case 1: // Personal Info
        if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ tên';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Vui lòng nhập SĐT';
        else if (!/^(0|\+84)[3-9][0-9]{8}$/.test(formData.phoneNumber)) {
          newErrors.phoneNumber = 'SĐT không hợp lệ';
        }
        if (!formData.email) newErrors.email = 'Vui lòng nhập email';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
        if (!formData.address) newErrors.address = 'Vui lòng nhập địa chỉ';
        if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
        break;

      case 2: // Identity
        if (!formData.citizenId) newErrors.citizenId = 'Vui lòng nhập số CCCD';
        else if (!/^[0-9]{12}$/.test(formData.citizenId)) {
          newErrors.citizenId = 'Số CCCD phải có 12 số';
        }
        if (!formData.citizenIdIssueDate) newErrors.citizenIdIssueDate = 'Vui lòng chọn ngày cấp';
        if (!formData.citizenIdIssuePlace) newErrors.citizenIdIssuePlace = 'Vui lòng nhập nơi cấp';
        if (!formData.citizenIdFrontImage) newErrors.citizenIdFrontImage = 'Vui lòng tải ảnh mặt trước CCCD';
        if (!formData.citizenIdBackImage) newErrors.citizenIdBackImage = 'Vui lòng tải ảnh mặt sau CCCD';
        if (!formData.faceImage) newErrors.faceImage = 'Vui lòng tải ảnh khuôn mặt';
        break;

      case 3: // Driver License
        if (!formData.driverLicenseNumber) newErrors.driverLicenseNumber = 'Vui lòng nhập số GPLX';
        if (!formData.driverLicenseClass) newErrors.driverLicenseClass = 'Vui lòng chọn hạng GPLX';
        if (!formData.driverLicenseExpiry) newErrors.driverLicenseExpiry = 'Vui lòng chọn ngày hết hạn';
        if (!formData.driverLicenseImage) newErrors.driverLicenseImage = 'Vui lòng tải ảnh GPLX';
        break;

      case 4: // Criminal Record
        if (!formData.criminalRecordNumber) newErrors.criminalRecordNumber = 'Vui lòng nhập số giấy tờ';
        if (!formData.criminalRecordIssueDate) newErrors.criminalRecordIssueDate = 'Vui lòng chọn ngày cấp';
        if (!formData.criminalRecordImage) newErrors.criminalRecordImage = 'Vui lòng tải ảnh lý lịch';
        break;

      case 5: // Vehicle
        if (!formData.vehicleType) newErrors.vehicleType = 'Vui lòng chọn loại xe';
        if (!formData.licensePlate) newErrors.licensePlate = 'Vui lòng nhập biển số';
        if (!formData.brand) newErrors.brand = 'Vui lòng nhập hãng xe';
        if (!formData.model) newErrors.model = 'Vui lòng nhập dòng xe';
        if (!formData.year) newErrors.year = 'Vui lòng nhập năm sản xuất';
        if (!formData.color) newErrors.color = 'Vui lòng nhập màu sắc';
        if (!formData.vehicleFrontImage) newErrors.vehicleFrontImage = 'Vui lòng tải ảnh góc trước';
        if (!formData.vehicleBackImage) newErrors.vehicleBackImage = 'Vui lòng tải ảnh góc sau';
        if (!formData.vehicleLeftImage) newErrors.vehicleLeftImage = 'Vui lòng tải ảnh góc trái';
        if (!formData.vehicleRightImage) newErrors.vehicleRightImage = 'Vui lòng tải ảnh góc phải';
        if (!formData.licensePlateCloseupImage) newErrors.licensePlateCloseupImage = 'Vui lòng tải ảnh cận cảnh biển số';
        if (!formData.registrationNumber) newErrors.registrationNumber = 'Vui lòng nhập số đăng ký';
        if (!formData.registrationExpiry) newErrors.registrationExpiry = 'Vui lòng chọn ngày hết hạn';
        if (!formData.registrationImage) newErrors.registrationImage = 'Vui lòng tải ảnh đăng ký xe';
        break;

      case 6: // Insurance
        if (!formData.insuranceNumber) newErrors.insuranceNumber = 'Vui lòng nhập số bảo hiểm';
        if (!formData.insuranceProvider) newErrors.insuranceProvider = 'Vui lòng chọn nhà cung cấp';
        if (!formData.insuranceExpiry) newErrors.insuranceExpiry = 'Vui lòng chọn ngày hết hạn';
        if (!formData.insuranceImage) newErrors.insuranceImage = 'Vui lòng tải ảnh bảo hiểm';
        break;

      case 7: // Bank Account
        if (!formData.accountHolderName) newErrors.accountHolderName = 'Vui lòng nhập tên chủ TK';
        if (!formData.accountNumber) newErrors.accountNumber = 'Vui lòng nhập số TK';
        if (!formData.bankCode) newErrors.bankCode = 'Vui lòng chọn ngân hàng';
        if (!formData.branchName) newErrors.branchName = 'Vui lòng nhập chi nhánh';
        break;

      case 8: // Terms
        if (!formData.agreedToTerms) newErrors.agreedToTerms = 'Vui lòng đồng ý điều khoản';
        if (!formData.agreedToDriverPolicy) newErrors.agreedToDriverPolicy = 'Vui lòng đồng ý chính sách';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.currentStep < 8) {
      setFormData((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: [...new Set([...prev.completedSteps, prev.currentStep])],
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final submission
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    setFormData((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1),
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = () => {
    saveDraft(formData);
    alert('✅ Đã lưu nháp thành công!');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Convert to FormData for file upload
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          submitData.append(key, value.toString());
        }
      });

      const response = await fetch('/api/auth/register/driver', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        clearDraft();
        router.push('/signup/driver/success');
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Gửi hồ sơ thất bại' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      setErrors({ submit: 'Có lỗi xảy ra, vui lòng thử lại' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const commonProps = {
      formData,
      onChange: handleChange,
      errors,
    };

    switch (formData.currentStep) {
      case 1:
        return <Step1PersonalInfo {...commonProps} />;
      case 2:
        return <Step2IdentityEKYC {...commonProps} />;
      case 3:
        return <Step3DriverLicense {...commonProps} />;
      case 4:
        return <Step4CriminalRecord {...commonProps} />;
      case 5:
        return <Step5VehicleInfo {...commonProps} />;
      case 6:
        return <Step6Insurance {...commonProps} />;
      case 7:
        return <Step7BankAccount {...commonProps} />;
      case 8:
        return <Step8Terms {...commonProps} />;
      default:
        return null;
    }
  };

  // Draft Prompt Modal
  if (showDraftPrompt) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
          <div className="mb-4 text-center text-5xl">📝</div>
          <h2 className="mb-4 text-center text-2xl font-bold">
            Tiếp tục đăng ký?
          </h2>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
            Chúng tôi phát hiện bạn có hồ sơ đang dở. Bạn có muốn tiếp tục?
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleStartNew}
              className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold transition-all hover:border-gray-400"
            >
              Bắt đầu mới
            </button>
            <button
              onClick={handleLoadDraft}
              className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 dark:from-gray-900 dark:via-gray-850 dark:to-gray-950">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <KodoLogo size="lg" withWordmark className="[&_span]:!text-gray-900 dark:[&_span]:!text-gray-100" />
          </div>
          <h1 className="mb-2 text-4xl font-bold">Đăng ký Tài xế Đối tác</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thu nhập hấp dẫn, linh hoạt thời gian làm việc
          </p>
        </div>

        {/* Main Form Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={formData.currentStep}
            totalSteps={8}
            stepTitles={STEP_TITLES}
          />

          {/* Current Step Content */}
          <div className="mt-8">{renderStep()}</div>

          {/* Navigation */}
          <StepNavigation
            currentStep={formData.currentStep}
            totalSteps={8}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            isLoading={isLoading}
          />
        </div>

        {/* Help Link */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Cần hỗ trợ?{' '}
          <Link href="/help/driver-registration" className="text-purple-600 hover:underline">
            Xem hướng dẫn
          </Link>
          {' hoặc gọi '}
          <a href="tel:1900000000" className="font-semibold text-purple-600">
            1900-xxx-xxx
          </a>
        </div>

        {/* Back to Member Signup */}
        <div className="mt-4 text-center">
          <Link
            href="/signup/member"
            className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400"
          >
            ← Đăng ký tài khoản người dùng thay thế
          </Link>
        </div>
      </div>
    </div>
  );
}
