import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard-aluno" />
      <Stack.Screen name="dashboard-professor" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="reservations" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}