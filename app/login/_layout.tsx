import { Stack } from 'expo-router';

export default function LoginLayout() {
  return (
    <Stack>
      {/* Este Stack gerencia as rotas dentro da pasta 'login' */}
      {/* O 'name' aqui refere-se aos arquivos/pastas dentro de 'app/login'.
        Os nomes seriam 'index', 'sign-in', 'sign-up', etc.
      */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      
      {/* Agora, a rota para 'sign-in' será automaticamente '/login/sign-in',
        e a rota para 'sign-up' será '/login/sign-up'.
      */}
    </Stack>
  );
}