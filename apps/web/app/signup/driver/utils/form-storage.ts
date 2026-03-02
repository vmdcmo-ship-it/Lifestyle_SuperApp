/**
 * Auto-save driver registration form to localStorage
 */

const STORAGE_KEY = 'driver_registration_draft';

export interface DriverFormData {
  currentStep: number;
  completedSteps: number[];
  
  // Step 1: Personal Info
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  password: string;
  
  // Step 2: Identity & eKYC
  citizenId: string;
  citizenIdIssueDate: string;
  citizenIdIssuePlace: string;
  citizenIdFrontImage: string | null;
  citizenIdBackImage: string | null;
  faceImage: string | null;
  
  // Step 3: Driver License
  driverLicenseNumber: string;
  driverLicenseClass: string;
  driverLicenseIssueDate: string;
  driverLicenseExpiry: string;
  driverLicenseImage: string | null;
  
  // Step 4: Criminal Record
  criminalRecordNumber: string;
  criminalRecordIssueDate: string;
  criminalRecordImage: string | null;
  
  // Step 5: Vehicle
  vehicleType: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  vehicleFrontImage: string | null;
  vehicleBackImage: string | null;
  vehicleLeftImage: string | null;
  vehicleRightImage: string | null;
  licensePlateCloseupImage: string | null;
  registrationNumber: string;
  registrationIssueDate: string;
  registrationExpiry: string;
  registrationImage: string | null;
  
  // Step 6: Insurance
  insuranceNumber: string;
  insuranceProvider: string;
  insuranceIssueDate: string;
  insuranceExpiry: string;
  insuranceImage: string | null;
  
  // Step 7: Bank Account
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  branchName: string;
  
  // Step 8: Terms
  agreedToTerms: boolean;
  agreedToDriverPolicy: boolean;
}

export const initialFormData: DriverFormData = {
  currentStep: 1,
  completedSteps: [],
  fullName: '',
  phoneNumber: '',
  email: '',
  dateOfBirth: '',
  address: '',
  password: '',
  citizenId: '',
  citizenIdIssueDate: '',
  citizenIdIssuePlace: '',
  citizenIdFrontImage: null,
  citizenIdBackImage: null,
  faceImage: null,
  driverLicenseNumber: '',
  driverLicenseClass: '',
  driverLicenseIssueDate: '',
  driverLicenseExpiry: '',
  driverLicenseImage: null,
  criminalRecordNumber: '',
  criminalRecordIssueDate: '',
  criminalRecordImage: null,
  vehicleType: '',
  licensePlate: '',
  brand: '',
  model: '',
  year: '',
  color: '',
  vehicleFrontImage: null,
  vehicleBackImage: null,
  vehicleLeftImage: null,
  vehicleRightImage: null,
  licensePlateCloseupImage: null,
  registrationNumber: '',
  registrationIssueDate: '',
  registrationExpiry: '',
  registrationImage: null,
  insuranceNumber: '',
  insuranceProvider: '',
  insuranceIssueDate: '',
  insuranceExpiry: '',
  insuranceImage: null,
  accountHolderName: '',
  accountNumber: '',
  bankName: '',
  bankCode: '',
  branchName: '',
  agreedToTerms: false,
  agreedToDriverPolicy: false,
};

export const saveDraft = (data: DriverFormData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
};

export const loadDraft = (): DriverFormData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load draft:', error);
  }
  return null;
};

export const clearDraft = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
};

export const hasDraft = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
};
