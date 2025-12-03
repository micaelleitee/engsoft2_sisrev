import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

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

export default function ReservarLaboratorio() {
    const router = useRouter();
    const params = useLocalSearchParams<{ laboratorio: string; labId: string }>();
    const laboratorio = Array.isArray(params.laboratorio) ? params.laboratorio[0] : params.laboratorio;

    const [selectedDate, setSelectedDate] = useState('');

    // Mock de dias ocupados (formato YYYY-MM-DD)
    const diasOcupados = {
        '2025-08-18': { selected: true, marked: true, selectedColor: '#EF4444' },
        '2025-08-20': { selected: true, marked: true, selectedColor: '#EF4444' },
    };

    // Dias com reserva pendente (borda pontilhada)
    const diasPendentes = {
        '2025-08-19': { marked: true, dotColor: '#EF4444', marked: true },
    };

    // Combina os dias marcados
    const markedDates = {
        ...diasOcupados,
        ...diasPendentes,
        ...(selectedDate && !diasOcupados[selectedDate] ? {
            [selectedDate]: {
                selected: true,
                selectedColor: '#16a34a',
                selectedTextColor: 'white'
            }
        } : {})
    };

    const handleDayPress = (day: any) => {
        const dateString = day.dateString;

        // Verifica se o dia está ocupado
        if (diasOcupados[dateString]) {
            Alert.alert('Dia Ocupado', 'Este dia já está reservado por outro professor.');
            return;
        }

        setSelectedDate(dateString);
    };

    const handleConfirmarReserva = () => {
        if (!selectedDate) {
            Alert.alert('Atenção', 'Por favor, selecione uma data.');
            return;
        }

        const data = new Date(selectedDate + 'T00:00:00');
        const dataFormatada = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;

        router.push({
            pathname: '/dashboard-professor/confirmar-reserva',
            params: {
                laboratorio: laboratorio,
                data: dataFormatada
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
                    {/* Calendário */}
                    <Calendar
                        current={'2025-08-01'}
                        onDayPress={handleDayPress}
                        markedDates={markedDates}
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
                                    Dia ocupado
                                </Text>
                            </View>
                            <View className='flex-row items-center mb-2'>
                                <View className='w-8 h-8 rounded-full items-center justify-center'>
                                    <View className='w-2 h-2 bg-red-500 rounded-full' />
                                </View>
                                <Text className='text-gray-600 ml-3'>
                                    Reserva pendente
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
                </View>
            </ScrollView>
        </View>
    );
}
