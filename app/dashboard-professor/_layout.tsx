import { Stack } from 'expo-router';
import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import BottomNavigationBar from '../../components/BottomNavigationBar';

function DashboardProfessorLayout() {
    const tabs = useMemo(() => [
        {
            name: 'home',
            route: '/dashboard-professor',
            icon: { active: 'home' as const, inactive: 'home-outline' as const },
            label: 'Início',
        },
        {
            name: 'reservations',
            route: '/dashboard-professor/reservations/reservations',
            icon: { active: 'calendar' as const, inactive: 'calendar-outline' as const },
            label: 'Reservas',
        },
        {
            name: 'profile',
            route: '/dashboard-professor/profile/profile',
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
                <Stack.Screen name="reservations/reservations" />
                <Stack.Screen name="profile/profile" />
            </Stack>
            <BottomNavigationBar tabs={tabs} baseRoute="/dashboard-professor" />
        </View>
    );
}

export default memo(DashboardProfessorLayout);

