import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock de laboratórios - posteriormente virá do banco de dados
const LABORATORIES = [
    { id: 1, name: 'Laboratório 01' },
    { id: 2, name: 'Laboratório 02' },
    { id: 3, name: 'Laboratório 03' },
    { id: 4, name: 'Laboratório 04' },
    { id: 5, name: 'Laboratório 05' },
];

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('home');
    const router = useRouter();

    const handleLaboratoryPress = (labId: number) => {
        // Aqui você pode adicionar a navegação para detalhes do laboratório
        console.log('Laboratório selecionado:', labId);
    };

    const handleTabPress = (tab: string) => {
        if (tab === activeTab) return;

        setActiveTab(tab);

        // Navegação
        if (tab === 'reservations') {
            router.replace('/dashboard-professor/reservations/reservations');
        } else if (tab === 'profile') {
            router.replace('/dashboard-professor/profile/profile');
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
                            source={require('../../src/img/LogoIF.png')} 
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
                
                {/* Barra de Busca */}
                <View className='bg-white border border-gray-300 rounded-full px-4 flex-row items-center h-12'>
                    <TextInput
                        className='flex-1 text-gray-800 text-base h-10'
                        placeholder='Buscar...'
                        placeholderTextColor='#9CA3AF'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons name="search" size={20} color="#8B4513" />
                </View>
            </View>
            
            {/* Conteúdo Principal - Lista de Laboratórios */}
            <ScrollView className='flex-1 px-4 py-2 pb-20'>
                <Text className='text-xl font-bold text-green-700 mb-4'>
                    Laboratórios
                </Text>
                
                {LABORATORIES.map((lab) => (
                    <TouchableOpacity
                        key={lab.id}
                        className='bg-green-600 rounded-full p-4 mb-3 flex-row items-center'
                        onPress={() => handleLaboratoryPress(lab.id)}
                        activeOpacity={0.8}
                    >
                        {/* Ícone de Computador */}
                        <MaterialIcons name="computer" size={32} color="#B8E6B8" />
                        
                        {/* Nome do Laboratório */}
                        <Text className='flex-1 text-green-50 font-semibold text-base ml-4'>
                            {lab.name}
                        </Text>
                        
                        {/* Botão de Seta */}
                        <TouchableOpacity className='w-8 h-8 bg-gray-300 rounded-full justify-center items-center' activeOpacity={0.7}>
                            <Ionicons name="chevron-down" size={20} color="#4B5563" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
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
