import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('profile');
    const router = useRouter();

    const handleTabPress = (tab: string) => {
        if (tab === activeTab) return;

        setActiveTab(tab);

        // Navegação
        if (tab === 'home') {
            router.replace('/dashboard');
        } else if (tab === 'reservations') {
            router.replace('/reservations');
        }
    };

    return (
        <View className='flex-1 bg-white'>
            {/* Header */}
            <View className='bg-white pt-12 pb-4 px-4'>
                {/* Top Row - Icons */}
                <View className='flex-row justify-between items-center mb-4'>
                    {/* Ícone de Perfil */}
                    <TouchableOpacity className='w-12 h-12 bg-green-700 rounded-full justify-center items-center' activeOpacity={0.7}>
                        <AntDesign name="user" size={24} color="white" />
                    </TouchableOpacity>
                    
                    {/* Logo SISREV */}
                    <View className='flex-row items-center'>
                        <Image 
                            source={require('../src/img/LogoIF.png')} 
                            className='w-8 h-8 mr-2'
                            resizeMode='contain'
                        />
                        <Text className='text-4xl font-black text-green-700'>
                            SISREV
                        </Text>
                    </View>
                    
                    {/* Ícone de Notificações */}
                    <TouchableOpacity className='w-10 h-10 justify-center items-center' activeOpacity={0.7}>
                        <Ionicons name="notifications-outline" size={28} color="#1C5E27" />
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Conteúdo Principal - Perfil */}
            <ScrollView className='flex-1 px-4 py-2 pb-20'>
                <Text className='text-xl font-bold text-green-700 mb-4'>
                    Meu Perfil
                </Text>
                
                {/* Placeholder para perfil */}
                <View className='bg-gray-100 rounded-lg p-8 items-center'>
                    <AntDesign name="user" size={64} color="#9CA3AF" />
                    <Text className='text-gray-500 text-lg font-semibold mt-4'>
                        Informações do usuário
                    </Text>
                    <Text className='text-gray-400 text-center mt-2'>
                        Gerencie suas informações pessoais
                    </Text>
                </View>
            </ScrollView>
            
            {/* Bottom Navigation Bar - Flutuante */}
            <View 
                className='bg-green-700 rounded-full mx-8 mb-4 px-6 py-3 flex-row justify-around items-center'
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            >
                {/* Início */}
                <TouchableOpacity 
                    className={`px-6 py-2 flex-row items-center rounded-full ${
                        activeTab === 'home' ? 'bg-green-500' : ''
                    }`}
                    activeOpacity={0.7}
                    onPress={() => handleTabPress('home')}
                >
                    <Ionicons 
                        name={activeTab === 'home' ? 'home' : 'home-outline'} 
                        size={20} 
                        color="white" 
                    />
                    <Text className='text-white font-semibold ml-2 text-sm'>
                        Início
                    </Text>
                </TouchableOpacity>
                
                {/* Reservas */}
                <TouchableOpacity 
                    className={`px-6 py-2 flex-row items-center rounded-full ${
                        activeTab === 'reservations' ? 'bg-green-500' : ''
                    }`}
                    activeOpacity={0.7}
                    onPress={() => handleTabPress('reservations')}
                >
                    <Ionicons 
                        name={activeTab === 'reservations' ? 'calendar' : 'calendar-outline'} 
                        size={20} 
                        color="white" 
                    />
                    <Text className='text-white font-semibold ml-2 text-sm'>
                        Reservas
                    </Text>
                </TouchableOpacity>
                
                {/* Perfil */}
                <TouchableOpacity 
                    className={`px-6 py-2 flex-row items-center rounded-full ${
                        activeTab === 'profile' ? 'bg-green-500' : ''
                    }`}
                    activeOpacity={0.7}
                    onPress={() => handleTabPress('profile')}
                >
                    <Ionicons 
                        name={activeTab === 'profile' ? 'person' : 'person-outline'} 
                        size={20} 
                        color="white" 
                    />
                    <Text className='text-white font-semibold ml-2 text-sm'>
                        Perfil
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
