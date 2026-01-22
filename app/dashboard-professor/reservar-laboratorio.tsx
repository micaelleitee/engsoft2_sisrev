import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { ApiService } from '../../src/services/api';

// Configuração do calendário em português
LocaleConfig.locales['pt-br'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

interface Reservation {
    id: string;
    startDate: string;
    endDate: string;
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    professor: {
        id: string;
        name: string;
    };
}

interface Laboratory {
    id: string;
    name: string;
    reservations: Reservation[];
}

export default function ReservarLaboratorio() {
    const router = useRouter();
    const params = useLocalSearchParams<{ laboratorio: string; labId: string }>();
    const laboratorio = Array.isArray(params.laboratorio) ? params.laboratorio[0] : params.laboratorio;
    const labId = Array.isArray(params.labId) ? params.labId[0] : params.labId;

    const [selectedDate, setSelectedDate] = useState('');
    const [laboratory, setLaboratory] = useState<Laboratory | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD
    });

    useEffect(() => {
        loadLaboratory();
    }, [labId]);

    const loadLaboratory = async () => {
        if (!labId) {
            Alert.alert('Erro', 'ID do laboratório não encontrado.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const lab = await ApiService.getLaboratoryById(labId);
            console.log('[ReservarLaboratorio] Laboratório carregado:', lab);
            setLaboratory(lab);
        } catch (error) {
            console.error('[ReservarLaboratorio] Erro ao carregar laboratório:', error);
            Alert.alert('Erro', 'Não foi possível carregar as informações do laboratório.');
        } finally {
            setLoading(false);
        }
    };

    // Formata data para YYYY-MM-DD
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Verifica se uma data está ocupada
    const isDateOccupied = (dateString: string): boolean => {
        if (!laboratory?.reservations) return false;
        
        const checkDate = new Date(dateString + 'T00:00:00');
        const checkDateStr = formatDate(checkDate);

        return laboratory.reservations.some(reservation => {
            if (reservation.status === 'CANCELLED' || reservation.status === 'COMPLETED') {
                return false;
            }
            
            const startDate = new Date(reservation.startDate);
            const endDate = new Date(reservation.endDate);
            const startDateStr = formatDate(startDate);
            const endDateStr = formatDate(endDate);

            // Verifica se a data está entre o início e fim da reserva
            return checkDateStr >= startDateStr && checkDateStr <= endDateStr;
        });
    };

    // Gera os dias marcados para o calendário
    const getMarkedDates = () => {
        const marked: any = {};

        // Marca dias ocupados
        if (laboratory?.reservations) {
            laboratory.reservations.forEach(reservation => {
                if (reservation.status === 'CANCELLED' || reservation.status === 'COMPLETED') {
                    return;
                }

                const startDate = new Date(reservation.startDate);
                const endDate = new Date(reservation.endDate);
                
                // Marca todos os dias da reserva
                let currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    const dateStr = formatDate(currentDate);
                    marked[dateStr] = {
                        marked: true,
                        selected: true,
                        selectedColor: '#EF4444',
                        disabled: true
                    };
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            });
        }

        // Marca a data selecionada pelo usuário
        if (selectedDate && !isDateOccupied(selectedDate)) {
            marked[selectedDate] = {
                ...marked[selectedDate],
                selected: true,
                selectedColor: '#16a34a',
                selectedTextColor: 'white'
            };
        }

        return marked;
    };

    const handleDayPress = (day: any) => {
        const dateString = day.dateString;
        const selectedDateObj = new Date(dateString + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Verifica se a data é no passado
        if (selectedDateObj < today) {
            Alert.alert('Data Inválida', 'Não é possível selecionar uma data no passado.');
            return;
        }

        // Verifica se o dia está ocupado
        if (isDateOccupied(dateString)) {
            const reservation = laboratory?.reservations.find(r => {
                const startDate = new Date(r.startDate);
                const endDate = new Date(r.endDate);
                const checkDate = new Date(dateString + 'T00:00:00');
                return checkDate >= startDate && checkDate <= endDate && 
                       r.status !== 'CANCELLED' && r.status !== 'COMPLETED';
            });
            
            const professorName = reservation?.professor?.name || 'outro professor';
            Alert.alert('Dia Ocupado', `Este dia já está reservado por ${professorName}.`);
            return;
        }

        setSelectedDate(dateString);
    };

    const handleConfirmarReserva = () => {
        if (!selectedDate) {
            Alert.alert('Atenção', 'Por favor, selecione uma data.');
            return;
        }

        const labId = Array.isArray(params.labId) ? params.labId[0] : params.labId;
        if (!labId) {
            Alert.alert('Erro', 'ID do laboratório não encontrado.');
            return;
        }

        const data = new Date(selectedDate + 'T00:00:00');
        const dataFormatada = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;

        router.push({
            pathname: '/dashboard-professor/confirmar-reserva',
            params: {
                laboratorio: laboratorio,
                labId: labId,
                data: dataFormatada,
                selectedDate: selectedDate
            }
        });
    };

    return (
        <View className='flex-1 bg-white'>
            {/* Header */}
            <View className='bg-white pt-12 pb-4 px-4 border-b border-gray-200'>
                <View className='flex-row items-center mb-3'>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className='mr-4'
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#15803d" />
                    </TouchableOpacity>

                    <View className='flex-1'>
                        <Text className='text-lg font-semibold text-gray-800'>
                            Reservar Laboratório
                        </Text>
                    </View>
                </View>

                {/* Info do laboratório */}
                <View className='bg-green-600 rounded-2xl p-3 flex-row items-center'>
                    <MaterialIcons name="computer" size={24} color="white" />
                    <Text className='text-white font-semibold ml-2'>
                        {laboratorio}
                    </Text>
                </View>
            </View>

            {/* Conteúdo */}
            <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 20 }}>
                <View className='px-4 pt-6'>
                    {loading ? (
                        <View className='flex-1 justify-center items-center py-20'>
                            <ActivityIndicator size="large" color="#15803d" />
                            <Text className='text-gray-600 mt-4'>Carregando informações...</Text>
                        </View>
                    ) : (
                        <>
                            {/* Calendário */}
                            <Calendar
                                current={currentDate}
                                onDayPress={handleDayPress}
                                markedDates={getMarkedDates()}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#6b7280',
                            selectedDayBackgroundColor: '#16a34a',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#16a34a',
                            dayTextColor: '#1f2937',
                            textDisabledColor: '#d1d5db',
                            dotColor: '#EF4444',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#16a34a',
                            monthTextColor: '#1f2937',
                            textDayFontWeight: '500',
                            textMonthFontWeight: '600',
                            textDayHeaderFontWeight: '600',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 12,
                        }}
                        style={{
                            borderRadius: 16,
                            elevation: 2,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            padding: 10,
                        }}
                                hideExtraDays={false}
                                enableSwipeMonths={true}
                                minDate={currentDate}
                            />

                    {/* Legenda */}
                    <View className='mt-6 bg-gray-50 rounded-2xl p-4'>
                        <Text className='text-gray-700 font-semibold mb-3'>
                            Legenda:
                        </Text>
                        <View className='space-y-2'>
                            <View className='flex-row items-center mb-2'>
                                <View className='w-8 h-8 bg-red-500 rounded-full' />
                                <Text className='text-gray-600 ml-3'>
                                    Dia ocupado (confirmado)
                                </Text>
                            </View>
                            <View className='flex-row items-center'>
                                <View className='w-8 h-8 bg-green-600 rounded-full' />
                                <Text className='text-gray-600 ml-3'>
                                    Dia selecionado
                                </Text>
                            </View>
                        </View>
                    </View>

                            {/* Botão Confirmar */}
                            <TouchableOpacity
                                className='bg-green-600 rounded-full py-4 mt-6'
                                onPress={handleConfirmarReserva}
                                activeOpacity={0.8}
                            >
                                <Text className='text-white text-center font-bold text-base'>
                                    Confirmar Reserva
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
