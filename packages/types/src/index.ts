/**
 * Lifestyle Super App - Type Definitions
 * Central export - tránh export * từ nhiều module có type trùng tên (conflicting star exports)
 *
 * Chiến lược:
 * - Export * từ các module KHÔNG có xung đột
 * - KHÔNG export driver, driver-app, pricing, revenue, accounting, merchant,
 *   insurance, insurance-products, social-insurance, life-insurance, insurance-analytics, backend-api
 *   từ barrel chính (có VehicleType, ServiceType, OrderStatus, etc. trùng)
 * - Dùng subpath @lifestyle/types/driver-app, @lifestyle/types/pricing... khi cần
 */

export * from './common';
export * from './user';
export * from './api';
export * from './food-delivery';
export * from './ride-hailing';
export * from './shopping';
export * from './referral';
export * from './loyalty';
export * from './savings-package';
export * from './location-feedback';
export * from './spotlight';
export * from './run-to-earn';
