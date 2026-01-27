import { Stack } from 'expo-router';
import '../global.css';
import { AuthProvider } from '../src/contexts/AuthContext';
import { DisciplineFilterProvider } from '../src/contexts/DisciplineFilterContext';

export default function RootLayout() {
  return (
    <DisciplineFilterProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="dashboard-aluno" />
          <Stack.Screen name="dashboard-professor" />
        </Stack>
      </AuthProvider>
    </DisciplineFilterProvider>
  );
}
