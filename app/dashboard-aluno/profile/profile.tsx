import { AntDesign, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
    const router = useRouter();

    const handleDadosPerfil = () => {
        router.push('/dashboard-aluno/profile/dados-perfil');
    };

    const handleNotificacao = () => {
        router.push('/dashboard-aluno/profile/notificacao');
    };

    return (
        <View className='flex-1 py-20' >            
            {/* Conteúdo Principal - Perfil */}
            <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Ícone de perfil grande no topo */}
                <View className='items-center pt-8 pb-12'>
                    <View className='w-20 h-20 bg-green-700 rounded-full justify-center items-center'>
                        <AntDesign name="user" size={30} color="white" />
                    </View>
                </View>

                {/* Lista de opções de menu */}
                <View className='px-4'>
                    {/* Dados do perfil */}
                    <TouchableOpacity
                        className='flex-row justify-between items-center py-4 border-b border-gray-200'
                        activeOpacity={0.7}
                        onPress={handleDadosPerfil}
                    >
                        <Text className='text-green-700 text-base font-medium'>
                            Dados do perfil
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#15803d" />
                    </TouchableOpacity>

                    {/* Notificação */}
                    <TouchableOpacity
                        className='flex-row justify-between items-center py-4 border-b border-gray-200'
                        activeOpacity={0.7}
                        onPress={handleNotificacao}
                    >
                        <Text className='text-green-700 text-base font-medium'>
                            Notificação
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#15803d" />
                    </TouchableOpacity>

                    {/* Acesso ao suporte */}
                    <TouchableOpacity
                        className='flex-row justify-between items-center py-4 border-b border-gray-200'
                        activeOpacity={0.7}
                    >
                        <Text className='text-green-700 text-base font-medium'>
                            Acesso ao suporte
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#15803d" />
                    </TouchableOpacity>

                    {/* Sair da conta */}
                    <TouchableOpacity
                        className='flex-row justify-between items-center py-4 border-b border-gray-200'
                        activeOpacity={0.7}
                    >
                        <Text className='text-green-700 text-base font-medium'>
                            Sair da conta
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#15803d" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Gradiente na parte inferior alinhado com o navigation bar */}
            <LinearGradient
                colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)']}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 90,
                    pointerEvents: 'none',
                }}
            />
        </View>
    );
}
