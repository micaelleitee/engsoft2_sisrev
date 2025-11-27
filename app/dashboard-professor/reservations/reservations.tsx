import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Reservations() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View className='flex-1'>
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
                            source={require('../../../src/img/LogoIF.png')} 
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
                        placeholder='Buscar reservas...'
                        placeholderTextColor='#9CA3AF'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons name="search" size={20} color="#8B4513" />
                </View>
            </View>
            
            {/* Conteúdo Principal - Lista de Reservas */}
            <ScrollView className='flex-1 px-4 py-2' contentContainerStyle={{ paddingBottom: 20 }}>
                <Text className='text-xl font-bold text-green-700 mb-4'>
                    Minhas Reservas
                </Text>
                
                {/* Placeholder para reservas */}
                <View className='bg-gray-100 rounded-lg p-8 items-center'>
                    <MaterialIcons name="event" size={64} color="#9CA3AF" />
                    <Text className='text-gray-500 text-lg font-semibold mt-4'>
                        Nenhuma reserva encontrada
                    </Text>
                    <Text className='text-gray-400 text-center mt-2'>
                        Faça sua primeira reserva de laboratório
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
