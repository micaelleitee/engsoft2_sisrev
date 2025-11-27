import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Mock de reservas por disciplina
const RESERVAS_MOCK = {
    'Engenharia de Software': [
        { dia: 18, laboratorio: 'Laboratório 02', data: '18/07/2025', horario: '20:20 - 22:00' },
        { dia: 20, laboratorio: 'Laboratório 01', data: '20/07/2025', horario: '18:30 - 20:00' },
        { dia: 22, laboratorio: 'Laboratório 03', data: '22/07/2025', horario: '19:00 - 21:00' },
    ],
};

export default function DisciplinaDetalhes() {
    const router = useRouter();
    const params = useLocalSearchParams<{ disciplina: string }>();
    const disciplina = Array.isArray(params.disciplina) ? params.disciplina[0] : params.disciplina;

    const [expanded, setExpanded] = useState(false);

    // Pega as reservas da disciplina (usa mock por enquanto)
    const reservas = RESERVAS_MOCK[disciplina as keyof typeof RESERVAS_MOCK] || [];

    // Dias da semana para o calendário
    const diasSemana = [18, 19, 20, 21, 22];

    // Verifica se um dia está reservado
    const isDiaReservado = (dia: number) => {
        return reservas.some(r => r.dia === dia);
    };

    // Pega informações da reserva de um dia específico
    const getReservaInfo = (dia: number) => {
        return reservas.find(r => r.dia === dia);
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

                    <View className='flex-1'>
                        <Text className='text-lg font-semibold text-gray-800' numberOfLines={1}>
                            {disciplina}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Conteúdo */}
            <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Card de Reservas */}
                <View className='mx-4 mt-6'>
                    <View className='bg-green-700 rounded-3xl p-6'>
                        {/* Título da disciplina com ícone */}
                        <View className='flex-row items-center mb-4'>
                            <MaterialIcons name="computer" size={24} color="white" />
                            <Text className='text-white font-bold text-base ml-2 flex-1' numberOfLines={1}>
                                {disciplina}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setExpanded(!expanded)}
                                className='w-8 h-8 bg-white rounded-full justify-center items-center'
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={expanded ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#15803d"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Calendário da semana */}
                        <View className='flex-row justify-around items-center mb-4'>
                            {diasSemana.map((dia) => {
                                const isReservado = isDiaReservado(dia);
                                return (
                                    <View key={dia} className='items-center'>
                                        <View
                                            className={`w-12 h-12 rounded-full justify-center items-center ${
                                                isReservado ? 'bg-red-500' : 'bg-gray-300'
                                            }`}
                                        >
                                            <Text className='text-white font-bold text-base'>
                                                {dia}
                                            </Text>
                                        </View>
                                        {isReservado && (
                                            <View className='mt-1 bg-white px-2 py-0.5 rounded'>
                                                <Text className='text-green-700 text-xs font-semibold'>
                                                    {getReservaInfo(dia)?.laboratorio.replace('Laboratório ', 'Lab ')}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>

                        {/* Botão Ver mais */}
                        {!expanded && (
                            <TouchableOpacity
                                onPress={() => setExpanded(true)}
                                className='bg-white rounded-full py-2 items-center'
                                activeOpacity={0.8}
                            >
                                <Text className='text-green-700 font-semibold'>
                                    Ver mais
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Detalhes expandidos */}
                        {expanded && (
                            <View className='mt-4 bg-white rounded-2xl p-4'>
                                {reservas.map((reserva, index) => (
                                    <View
                                        key={index}
                                        className={`${index !== 0 ? 'mt-3 pt-3 border-t border-gray-200' : ''}`}
                                    >
                                        <View className='flex-row items-center mb-2'>
                                            <MaterialIcons name="computer" size={20} color="#15803d" />
                                            <Text className='text-green-700 font-bold text-sm ml-2'>
                                                {reserva.laboratorio}
                                            </Text>
                                        </View>
                                        <Text className='text-gray-600 text-sm'>
                                            Data: {reserva.data} - Horário {reserva.horario}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Legenda */}
                <View className='mx-4 mt-6'>
                    <Text className='text-gray-600 font-semibold mb-3'>
                        Legenda:
                    </Text>
                    <View className='flex-row items-center mb-2'>
                        <View className='w-8 h-8 bg-red-500 rounded-full' />
                        <Text className='text-gray-700 ml-3'>
                            Dia com laboratório reservado
                        </Text>
                    </View>
                    <View className='flex-row items-center'>
                        <View className='w-8 h-8 bg-gray-300 rounded-full' />
                        <Text className='text-gray-700 ml-3'>
                            Dia sem reserva
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
