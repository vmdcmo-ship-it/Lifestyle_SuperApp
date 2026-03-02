/**
 * User and authentication types
 */

import type { BaseEntity, Location } from './common';

/**
 * User entity
 */
export interface User extends BaseEntity {
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  addresses: UserAddress[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  role: UserRole;
  preferences?: UserPreferences;
}

/**
 * User Role
 */
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

/**
 * eKYC Level (Định danh điện tử)
 */
export enum EKYCLevel {
  LEVEL_0 = 'LEVEL_0', // Chưa xác thực
  LEVEL_1 = 'LEVEL_1', // Xác thực OTP
  LEVEL_2 = 'LEVEL_2', // Xác thực CCCD + sinh trắc học
  LEVEL_3 = 'LEVEL_3', // Xác thực tại ngân hàng
}

/**
 * Verification Status
 */
export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

/**
 * User Address
 */
export interface UserAddress extends BaseEntity {
  userId: string;
  label: string; // 'Home', 'Work', etc.
  location: Location;
  isDefault: boolean;
}

/**
 * User Preferences
 */
export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: 'LIGHT' | 'DARK' | 'AUTO';
}

/**
 * Authentication Response
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Login Credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Register Data (Member/Customer)
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string; // Bắt buộc
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
  referralCode?: string;
}

/**
 * Social Login Data
 */
export interface SocialLoginData {
  provider: 'GOOGLE' | 'FACEBOOK';
  providerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}
