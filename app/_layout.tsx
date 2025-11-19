import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard-aluno/index" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard-professor/index" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard/index" options={{ headerShown: false }} />
      <Stack.Screen name="reservations" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}