import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ConfirmarReserva() {
    const router = useRouter();
    const { laboratorio, data } = useLocalSearchParams();

    const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>('Engenharia de Software 1');
    const [concordaTermos, setConcordaTermos] = useState(false);

    // Horários disponíveis
    const horariosDisponiveis = [
        '18:30 - 19:20',
        '19:20 - 20:10',
        '20:20 - 21:10',
        '21:10 - 22:00',
    ];

    // Disciplinas do professor
    const disciplinas = [
        'Engenharia de Software 1',
        'Engenharia de Software 2',
        'Banco de Dados',
        'Programação Orientada a Objetos',
    ];

    const handleReservar = () => {
        if (!horarioSelecionado) {
            Alert.alert('Atenção', 'Por favor, selecione um horário.');
            return;
        }

        if (!concordaTermos) {
            Alert.alert('Atenção', 'Você precisa concordar com os termos para prosseguir.');
            return;
        }

        Alert.alert(
            'Reserva Confirmada!',
            `Laboratório: ${laboratorio}\nData: ${data}\nHorário: ${horarioSelecionado}\nDisciplina: ${disciplinaSelecionada}`,
            [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]
        );
    };

    const handleCancelar = () => {
        Alert.alert(
            'Cancelar Reserva',
            'Tem certeza que deseja cancelar?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => router.back() },
            ]
        );
    };

    return (
        <View className='flex-1 bg-white'>
            {/* Header */}
            <View className='bg-green-700 pt-12 pb-6 px-6'>
                <TouchableOpacity onPress={() => router.back()} className='mb-4'>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View className='flex-row items-center'>
                    <Ionicons name="checkmark-circle" size={32} color="white" className='mr-2' />
                    <Text className='text-white text-2xl font-bold'>Confirmar Reserva</Text>
                </View>
            </View>

            <ScrollView className='flex-1 px-6 py-6'>
                {/* Card do Laboratório */}
                <View className='bg-green-700 rounded-full py-3 px-6 mb-6 flex-row items-center justify-center'>
                    <Ionicons name="flask" size={20} color="white" />
                    <Text className='text-white font-semibold text-base ml-2'>{laboratorio}</Text>
                </View>

                {/* Cards de Data e Horário */}
                <View className='flex-row justify-between mb-6'>
                    {/* Card Data */}
                    <View className='flex-1 mr-2 border-4 border-green-700 rounded-3xl p-4 bg-gray-100'>
                        <Text className='text-gray-600 text-sm mb-1'>Data:</Text>
                        <Text className='text-gray-800 text-lg font-bold'>{data}</Text>
                    </View>

                    {/* Card Horário */}
                    <View className='flex-1 ml-2 border-4 border-green-700 rounded-3xl p-4 bg-gray-100'>
                        <Text className='text-gray-600 text-sm mb-1'>Horário:</Text>
                        <Text className='text-gray-800 text-lg font-bold'>
                            {horarioSelecionado || 'Selecionar'}
                        </Text>
                    </View>
                </View>

                {/* Seleção de Horário */}
                <Text className='text-gray-700 text-base font-semibold mb-3'>Selecione o horário:</Text>
                <View className='mb-6'>
                    {horariosDisponiveis.map((horario) => (
                        <TouchableOpacity
                            key={horario}
                            onPress={() => setHorarioSelecionado(horario)}
                            className={`py-3 px-4 rounded-xl mb-2 border-2 ${
                                horarioSelecionado === horario
                                    ? 'bg-green-700 border-green-700'
                                    : 'bg-white border-gray-300'
                            }`}
                        >
                            <Text
                                className={`text-base font-semibold ${
                                    horarioSelecionado === horario ? 'text-white' : 'text-gray-700'
                                }`}
                            >
                                {horario}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Seleção de Disciplina */}
                <Text className='text-gray-700 text-base font-semibold mb-3'>Disciplina:</Text>
                <View className='border-2 border-gray-300 rounded-xl mb-6 overflow-hidden'>
                    <View className='bg-white'>
                        {disciplinas.map((disciplina, index) => (
                            <TouchableOpacity
                                key={disciplina}
                                onPress={() => setDisciplinaSelecionada(disciplina)}
                                className={`py-3 px-4 flex-row items-center justify-between ${
                                    index < disciplinas.length - 1 ? 'border-b border-gray-200' : ''
                                }`}
                            >
                                <Text className='text-gray-700 text-base'>{disciplina}</Text>
                                {disciplinaSelecionada === disciplina && (
                                    <Ionicons name="checkmark-circle" size={24} color="#15803d" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Checkbox Termos */}
                <TouchableOpacity
                    onPress={() => setConcordaTermos(!concordaTermos)}
                    className='flex-row items-center mb-8'
                >
                    <View
                        className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
                            concordaTermos ? 'bg-green-700 border-green-700' : 'border-gray-400'
                        }`}
                    >
                        {concordaTermos && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                    <Text className='text-gray-700 text-sm'>Concordo com os termos</Text>
                </TouchableOpacity>

                {/* Botões */}
                <View className='flex-row justify-between mb-6'>
                    <TouchableOpacity
                        onPress={handleReservar}
                        className='flex-1 bg-green-700 rounded-full py-3 mr-2'
                    >
                        <Text className='text-white text-center font-semibold text-base'>Reservar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleCancelar}
                        className='flex-1 bg-red-500 rounded-full py-3 ml-2'
                    >
                        <Text className='text-white text-center font-semibold text-base'>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
