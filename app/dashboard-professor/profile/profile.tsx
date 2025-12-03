import { AntDesign, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleDadosPerfil = () => {
        router.push('/dashboard-professor/profile/dados-perfil');
    };

    const handleNotificacao = () => {
        router.push('/dashboard-professor/profile/notificacao');
    };

    const handleHistorico = () => {
        router.push('/dashboard-professor/profile/historico');
    };

    const handleSuporte = () => {
        router.push('/dashboard-professor/profile/suporte');
    };

    const handleSairClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        console.log('Usuário saiu');
        router.replace('/');
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <View className='flex-1 py-20'>
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

                    {/* Histórico */}
                    <TouchableOpacity
                        className='flex-row justify-between items-center py-4 border-b border-gray-200'
                        activeOpacity={0.7}
                        onPress={handleHistorico}
                    >
                        <Text className='text-green-700 text-base font-medium'>
                            Histórico
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#15803d" />
                    </TouchableOpacity>

                    {/* Acesso ao suporte */}
                    <TouchableOpacity
                        className='flex-row justify-between items-center py-4 border-b border-gray-200'
                        activeOpacity={0.7}
                        onPress={handleSuporte}
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
                        onPress={handleSairClick}
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

            {/* Modal de confirmação de logout */}
            <Modal
                visible={showLogoutModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCancelLogout}
            >
                <BlurView
                    intensity={90}
                    tint="dark"
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    }}
                >
                    <View className='bg-white rounded-3xl mx-8 p-6 w-80'>
                        {/* Ícone de alerta */}
                        <View className='items-center mb-4'>
                            <View className='w-16 h-16 bg-yellow-100 rounded-full justify-center items-center'>
                                <Ionicons name="warning" size={32} color="#F59E0B" />
                            </View>
                        </View>

                        {/* Título */}
                        <Text className='text-gray-800 text-lg font-bold text-center mb-2'>
                            Sair da conta
                        </Text>

                        {/* Mensagem */}
                        <Text className='text-gray-600 text-center mb-6'>
                            Tem certeza que deseja sair da sua conta?
                        </Text>

                        {/* Botões */}
                        <View className='flex-row gap-3'>
                            <TouchableOpacity
                                className='flex-1 bg-gray-300 rounded-full py-3 justify-center items-center'
                                onPress={handleCancelLogout}
                                activeOpacity={0.8}
                            >
                                <Text className='text-gray-700 font-semibold text-base'>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className='flex-1 bg-red-500 rounded-full py-3 justify-center items-center'
                                onPress={handleConfirmLogout}
                                activeOpacity={0.8}
                            >
                                <Text className='text-white font-semibold text-base'>
                                    Sair
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </View>
    );
}
