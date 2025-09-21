import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { NotificationService } from '@/services/NotificationService';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Initialize notifications
    NotificationService.initialize();

    // Handle notification responses
    const unsubscribe = NotificationService.onNotificationResponse((response) => {
      console.log('Notification response:', response);
      // Handle navigation based on notification data
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/otp" />
        <Stack.Screen name="chat/[id]" />
        <Stack.Screen name="contacts" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}