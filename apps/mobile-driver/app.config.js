/**
 * Expo config. Dùng file này để inject GOOGLE_MAPS_API_KEY từ env.
 * Đặt key trong .env: EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=... hoặc GOOGLE_MAPS_API_KEY=...
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

module.exports = ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: 'mobile-driver',
    slug: 'mobile-driver',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    plugins: [
      [
        'expo-camera',
        {
          cameraPermission: 'Ứng dụng cần quyền camera để chụp ảnh khuôn mặt xác minh tài xế.',
          microphonePermission: 'Ứng dụng cần microphone khi quay video.',
        },
      ],
    ],
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      ...config.expo?.ios,
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: 'Ứng dụng cần quyền camera để chụp ảnh khuôn mặt xác minh tài xế.',
        NSPhotoLibraryUsageDescription: 'Ứng dụng cần quyền ảnh để chọn ảnh giấy tờ hoặc ảnh chân dung.',
        NSLocationWhenInUseUsageDescription: 'Ứng dụng cần vị trí để hiển thị bản đồ và đơn hàng gần bạn.',
      },
    },
    android: {
      ...config.expo?.android,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: ['CAMERA', 'ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '',
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
  },
});
