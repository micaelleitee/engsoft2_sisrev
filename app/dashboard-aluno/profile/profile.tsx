import { AntDesign, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {

    return (
        <View className='flex-1' >
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
            </View>
            
            {/* Conteúdo Principal - Perfil */}
            <ScrollView className='flex-1 px-4 py-2' contentContainerStyle={{ paddingBottom: 20 }}>
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

            {/* Gradiente na parte inferior para transição com o navigation bar */}
            <LinearGradient
                colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.8)']}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 100,
                    pointerEvents: 'none',
                }}
            />
        </View>
    );
}
