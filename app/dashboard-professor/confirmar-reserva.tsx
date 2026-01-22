import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../../src/services/api';

export default function ConfirmarReserva() {
    const router = useRouter();
    const { laboratorio, labId, data, selectedDate } = useLocalSearchParams();

    const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>('Engenharia de Software 1');
    const [disciplinaId, setDisciplinaId] = useState<string | null>(null);
    const [concordaTermos, setConcordaTermos] = useState(false);
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disciplinas, setDisciplinas] = useState<Array<{ id: string; name: string }>>([]);

    // Horários disponíveis
    const horariosDisponiveis = [
        '18:30 - 19:20',
        '19:20 - 20:10',
        '20:20 - 21:10',
        '21:10 - 22:00',
    ];

    // Carregar disciplinas do backend
    useEffect(() => {
        loadDisciplines();
    }, []);

    const loadDisciplines = async () => {
        try {
            // Por enquanto, vamos usar disciplinas mockadas
            // TODO: Implementar endpoint de disciplinas no backend
            // Por enquanto, vamos usar disciplinas mockadas sem IDs
            // TODO: Implementar endpoint de disciplinas no backend para buscar IDs reais
            const mockDisciplines = [
                { id: '', name: 'Engenharia de Software 1' },
                { id: '', name: 'Engenharia de Software 2' },
                { id: '', name: 'Banco de Dados' },
                { id: '', name: 'Programação Orientada a Objetos' },
            ];
            setDisciplinas(mockDisciplines);
            if (mockDisciplines.length > 0) {
                setDisciplinaSelecionada(mockDisciplines[0].name);
                // Não definir disciplinaId, será opcional
            }
        } catch (error) {
            console.error('Erro ao carregar disciplinas:', error);
        }
    };

    const handleReservar = async () => {
        if (!horarioSelecionado) {
            Alert.alert('Atenção', 'Por favor, selecione um horário.');
            return;
        }

        if (!concordaTermos) {
            Alert.alert('Atenção', 'Você precisa concordar com os termos para prosseguir.');
            return;
        }

        if (!labId) {
            Alert.alert('Erro', 'ID do laboratório não encontrado.');
            return;
        }

        // disciplineId é opcional, então não vamos validar

        if (!selectedDate) {
            Alert.alert('Erro', 'Data não encontrada.');
            return;
        }

        setLoading(true);
        try {
            // Parse do horário (formato: "18:30 - 19:20")
            const [startTime, endTime] = horarioSelecionado.split(' - ');
            const [startHour, startMinute] = startTime.split(':');
            const [endHour, endMinute] = endTime.split(':');

            // Criar datas ISO
            const startDate = new Date(`${selectedDate}T${startHour}:${startMinute}:00`);
            const endDate = new Date(`${selectedDate}T${endHour}:${endMinute}:00`);

            // Converter para ISO string
            const startDateISO = startDate.toISOString();
            const endDateISO = endDate.toISOString();

            console.log('[Reserva] Criando reserva:', {
                laboratoryId: labId,
                disciplineId: disciplinaId,
                startDate: startDateISO,
                endDate: endDateISO
            });

            const reservationData: any = {
                laboratoryId: labId as string,
                startDate: startDateISO,
                endDate: endDateISO,
                description: `Reserva para ${disciplinaSelecionada}`
            };

            // Adicionar disciplineId apenas se estiver disponível
            if (disciplinaId) {
                reservationData.disciplineId = disciplinaId;
            }

            const reservation = await ApiService.createReservation(reservationData);

            console.log('[Reserva] Reserva criada com sucesso:', reservation);

            Alert.alert(
                'Reserva Confirmada!',
                `Laboratório: ${laboratorio}\nData: ${data}\nHorário: ${horarioSelecionado}\nDisciplina: ${disciplinaSelecionada}`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/dashboard-professor/reservations/reservations'),
                    },
                ]
            );
        } catch (error: any) {
            console.error('[Reserva] Erro ao criar reserva:', error);
            Alert.alert(
                'Erro',
                error?.error || error?.message || 'Erro ao criar reserva. Tente novamente.'
            );
        } finally {
            setLoading(false);
        }
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

            <ScrollView
                className='flex-1 px-6 py-6'
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={true}
            >
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
                <View className='mb-6'>
                    <TouchableOpacity
                        onPress={() => setDropdownAberto(!dropdownAberto)}
                        className='border-2 border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between bg-white'
                    >
                        <Text className='text-gray-700 text-base'>{disciplinaSelecionada}</Text>
                        <Ionicons
                            name={dropdownAberto ? "chevron-up" : "chevron-down"}
                            size={24}
                            color="#6b7280"
                        />
                    </TouchableOpacity>

                    {dropdownAberto && (
                        <View className='border-2 border-gray-300 border-t-0 rounded-b-xl overflow-hidden bg-white'>
                            {disciplinas.map((disciplina, index) => (
                                <TouchableOpacity
                                    key={disciplina.id}
                                    onPress={() => {
                                        setDisciplinaSelecionada(disciplina.name);
                                        // disciplineId é opcional, então não vamos definir
                                        setDropdownAberto(false);
                                    }}
                                    className={`py-3 px-4 flex-row items-center justify-between ${
                                        disciplinaSelecionada === disciplina.name ? 'bg-green-50' : 'bg-white'
                                    } ${index < disciplinas.length - 1 ? 'border-b border-gray-200' : ''}`}
                                >
                                    <Text className={`text-base ${
                                        disciplinaSelecionada === disciplina.name ? 'text-green-700 font-semibold' : 'text-gray-700'
                                    }`}>
                                        {disciplina.name}
                                    </Text>
                                    {disciplinaSelecionada === disciplina.name && (
                                        <Ionicons name="checkmark-circle" size={24} color="#15803d" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
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
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className='text-white text-center font-semibold text-base'>Reservar</Text>
                        )}
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
