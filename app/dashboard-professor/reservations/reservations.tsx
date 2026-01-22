import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { ApiService } from '../../../src/services/api';

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
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    description?: string;
}

export default function Reservations() {
    const [searchQuery, setSearchQuery] = useState('');
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getReservations();
            console.log('[Reservations] Reservas carregadas:', data);
            setReservations(data);
        } catch (error) {
            console.error('[Reservations] Erro ao carregar reservas:', error);
            Alert.alert('Erro', 'Não foi possível carregar as reservas. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Formatar data e horário
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return { date: `${day}/${month}/${year}`, time: `${hours}:${minutes}` };
    };

    // Calcular o status baseado no horário da aula
    const getReservationStatus = (reservation: Reservation) => {
        // Se foi cancelada, retorna cancelada
        if (reservation.status === 'CANCELLED') {
            return {
                type: 'CANCELLED',
                label: 'Cancelada',
                color: 'bg-red-500'
            };
        }

        // Se está pendente, retorna pendente
        if (reservation.status === 'PENDING') {
            return {
                type: 'PENDING',
                label: 'Pendente',
                color: 'bg-yellow-500'
            };
        }

        // Para reservas confirmadas, calcula baseado no horário
        const now = new Date();
        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        if (now < start) {
            // Ainda não começou = Confirmada
            return {
                type: 'CONFIRMED',
                label: 'Confirmada',
                color: 'bg-green-600'
            };
        } else if (now >= start && now <= end) {
            // Está acontecendo agora = Em Andamento
            return {
                type: 'IN_PROGRESS',
                label: 'Andamento',
                color: 'bg-blue-500'
            };
        } else {
            // Já passou = Concluída
            return {
                type: 'COMPLETED',
                label: 'Concluída',
                color: 'bg-gray-300'
            };
        }
    };

    // Filtrar reservas baseado na busca
    const filteredReservations = reservations.filter(reservation =>
        reservation.laboratory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.discipline?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className='flex-1'>
            {/* Header */}
            <View className='bg-white pt-12 pb-4 px-4'>
                {/* Top Row - Icons */}
                <View className='flex-row justify-between items-center mb-4'>
                    {/* Ícone de Perfil */}
                    <TouchableOpacity className='w-12 h-12 bg-green-700 rounded-full justify-center items-center' activeOpacity={0.7}>
                        <AntDesign name="user" size={24} color="white" />
                    </TouchableOpacity>
                    
                    {/* Logo SISREV */}
                    <View className='flex-row items-center'>
                        <Image 
                            source={require('../../../src/img/LogoIF.png')} 
                            className='w-8 h-8 mr-2'
                            resizeMode='contain'
                        />
                        <Text className='text-4xl font-black text-green-700'>
                            SISREV
                        </Text>
                    </View>
                    
                    {/* Ícone de Notificações */}
                    <TouchableOpacity className='w-10 h-10 justify-center items-center' activeOpacity={0.7}>
                        <Ionicons name="notifications-outline" size={28} color="#1C5E27" />
                    </TouchableOpacity>
                </View>
                
                {/* Barra de Busca */}
                <View className='bg-white border border-gray-300 rounded-full px-4 flex-row items-center h-12'>
                    <TextInput
                        className='flex-1 text-gray-800 text-base h-10'
                        placeholder='Buscar reservas...'
                        placeholderTextColor='#9CA3AF'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons name="search" size={20} color="#8B4513" />
                </View>
            </View>
            
            {/* Conteúdo Principal - Lista de Reservas */}
            <ScrollView className='flex-1 px-4 py-2' contentContainerStyle={{ paddingBottom: 100 }}>
                <Text className='text-xl font-bold text-gray-800 mb-4'>
                    Minhas reservas:
                </Text>

                {loading ? (
                    <View className='flex-1 justify-center items-center py-20'>
                        <ActivityIndicator size="large" color="#15803d" />
                        <Text className='text-gray-600 mt-4'>Carregando reservas...</Text>
                    </View>
                ) : filteredReservations.length === 0 ? (
                    <View className='flex-1 justify-center items-center py-20'>
                        <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
                        <Text className='text-gray-600 mt-4 text-center'>
                            {searchQuery ? 'Nenhuma reserva encontrada' : 'Você ainda não possui reservas'}
                        </Text>
                    </View>
                ) : (
                    filteredReservations.map((reservation) => {
                        const startDateTime = formatDateTime(reservation.startDate);
                        const endDateTime = formatDateTime(reservation.endDate);
                        const statusInfo = getReservationStatus(reservation);

                        // Determina quais status mostrar baseado no status calculado
                        const showConfirmada = statusInfo.type === 'CONFIRMED';
                        const showAndamento = statusInfo.type === 'IN_PROGRESS';
                        const showConcluida = statusInfo.type === 'COMPLETED';

                        return (
                            <View key={reservation.id} className='bg-gray-200 rounded-2xl p-4 mb-4'>
                                {/* Nome do Laboratório */}
                                <View className='flex-row items-center mb-2'>
                                    <Ionicons name="flask" size={20} color="#15803d" />
                                    <Text className='text-green-700 font-bold text-base ml-2'>
                                        {reservation.laboratory.name}
                                    </Text>
                                </View>

                                {/* Disciplina (se houver) */}
                                {reservation.discipline && (
                                    <Text className='text-gray-600 text-xs mb-1 ml-7'>
                                        Disciplina: {reservation.discipline.name}
                                    </Text>
                                )}

                                {/* Data e Horário */}
                                <Text className='text-gray-800 text-sm mb-3 ml-7'>
                                    Data: {startDateTime.date} - Horário: {startDateTime.time} - {endDateTime.time}
                                </Text>

                                {/* Descrição (se houver) */}
                                {reservation.description && (
                                    <Text className='text-gray-600 text-xs mb-3 ml-7 italic'>
                                        {reservation.description}
                                    </Text>
                                )}

                                {/* Botões de Status - Mostra os três status com destaque no atual */}
                                <View className='flex-row ml-7' style={{ gap: 8 }}>
                                    {/* Confirmada - Verde quando ativo, cinza quando inativo */}
                                    <View className={`rounded-lg px-4 py-2 ${
                                        showConfirmada ? 'bg-green-600' : 'bg-gray-400'
                                    }`}>
                                        <Text className='text-white font-semibold text-xs'>
                                            Confirmada
                                        </Text>
                                    </View>

                                    {/* Andamento - Azul/Verde claro quando ativo, cinza quando inativo */}
                                    <View className={`rounded-lg px-4 py-2 ${
                                        showAndamento ? 'bg-blue-500' : 'bg-gray-400'
                                    }`}>
                                        <Text className='text-white font-semibold text-xs'>
                                            Andamento
                                        </Text>
                                    </View>

                                    {/* Concluída - Cinza claro quando ativo, cinza quando inativo */}
                                    <View className={`rounded-lg px-4 py-2 ${
                                        showConcluida ? 'bg-gray-300' : 'bg-gray-400'
                                    }`}>
                                        <Text className={`font-semibold text-xs ${
                                            showConcluida ? 'text-gray-600' : 'text-white'
                                        }`}>
                                            Concluída
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}
