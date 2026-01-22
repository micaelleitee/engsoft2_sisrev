import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { ApiService } from '../../src/services/api';

interface Reservation {
    id: string;
    laboratory: {
        id: string;
        name: string;
    };
    discipline?: {
        id: string;
        name: string;
    };
    startDate: string;
    endDate: string;
    status: string;
    dia?: number;
    data?: string;
    horario?: string;
    laboratorio?: string;
}

export default function DisciplinaDetalhes() {
    const router = useRouter();
    const params = useLocalSearchParams<{ disciplina: string; disciplinaId?: string }>();
    const disciplina = Array.isArray(params.disciplina) ? params.disciplina[0] : params.disciplina;
    const disciplinaId = Array.isArray(params.disciplinaId) ? params.disciplinaId[0] : params.disciplinaId;

    const [expanded, setExpanded] = useState(false);
    const [reservas, setReservas] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    // Carregar reservas do backend
    useEffect(() => {
        loadReservations();
    }, [disciplinaId]);

    const loadReservations = async () => {
        try {
            setLoading(true);
            const reservations = await ApiService.getReservations();
            
            // Filtrar reservas por disciplina (se disciplinaId fornecido) ou por nome
            let filteredReservations = reservations;
            
            if (disciplinaId) {
                filteredReservations = reservations.filter((reservation: Reservation) => 
                    reservation.discipline?.id === disciplinaId && 
                    reservation.status === 'CONFIRMED'
                );
            } else if (disciplina) {
                filteredReservations = reservations.filter((reservation: Reservation) => 
                    reservation.discipline?.name === disciplina && 
                    reservation.status === 'CONFIRMED'
                );
            }
            
            // Formatar reservas
            const formattedReservations = filteredReservations.map((reservation: Reservation) => {
                const startDate = new Date(reservation.startDate);
                const endDate = new Date(reservation.endDate);
                
                // Formatar data e horário
                const dia = startDate.getDate();
                const data = `${String(dia).padStart(2, '0')}/${String(startDate.getMonth() + 1).padStart(2, '0')}/${startDate.getFullYear()}`;
                const horario = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')} - ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
                
                return {
                    ...reservation,
                    dia,
                    data,
                    horario,
                    laboratorio: reservation.laboratory.name
                };
            });
            
            setReservas(formattedReservations);
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
            Alert.alert('Erro', 'Não foi possível carregar as reservas. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Obter dias únicos das reservas para o calendário
    const diasSemana = [...new Set(reservas.map(r => r.dia).filter(d => d !== undefined))] as number[];
    diasSemana.sort((a, b) => a - b);

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
                {loading ? (
                    <View className='flex-1 justify-center items-center py-20'>
                        <ActivityIndicator size="large" color="#15803d" />
                        <Text className='text-gray-600 mt-4'>Carregando reservas...</Text>
                    </View>
                ) : (
                    <>
                        {/* Card de Reservas */}
                        <View className='mx-4 mt-6'>
                            <View className='bg-green-700 rounded-3xl p-6'>
                                {/* Título da disciplina com ícone */}
                                <View className='flex-row items-center mb-4'>
                                    <MaterialIcons name="computer" size={24} color="white" />
                                    <Text className='text-white font-bold text-base ml-2 flex-1' numberOfLines={1}>
                                        {disciplina}
                                    </Text>
                                    {reservas.length > 0 && (
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
                                    )}
                                </View>

                                {reservas.length === 0 ? (
                                    <View className='bg-white rounded-2xl p-4'>
                                        <Text className='text-gray-600 text-center'>
                                            Nenhuma reserva de laboratório para esta disciplina
                                        </Text>
                                    </View>
                                ) : (
                                    <>
                                        {/* Calendário da semana */}
                                        {diasSemana.length > 0 && (
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
                                                                        {getReservaInfo(dia)?.laboratorio?.replace('Laboratório ', 'Lab ') || 'Lab'}
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        )}

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
                                                {reservas.map((reserva) => (
                                                    <View
                                                        key={reserva.id}
                                                        className={`${reservas.indexOf(reserva) !== 0 ? 'mt-3 pt-3 border-t border-gray-200' : ''}`}
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
                                    </>
                                )}
                            </View>
                        </View>
                    </>
                )}

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
