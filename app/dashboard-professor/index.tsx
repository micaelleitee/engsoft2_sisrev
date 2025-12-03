import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock de laboratórios com disponibilidade - posteriormente virá do banco de dados
const LABORATORIES = [
    {
        id: 1,
        name: 'Laboratório 01',
        reservas: [
            { dia: 19, ocupado: true, professor: 'Prof. João Silva' },
            { dia: 21, ocupado: true, professor: 'Prof. Maria Santos' },
        ]
    },
    {
        id: 2,
        name: 'Laboratório 02',
        reservas: [
            { dia: 18, ocupado: true, professor: 'Prof. Carlos Souza' },
        ]
    },
    {
        id: 3,
        name: 'Laboratório 03',
        reservas: [
            { dia: 22, ocupado: true, professor: 'Prof. Ana Costa' },
        ]
    },
    {
        id: 4,
        name: 'Laboratório 04',
        reservas: [
            { dia: 18, ocupado: true, professor: 'Prof. Pedro Lima' },
        ]
    },
    {
        id: 5,
        name: 'Laboratório 05',
        reservas: []
    },
];

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedLaboratory, setExpandedLaboratory] = useState<number | null>(null);

    const handleLaboratoryPress = (labId: number) => {
        // Toggle do accordion
        if (expandedLaboratory === labId) {
            setExpandedLaboratory(null);
        } else {
            setExpandedLaboratory(labId);
        }
    };

    // Dias da semana para o calendário
    const diasSemana = [18, 19, 20, 21, 22];

    // Verifica se um dia está ocupado para um laboratório
    const isDiaOcupado = (reservas: any[], dia: number) => {
        return reservas.some(r => r.dia === dia && r.ocupado);
    };

    // Pega informações da reserva de um dia específico
    const getReservaInfo = (reservas: any[], dia: number) => {
        return reservas.find(r => r.dia === dia);
    };

    // Função para fazer a reserva
    const handleReservarDia = (labName: string, dia: number) => {
        Alert.alert(
            'Confirmar Reserva',
            `Deseja reservar o ${labName} para o dia ${dia}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        // Aqui você adicionaria a lógica para salvar a reserva
                        Alert.alert('Sucesso', `${labName} reservado para o dia ${dia}!`);
                        setExpandedLaboratory(null);
                    }
                }
            ]
        );
    };

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
                            source={require('../../src/img/LogoIF.png')}
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
                        placeholder='Buscar...'
                        placeholderTextColor='#9CA3AF'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons name="search" size={20} color="#8B4513" />
                </View>
            </View>

            {/* Conteúdo Principal - Lista de Laboratórios com Accordion */}
            <ScrollView className='flex-1 px-4' contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}>
                <Text className='text-xl font-bold text-green-700 mb-4'>
                    Laboratórios
                </Text>

                {LABORATORIES.map((lab) => {
                    const isExpanded = expandedLaboratory === lab.id;

                    return (
                        <View key={lab.id} className='mb-3'>
                            {/* Header do Accordion */}
                            <TouchableOpacity
                                className={`bg-green-600 p-4 flex-row items-center ${
                                    isExpanded ? 'rounded-t-3xl' : 'rounded-full'
                                }`}
                                onPress={() => handleLaboratoryPress(lab.id)}
                                activeOpacity={0.8}
                            >
                                {/* Ícone de Computador */}
                                <MaterialIcons name="computer" size={32} color="#B8E6B8" />

                                {/* Nome do Laboratório */}
                                <Text className='flex-1 text-green-50 font-semibold text-base ml-4'>
                                    {lab.name}
                                </Text>

                                {/* Botão de Seta */}
                                <View className='w-8 h-8 bg-white rounded-full justify-center items-center'>
                                    <Ionicons
                                        name={isExpanded ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color="#15803d"
                                    />
                                </View>
                            </TouchableOpacity>

                            {/* Conteúdo Expandido do Accordion */}
                            {isExpanded && (
                                <View className='bg-green-600 rounded-b-3xl px-4 pb-4'>
                                    {/* Calendário da semana */}
                                    <View className='flex-row justify-around items-start mb-4 mt-2'>
                                        {diasSemana.map((dia) => {
                                            const isOcupado = isDiaOcupado(lab.reservas, dia);
                                            const reservaInfo = getReservaInfo(lab.reservas, dia);

                                            return (
                                                <View key={dia} className='items-center'>
                                                    <TouchableOpacity
                                                        className='items-center'
                                                        onPress={() => {
                                                            if (!isOcupado) {
                                                                handleReservarDia(lab.name, dia);
                                                            } else {
                                                                Alert.alert(
                                                                    'Dia Ocupado',
                                                                    `Este dia já está reservado por ${reservaInfo?.professor}`
                                                                );
                                                            }
                                                        }}
                                                        activeOpacity={0.7}
                                                    >
                                                        <View
                                                            className={`w-12 h-12 rounded-full justify-center items-center ${
                                                                isOcupado ? 'bg-red-500' : 'bg-gray-300'
                                                            }`}
                                                        >
                                                            <Text className='text-white font-bold text-base'>
                                                                {dia}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    {isOcupado && (
                                                        <View className='mt-1 bg-white px-2 py-0.5 rounded'>
                                                            <Text className='text-green-700 text-xs font-semibold'>
                                                                Ocupado
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>

                                    {/* Botão Ver mais */}
                                    <TouchableOpacity
                                        className='bg-white rounded-full py-2 items-center'
                                        activeOpacity={0.8}
                                    >
                                        <Text className='text-green-700 font-semibold'>
                                            Ver mais
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}
