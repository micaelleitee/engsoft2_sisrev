import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Suporte() {
    const router = useRouter();

    const handleVoltar = () => {
        router.back();
    };

    const handleEmailPress = () => {
        Linking.openURL('mailto:suporte@sisrev.com.br');
    };

    const handlePhonePress = () => {
        Linking.openURL('tel:88xxxx-xxxx');
    };

    return (
        <View className='flex-1 bg-white'>
            {/* Header */}
            <View className='bg-white pt-12 pb-4 px-4 border-b border-gray-200'>
                <View className='flex-row items-center'>
                    <TouchableOpacity
                        onPress={handleVoltar}
                        className='mr-4'
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#15803d" />
                    </TouchableOpacity>

                    <View className='w-10 h-10 bg-green-700 rounded-full justify-center items-center mr-3'>
                        <Ionicons name="person" size={20} color="white" />
                    </View>

                    <Text className='text-lg font-semibold text-gray-800'>
                        Suporte
                    </Text>
                </View>
            </View>

            {/* Conteúdo */}
            <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Ícone de alerta centralizado */}
                <View className='items-center pt-20 pb-8'>
                    <MaterialIcons name="error-outline" size={80} color="#9CA3AF" />
                </View>

                {/* Informações de contato */}
                <View className='px-4'>
                    <Text className='text-gray-600 text-center text-base font-semibold mb-6'>
                        Contatos:
                    </Text>

                    {/* Email */}
                    <TouchableOpacity
                        onPress={handleEmailPress}
                        activeOpacity={0.7}
                        className='mb-4'
                    >
                        <Text className='text-gray-500 text-center text-sm'>
                            suporte@sisrev.com.br
                        </Text>
                    </TouchableOpacity>

                    {/* Telefone */}
                    <TouchableOpacity
                        onPress={handlePhonePress}
                        activeOpacity={0.7}
                    >
                        <Text className='text-gray-500 text-center text-sm'>
                            (88)xxxx-xxxx
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
