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
            <ScrollView className='flex-1 px-4 py-2' contentContainerStyle={{ paddingBottom: 100 }}>
                <Text className='text-xl font-bold text-gray-800 mb-4'>
                    Minhas reservas:
                </Text>

                {/* Card de Reserva 1 - Confirmada */}
                <View className='bg-gray-200 rounded-2xl p-4 mb-4'>
                    {/* Nome do Laboratório */}
                    <View className='flex-row items-center mb-2'>
                        <Ionicons name="flask" size={20} color="#15803d" />
                        <Text className='text-green-700 font-bold text-base ml-2'>
                            Laboratório 02
                        </Text>
                    </View>

                    {/* Data e Horário */}
                    <Text className='text-gray-800 text-sm mb-3'>
                        Data: 18/07/2025 - Horário 20:20 - 22:00
                    </Text>

                    {/* Botões de Status */}
                    <View className='flex-row space-x-2'>
                        <View className='bg-green-600 rounded-lg px-4 py-2'>
                            <Text className='text-white font-semibold text-xs'>Confirmada</Text>
                        </View>
                        <View className='bg-gray-400 rounded-lg px-4 py-2'>
                            <Text className='text-white font-semibold text-xs'>Andamento</Text>
                        </View>
                        <View className='bg-gray-300 rounded-lg px-4 py-2'>
                            <Text className='text-gray-600 font-semibold text-xs'>Concluída</Text>
                        </View>
                    </View>
                </View>

                {/* Card de Reserva 2 - Confirmada */}
                <View className='bg-gray-200 rounded-2xl p-4 mb-4'>
                    <View className='flex-row items-center mb-2'>
                        <Ionicons name="flask" size={20} color="#15803d" />
                        <Text className='text-green-700 font-bold text-base ml-2'>
                            Laboratório 01
                        </Text>
                    </View>

                    <Text className='text-gray-800 text-sm mb-3'>
                        Data: 19/07/2025 - Horário 18:30 - 20:00
                    </Text>

                    <View className='flex-row space-x-2'>
                        <View className='bg-green-600 rounded-lg px-4 py-2'>
                            <Text className='text-white font-semibold text-xs'>Confirmada</Text>
                        </View>
                        <View className='bg-gray-400 rounded-lg px-4 py-2'>
                            <Text className='text-white font-semibold text-xs'>Andamento</Text>
                        </View>
                        <View className='bg-gray-300 rounded-lg px-4 py-2'>
                            <Text className='text-gray-600 font-semibold text-xs'>Concluída</Text>
                        </View>
                    </View>
                </View>

                {/* Card de Reserva 3 - Confirmada */}
                <View className='bg-gray-200 rounded-2xl p-4 mb-4'>
                    <View className='flex-row items-center mb-2'>
                        <Ionicons name="flask" size={20} color="#15803d" />
                        <Text className='text-green-700 font-bold text-base ml-2'>
                            Laboratório 03
                        </Text>
                    </View>

                    <Text className='text-gray-800 text-sm mb-3'>
                        Data: 20/07/2025 - Horário 18:30 - 20:00
                    </Text>

                    <View className='flex-row space-x-2'>
                        <View className='bg-green-600 rounded-lg px-4 py-2'>
                            <Text className='text-white font-semibold text-xs'>Confirmada</Text>
                        </View>
                        <View className='bg-gray-400 rounded-lg px-4 py-2'>
                            <Text className='text-white font-semibold text-xs'>Andamento</Text>
                        </View>
                        <View className='bg-gray-300 rounded-lg px-4 py-2'>
                            <Text className='text-gray-600 font-semibold text-xs'>Concluída</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
