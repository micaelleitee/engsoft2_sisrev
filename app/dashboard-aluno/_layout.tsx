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
        <View style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent', paddingBottom: 100 },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="profile/profile" />
            </Stack>
            <BottomNavigationBar tabs={tabs} baseRoute="/dashboard-aluno" />
        </View>
    );
}

export default memo(DashboardAlunoLayout);

