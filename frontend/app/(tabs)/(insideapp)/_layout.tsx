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
        tabBarActiveTintColor: Colors.light.darkGreen,
        headerShown: false,
        tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            paddingTop: 10,
            height: 80,
            paddingBottom: 10,
            paddingHorizontal: 50,
          },
    }}
    
    >
    <Tabs.Screen
        name="home"
        options={{
        title: 'Home',
        tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
        ),
        }}
    />
        <Tabs.Screen
        name="explore"
        options={{
        title: 'Explore',
        tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
        ),
        }}
    />
    <Tabs.Screen
        name="chat"
        options={{
        title: 'Chat',
        tabBarIcon: ({ color }) => (
            <FontAwesome name="comments" size={24} color={color} />
        ),
        }}
    />
    </Tabs>

  );
}
