import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, StyleSheet as RNStyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';
import { useAuth } from '../context/AuthContext';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { OrderMarketplaceScreen } from '../screens/OrderMarketplaceScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderExecutionScreen } from '../screens/OrderExecutionScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { MissionsScreen } from '../screens/MissionsScreen';
import { DriverProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { OrderReceivingSettingsScreen } from '../screens/OrderReceivingSettingsScreen';
import { AccountInfoScreen } from '../screens/AccountInfoScreen';
import { UpdateDocumentsScreen } from '../screens/UpdateDocumentsScreen';
import { FaceCaptureScreen } from '../screens/FaceCaptureScreen';
import { DocumentCaptureScreen } from '../screens/DocumentCaptureScreen';
import { PricingScreen } from '../screens/PricingScreen';
import { FAQScreen } from '../screens/FAQScreen';
import { SupportHotlineScreen } from '../screens/SupportHotlineScreen';
import { VehiclesScreen } from '../screens/VehiclesScreen';
import { AddVehicleScreen } from '../screens/AddVehicleScreen';
import { InsuranceScreen } from '../screens/InsuranceScreen';
import { InsuranceProductDetailScreen } from '../screens/InsuranceProductDetailScreen';
import { InsurancePoliciesScreen } from '../screens/InsurancePoliciesScreen';
import { InsurancePolicyDetailScreen } from '../screens/InsurancePolicyDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();
const OrdersStack = createNativeStackNavigator();

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <View style={[tabStyles.wrap, focused && tabStyles.wrapActive]}>
    <Text style={{ fontSize: focused ? 24 : 22 }}>{emoji}</Text>
  </View>
);

const tabStyles = RNStyleSheet.create({
  wrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  wrapActive: { backgroundColor: Colors.gold + '20' },
});

function OrdersStackScreen() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="OrdersList" component={OrdersScreen} />
      <OrdersStack.Screen name="OrderExecution" component={OrderExecutionScreen} />
    </OrdersStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={DriverProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="OrderReceivingSettings" component={OrderReceivingSettingsScreen} />
      <ProfileStack.Screen name="AccountInfo" component={AccountInfoScreen} />
      <ProfileStack.Screen name="UpdateDocuments" component={UpdateDocumentsScreen} />
      <ProfileStack.Screen name="FaceCapture" component={FaceCaptureScreen} />
      <ProfileStack.Screen name="DocumentCapture" component={DocumentCaptureScreen} />
      <ProfileStack.Screen name="Pricing" component={PricingScreen} />
      <ProfileStack.Screen name="FAQ" component={FAQScreen} />
      <ProfileStack.Screen name="SupportHotline" component={SupportHotlineScreen} />
      <ProfileStack.Screen name="Vehicles" component={VehiclesScreen} />
      <ProfileStack.Screen name="AddVehicle" component={AddVehicleScreen} />
      <ProfileStack.Screen name="Insurance" component={InsuranceScreen} />
      <ProfileStack.Screen name="InsuranceProductDetail" component={InsuranceProductDetailScreen} />
      <ProfileStack.Screen name="InsurancePolicies" component={InsurancePoliciesScreen} />
      <ProfileStack.Screen name="InsurancePolicyDetail" component={InsurancePolicyDetailScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.lightGray,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { ...Typography.tiny, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="OrderMarketplace"
        component={OrderMarketplaceScreen}
        options={{
          tabBarLabel: 'Nhận đơn',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📌" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStackScreen}
        options={{
          tabBarLabel: 'Đơn hàng',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarLabel: 'Ví tài xế',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💰" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Missions"
        component={MissionsScreen}
        options={{
          tabBarLabel: 'Nhiệm vụ',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎯" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={loadingStyles.text}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" options={{ title: 'Đăng nhập' }}>
              {({ navigation }) => (
                <LoginScreen onRegister={() => navigation.replace('Register')} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" options={{ title: 'Đăng ký' }}>
              {({ navigation }) => (
                <RegisterScreen onLogin={() => navigation.replace('Login')} />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const loadingStyles = RNStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  text: { ...Typography.body, color: Colors.gray },
});
