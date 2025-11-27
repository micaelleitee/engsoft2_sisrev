import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock de disciplinas com reservas - posteriormente virá do banco de dados
const DISCIPLINAS = [
    {
        nome: 'Engenharia de Software',
        reservas: [
            { dia: 18, laboratorio: 'Laboratório 02', data: '18/07/2025', horario: '20:20 - 22:00' },
            { dia: 20, laboratorio: 'Laboratório 01', data: '20/07/2025', horario: '18:30 - 20:00' },
            { dia: 22, laboratorio: 'Laboratório 03', data: '22/07/2025', horario: '19:00 - 21:00' },
        ]
    },
    {
        nome: 'Banco de Dados I',
        reservas: [
            { dia: 19, laboratorio: 'Laboratório 01', data: '19/07/2025', horario: '14:00 - 16:00' },
            { dia: 21, laboratorio: 'Laboratório 02', data: '21/07/2025', horario: '16:00 - 18:00' },
        ]
    },
    {
        nome: 'Algoritmos e Programação I',
        reservas: []
    },
    {
        nome: 'Redes de Computadores I',
        reservas: [
            { dia: 18, laboratorio: 'Laboratório 04', data: '18/07/2025', horario: '08:00 - 10:00' },
        ]
    },
];

export default function Dashboard() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedDisciplina, setExpandedDisciplina] = useState<string | null>(null);

    // Filtrar disciplinas baseado na busca
    const filteredDisciplinas = useMemo(() => {
        if (!searchQuery.trim()) {
            return DISCIPLINAS;
        }
        return DISCIPLINAS.filter(disciplina =>
            disciplina.nome.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleDisciplinaPress = (nomeDisciplina: string) => {
        // Toggle do accordion
        if (expandedDisciplina === nomeDisciplina) {
            setExpandedDisciplina(null);
        } else {
            setExpandedDisciplina(nomeDisciplina);
        }
    };

    // Dias da semana para o calendário
    const diasSemana = [18, 19, 20, 21, 22];

    // Verifica se um dia está reservado para uma disciplina
    const isDiaReservado = (reservas: any[], dia: number) => {
        return reservas.some(r => r.dia === dia);
    };

    // Pega informações da reserva de um dia específico
    const getReservaInfo = (reservas: any[], dia: number) => {
        return reservas.find(r => r.dia === dia);
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
                <View className='bg-white border border-gray-400 rounded-full px-4 flex-row items-center h-12'>
                    <TextInput
                        className='flex-1 text-gray-800 text-base h-10'
                        placeholder='Buscar...'
                        placeholderTextColor='#9CA3AF'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons name="search" size={20} color="#4B5563" />
                </View>
            </View>

            {/* Conteúdo Principal - Lista de Disciplinas com Accordion */}
            <ScrollView className='flex-1 px-4' contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}>
                {filteredDisciplinas.map((disciplina, index) => {
                    const isExpanded = expandedDisciplina === disciplina.nome;
                    const hasReservas = disciplina.reservas.length > 0;

                    return (
                        <View key={index} className='mb-3'>
                            {/* Header do Accordion */}
                            <TouchableOpacity
                                className={`bg-green-600 p-4 flex-row items-center ${
                                    isExpanded ? 'rounded-t-3xl' : 'rounded-full'
                                }`}
                                onPress={() => handleDisciplinaPress(disciplina.nome)}
                                activeOpacity={0.8}
                            >
                                {/* Ícone de Computador */}
                                <MaterialIcons name="computer" size={28} color="#E8F5E9" />

                                {/* Nome da Disciplina */}
                                <Text className='flex-1 text-green-50 font-semibold text-base ml-4'>
                                    {disciplina.nome}
                                </Text>

                                {/* Botão de Seta */}
                                <View className='w-8 h-8 bg-white rounded-full justify-center items-center'>
                                    <Ionicons
                                        name={isExpanded ? "chevron-up" : "chevron-down"}
                                        size={18}
                                        color="#15803d"
                                    />
                                </View>
                            </TouchableOpacity>

                            {/* Conteúdo Expandido do Accordion */}
                            {isExpanded && (
                                <View className='bg-green-600 rounded-b-3xl px-4 pb-4'>
                                    {hasReservas ? (
                                        <>
                                            {/* Calendário da semana */}
                                            <View className='flex-row justify-around items-center mb-4 mt-2'>
                                                {diasSemana.map((dia) => {
                                                    const isReservado = isDiaReservado(disciplina.reservas, dia);
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
                                                                        {getReservaInfo(disciplina.reservas, dia)?.laboratorio.replace('Laboratório ', 'Lab ')}
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
                                                onPress={() => router.push({
                                                    pathname: '/dashboard-aluno/disciplina-detalhes',
                                                    params: { disciplina: disciplina.nome }
                                                })}
                                            >
                                                <Text className='text-green-700 font-semibold'>
                                                    Ver mais
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <View className='bg-white rounded-2xl p-4 mt-2'>
                                            <Text className='text-gray-600 text-center'>
                                                Nenhuma reserva de laboratório para esta disciplina
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {/* Gradiente na parte inferior alinhado com o navigation bar */}
            <LinearGradient
                colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)']}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 88,
                    pointerEvents: 'none',
                }}
            />
        </View>
    );
}
