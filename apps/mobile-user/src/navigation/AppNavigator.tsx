import React, { useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Typography, Shadows } from '../theme';
import { useAuth } from '../contexts/AuthContext';

import { AuthScreen } from '../screens/AuthScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SpotlightScreen } from '../screens/SpotlightScreen';
import { InsuranceScreen, PensionCalculatorScreen } from '../screens/InsuranceScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RunToEarnScreen } from '../screens/RunToEarnScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { MembershipScreen } from '../screens/MembershipScreen';
import { FamilyAccountScreen } from '../screens/FamilyAccountScreen';
import { GiftCardScreen } from '../screens/GiftCardScreen';
import { BusinessProfileScreen } from '../screens/BusinessProfileScreen';
import { LanguageScreen, SecurityScreen, AccountUpdateScreen } from '../screens/SettingsScreen';
import { FindNearScreen } from '../screens/FindNearScreen';
import { CharityLotteryScreen } from '../screens/CharityLotteryScreen';
import { LifestyleLocalScreen } from '../screens/LifestyleLocalScreen';
import { FoodDeliveryScreen } from '../screens/FoodDeliveryScreen';
import { ShoppingScreen } from '../screens/ShoppingScreen';
import { MerchantStoreScreen } from '../screens/MerchantStoreScreen';
import { RewardsScreen } from '../screens/RewardsScreen';
import { GroupsScreen } from '../screens/GroupsScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Tab Icon Component ─────────────────────────────────────────────────────

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
    <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{emoji}</Text>
  </View>
);

const tabStyles = StyleSheet.create({
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.kodoGreen + '15',
  },
  icon: { fontSize: 22 },
  iconActive: { fontSize: 24 },
});

// ─── Main Tab Navigator ─────────────────────────────────────────────────────

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.purpleDark,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.lightGray,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          ...Shadows.level1,
        },
        tabBarLabelStyle: {
          ...Typography.tiny,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Spotlight"
        component={SpotlightScreen}
        options={{
          tabBarLabel: 'Spotlight',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⭐" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          tabBarLabel: 'Đặt xe',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏍️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Insurance"
        component={InsuranceScreen}
        options={{
          tabBarLabel: 'Bảo hiểm',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🛡️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Tôi',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Loading Splash (Auth check) ─────────────────────────────────────────────

function SplashScreen() {
  const navigation = useNavigation<any>();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      navigation.reset({
        index: 0,
        routes: [{ name: isAuthenticated ? 'MainTabs' : 'Auth' }],
      });
    }
  }, [isLoading, isAuthenticated, navigation]);

  return (
    <View style={splashStyles.container}>
      <View style={splashStyles.logoWrap}>
        <Image
          source={require('../../assets/kodo-logo.png')}
          style={splashStyles.logoImage}
          resizeMode="contain"
        />
      </View>
      <Text style={splashStyles.brand}>KODO</Text>
      <Text style={splashStyles.tagline}>The Heartbeat of Your Lifestyle</Text>
      <ActivityIndicator color={Colors.purpleDark} size="large" style={{ marginTop: 24 }} />
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.kodoYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: { width: 100, height: 100, marginBottom: 12 },
  logoImage: { width: '100%', height: '100%' },
  brand: { fontSize: 32, fontWeight: '800', color: Colors.purpleDark, letterSpacing: 2 },
  tagline: {
    fontSize: 12,
    color: Colors.purpleDark,
    marginTop: 4,
    fontWeight: '500',
    opacity: 0.9,
  },
});

// ─── Root Stack Navigator ───────────────────────────────────────────────────

function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="PensionCalculator"
          component={PensionCalculatorScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="RunToEarn"
          component={RunToEarnScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Wallet"
          component={WalletScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Membership"
          component={MembershipScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="FamilyAccount"
          component={FamilyAccountScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="GiftCard"
          component={GiftCardScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="BusinessProfile"
          component={BusinessProfileScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Language"
          component={LanguageScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Security"
          component={SecurityScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="AccountUpdate"
          component={AccountUpdateScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="FindNear"
          component={FindNearScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="CharityLottery"
          component={CharityLotteryScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="LifestyleLocal"
          component={LifestyleLocalScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="FoodDelivery"
          component={FoodDeliveryScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Shopping"
          component={ShoppingScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="MerchantStore"
          component={MerchantStoreScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Rewards"
          component={RewardsScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Groups"
          component={GroupsScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ animation: 'slide_from_right' }}
        />
    </Stack.Navigator>
  );
}

// ─── App Navigator (with NavigationContainer) ──────────────────────────────────

export const AppNavigator = () => (
  <NavigationContainer>
    <RootStack />
  </NavigationContainer>
);
