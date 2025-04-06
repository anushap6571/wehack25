import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false, // Hide header globally
        tabBarStyle: { display: 'none' }, // Hide the entire tab bar (including icons)
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{title: 'SignUp'}}
      />
      <Tabs.Screen
        name="login"
        options={{title: 'Login'}}
      />
      <Tabs.Screen
    name="input"
    options={{
      title: 'Input'
    }}>
    </Tabs.Screen>
    <Tabs.Screen
    name="signout"
    options={{
      title: 'SignOut'
    }}></Tabs.Screen>
    </Tabs>
  );
}
