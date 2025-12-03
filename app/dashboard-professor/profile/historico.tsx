import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Historico() {
    const router = useRouter();

    // Mock de dados do histórico
    const historicoReservas = [
        {
            id: 1,
            laboratorio: 'Laboratório 01',
            data: '15/06/2025',
            horario: '18:30 - 20:10',
            disciplina: 'Engenharia de Software 1',
            status: 'Concluída',
        },
        {
            id: 2,
            laboratorio: 'Laboratório 03',
            data: '10/06/2025',
            horario: '20:20 - 22:00',
            disciplina: 'Banco de Dados',
            status: 'Concluída',
        },
        {
            id: 3,
            laboratorio: 'Laboratório 02',
            data: '05/06/2025',
            horario: '18:30 - 20:10',
            disciplina: 'Engenharia de Software 2',
            status: 'Concluída',
        },
        {
            id: 4,
            laboratorio: 'Laboratório 01',
            data: '01/06/2025',
            horario: '20:20 - 22:00',
            disciplina: 'Programação Orientada a Objetos',
            status: 'Cancelada',
        },
        {
            id: 5,
            laboratorio: 'Laboratório 03',
            data: '28/05/2025',
            horario: '18:30 - 20:10',
            disciplina: 'Engenharia de Software 1',
            status: 'Concluída',
        },
    ];

    return (
        <View className='flex-1 bg-white'>
            {/* Header */}
            <View className='bg-green-700 pt-12 pb-6 px-6'>
                <TouchableOpacity onPress={() => router.back()} className='mb-4'>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View className='flex-row items-center'>
                    <Ionicons name="time" size={32} color="white" />
                    <Text className='text-white text-2xl font-bold ml-2'>Histórico de Reservas</Text>
                </View>
            </View>

            <ScrollView className='flex-1 px-6 py-6' contentContainerStyle={{ paddingBottom: 100 }}>
                <Text className='text-gray-600 text-sm mb-6'>
                    Visualize todas as suas reservas anteriores
                </Text>

                {/* Lista de reservas do histórico */}
                {historicoReservas.map((reserva) => (
                    <View
                        key={reserva.id}
                        className='bg-gray-100 rounded-2xl p-4 mb-4 border-l-4 border-green-700'
                    >
                        {/* Nome do Laboratório */}
                        <View className='flex-row items-center justify-between mb-2'>
                            <View className='flex-row items-center'>
                                <Ionicons name="flask" size={20} color="#15803d" />
                                <Text className='text-green-700 font-bold text-base ml-2'>
                                    {reserva.laboratorio}
                                </Text>
                            </View>
                            {/* Badge de status */}
                            <View
                                className={`px-3 py-1 rounded-full ${
                                    reserva.status === 'Concluída' ? 'bg-green-100' : 'bg-red-100'
                                }`}
                            >
                                <Text
                                    className={`text-xs font-semibold ${
                                        reserva.status === 'Concluída' ? 'text-green-700' : 'text-red-700'
                                    }`}
                                >
                                    {reserva.status}
                                </Text>
                            </View>
                        </View>

                        {/* Informações da reserva */}
                        <View className='space-y-1'>
                            <View className='flex-row items-center'>
                                <Ionicons name="calendar" size={14} color="#6b7280" />
                                <Text className='text-gray-600 text-sm ml-2'>
                                    Data: {reserva.data}
                                </Text>
                            </View>
                            <View className='flex-row items-center'>
                                <Ionicons name="time" size={14} color="#6b7280" />
                                <Text className='text-gray-600 text-sm ml-2'>
                                    Horário: {reserva.horario}
                                </Text>
                            </View>
                            <View className='flex-row items-center'>
                                <Ionicons name="book" size={14} color="#6b7280" />
                                <Text className='text-gray-600 text-sm ml-2'>
                                    {reserva.disciplina}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Mensagem quando não há histórico */}
                {historicoReservas.length === 0 && (
                    <View className='bg-gray-100 rounded-2xl p-8 items-center'>
                        <Ionicons name="time-outline" size={64} color="#9CA3AF" />
                        <Text className='text-gray-500 text-lg font-semibold mt-4'>
                            Nenhum histórico encontrado
                        </Text>
                        <Text className='text-gray-400 text-center mt-2'>
                            Suas reservas concluídas aparecerão aqui
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Gradiente inferior */}
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
