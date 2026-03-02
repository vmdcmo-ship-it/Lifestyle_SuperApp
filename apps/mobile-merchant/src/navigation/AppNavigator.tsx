import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Typography } from '../theme';

import { DashboardScreen } from '../screens/DashboardScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { ReviewsScreen } from '../screens/ReviewsScreen';
import { MerchantProfileScreen } from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <View style={[tabStyles.wrap, focused && tabStyles.wrapActive]}>
    <Text style={{ fontSize: focused ? 24 : 22 }}>{emoji}</Text>
  </View>
);

const tabStyles = StyleSheet.create({
  wrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  wrapActive: { backgroundColor: Colors.gold + '20' },
});

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
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Tổng quan',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Đơn hàng',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
          tabBarBadge: 1,
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarLabel: 'Sản phẩm',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🍽️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{
          tabBarLabel: 'Đánh giá',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⭐" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={MerchantProfileScreen}
        options={{
          tabBarLabel: 'Cửa hàng',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏪" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  </NavigationContainer>
);
