import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function NotificacaoDetalhes() {
    const router = useRouter();

    const handleAceitar = () => {
        console.log('Aceitou a notificação');
        router.back();
    };

    const handleRecusar = () => {
        console.log('Recusou a notificação');
        router.back();
    };

    const handleVoltar = () => {
        router.back();
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
                        <Ionicons name="notifications" size={20} color="white" />
                    </View>

                    <Text className='text-lg font-semibold text-gray-800'>
                        Notificação
                    </Text>
                </View>
            </View>

            {/* Conteúdo da notificação */}
            <ScrollView className='flex-1 px-4 pt-6' contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Card da notificação */}
                <View className='mb-6'>
                    <Text className='text-green-700 font-semibold text-lg mb-3'>
                        Eng. Software 2
                    </Text>

                    <View className='bg-gray-50 border border-gray-200 rounded-2xl p-4'>
                        <Text className='text-gray-700 text-sm leading-5'>
                            O professor de engenharia de software 2, agendou o laboratório 2 para ministrar a disciplina
                        </Text>

                        {/* Botões de ação */}
                        <View className='flex-row gap-3 mt-4'>
                            <TouchableOpacity
                                className='bg-green-600 rounded-full px-6 py-2'
                                onPress={handleAceitar}
                                activeOpacity={0.8}
                            >
                                <Text className='text-white font-semibold text-sm'>
                                    Aderir
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className='bg-red-500 rounded-full px-6 py-2'
                                onPress={handleRecusar}
                                activeOpacity={0.8}
                            >
                                <Text className='text-white font-semibold text-sm'>
                                    Recusar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Outra notificação sem ação */}
                <View className='mb-4'>
                    <TouchableOpacity
                        className='flex-row items-center justify-between py-3 border-b border-gray-200'
                        activeOpacity={0.7}
                    >
                        <Text className='text-green-700 font-medium text-base'>
                            Eng. Software
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#15803d" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
