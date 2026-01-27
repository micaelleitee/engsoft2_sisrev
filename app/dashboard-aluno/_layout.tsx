import { Stack } from 'expo-router';
import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import BottomNavigationBar from '../../components/BottomNavigationBar';

function DashboardAlunoLayout() {
    const tabs = useMemo(() => [
        {
            name: 'home',
            route: '/dashboard-aluno',
            icon: { active: 'home' as const, inactive: 'home-outline' as const },
            label: 'Início',
        },
        {
            name: 'profile',
            route: '/dashboard-aluno/profile/profile',
            icon: { active: 'person' as const, inactive: 'person-outline' as const },
            label: 'Perfil',
        },
    ], []);

    return (
        <View style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
            {}
            <View style={{ flex: 1, backgroundColor: 'white', overflow: 'hidden' }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: 'transparent', flex: 1 },
                    }}
                >
                    <Stack.Screen name="index" />
                    <Stack.Screen name="disciplina-detalhes" />
                    <Stack.Screen name="profile/profile" />
                    <Stack.Screen name="profile/dados-perfil" />
                    <Stack.Screen name="profile/notificacao" />
                    <Stack.Screen name="profile/notificacao-detalhes" />
                    <Stack.Screen name="profile/suporte" />
                </Stack>
            </View>
            {}
            <BottomNavigationBar tabs={tabs} baseRoute="/dashboard-aluno" />
        </View>
    );
}

export default memo(DashboardAlunoLayout);


