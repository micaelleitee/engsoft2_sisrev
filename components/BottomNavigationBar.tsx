import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { memo, useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type TabConfig = {
    name: string;
    route: string;
    icon: { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap };
    label: string;
};

type BottomNavigationBarProps = {
    tabs: TabConfig[];
    baseRoute: string; // '/dashboard-aluno' ou '/dashboard-professor'
};

function BottomNavigationBar({ tabs, baseRoute }: BottomNavigationBarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const getActiveTab = useCallback((): string => {
        if (!pathname) return tabs[0]?.name || 'home';
        
        // Normaliza o pathname para comparação
        const normalizedPath = pathname.toLowerCase().trim();
        const normalizedBaseRoute = baseRoute.toLowerCase().trim();
        
        // Se estamos na rota base (ex: /dashboard-aluno), retorna home
        if (normalizedPath === normalizedBaseRoute || 
            normalizedPath === `${normalizedBaseRoute}/` ||
            normalizedPath === `${normalizedBaseRoute}/index`) {
            return tabs[0]?.name || 'home';
        }
        
        // Verifica qual aba corresponde à rota atual
        // Ordena as tabs por tamanho de rota (mais específica primeiro) para evitar matches incorretos
        const sortedTabs = [...tabs].sort((a, b) => b.route.length - a.route.length);
        
        for (const tab of sortedTabs) {
            const normalizedTabRoute = tab.route.toLowerCase().trim();
            
            // Comparação exata primeiro
            if (normalizedPath === normalizedTabRoute) {
                return tab.name;
            }
            
            // Comparação por segmentos
            const pathSegments = normalizedPath.split('/').filter(Boolean);
            const tabSegments = normalizedTabRoute.split('/').filter(Boolean);
            
            // Verifica se todos os segmentos da tab estão no path atual
            if (tabSegments.every(segment => pathSegments.includes(segment))) {
                return tab.name;
            }
        }
        
        // Fallback: retorna a primeira aba
        return tabs[0]?.name || 'home';
    }, [pathname, baseRoute, tabs]);

    const activeTab = useMemo(() => getActiveTab(), [getActiveTab]);

    const handleTabPress = useCallback((tab: TabConfig) => {
        if (activeTab === tab.name) return;
        // Para tabs, usa replace para não criar pilha de navegação
        // Isso evita que ao voltar, volte para a página anterior
        router.replace(tab.route as any);
    }, [activeTab, router]);

    return (
        <View 
            className='bg-green-700 rounded-full mx-8 mb-4 px-6 py-3 flex-row justify-around items-center'
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                zIndex: 1000,
            }}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                    <TouchableOpacity 
                        key={tab.name}
                        className={`px-6 py-2 flex-row items-center rounded-full ${
                            isActive ? 'bg-green-500' : ''
                        }`}
                        activeOpacity={0.7}
                        onPress={() => handleTabPress(tab)}
                    >
                        <Ionicons 
                            name={isActive ? tab.icon.active : tab.icon.inactive} 
                            size={20} 
                            color="white" 
                        />
                        <Text className='text-white font-semibold ml-2 text-sm'>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// Usa memo para evitar re-renderizações desnecessárias
export default memo(BottomNavigationBar);

