import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Mock de notificações
const NOTIFICACOES = [
    {
        id: 1,
        disciplina: 'Eng. Software 2',
        mensagem: 'O professor de engenharia de software 2, agendou o laboratório 2 para ministrar a disciplina',
        lida: false,
        hasAction: true,
    },
    {
        id: 2,
        disciplina: 'Eng. Software',
        mensagem: 'Nova reserva de laboratório',
        lida: true,
        hasAction: false,
    },
];

export default function Notificacao() {
    const router = useRouter();

    const handleNotificacaoPress = (notificacao: typeof NOTIFICACOES[0]) => {
        if (notificacao.hasAction) {
            router.push(`/dashboard-aluno/profile/notificacao-detalhes?id=${notificacao.id}`);
        }
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

            {/* Lista de notificações */}
            <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 20 }}>
                {NOTIFICACOES.map((notificacao) => (
                    <TouchableOpacity
                        key={notificacao.id}
                        className='px-4 py-4 border-b border-gray-200 flex-row items-center justify-between'
                        onPress={() => handleNotificacaoPress(notificacao)}
                        activeOpacity={0.7}
                    >
                        <View className='flex-1'>
                            <Text className='text-green-700 font-medium text-base mb-1'>
                                {notificacao.disciplina}
                            </Text>
                            {notificacao.hasAction && (
                                <Text className='text-gray-600 text-sm' numberOfLines={2}>
                                    {notificacao.mensagem}
                                </Text>
                            )}
                        </View>

                        <View className='flex-row items-center ml-3'>
                            {!notificacao.lida && (
                                <View className='w-3 h-3 bg-red-500 rounded-full mr-3' />
                            )}
                            <Ionicons name="chevron-forward" size={20} color="#15803d" />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
