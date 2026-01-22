import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { ApiService } from '../../src/services/api';

interface Discipline {
    id: string;
    name: string;
    reservas: Reservation[];
}

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

export default function Dashboard() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedDisciplina, setExpandedDisciplina] = useState<string | null>(null);
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [loading, setLoading] = useState(true);

    // Carregar disciplinas e reservas do backend
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Buscar perfil do usuário para obter disciplinas
            const profile = await ApiService.getProfile();
            const userDisciplines = profile.disciplines || [];
            
            // Buscar todas as reservas confirmadas
            const reservations = await ApiService.getReservations();
            
            // Agrupar reservas por disciplina
            const disciplinesWithReservations: Discipline[] = userDisciplines.map((enrollment: any) => {
                const discipline = enrollment.discipline;
                const disciplineReservations = reservations
                    .filter((reservation: Reservation) => 
                        reservation.discipline?.id === discipline.id && 
                        reservation.status === 'CONFIRMED'
                    )
                    .map((reservation: Reservation) => {
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
                
                return {
                    id: discipline.id,
                    name: discipline.name,
                    reservas: disciplineReservations
                };
            });
            
            setDisciplines(disciplinesWithReservations);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            Alert.alert('Erro', 'Não foi possível carregar as disciplinas. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Filtrar disciplinas baseado na busca
    const filteredDisciplinas = useMemo(() => {
        if (!searchQuery.trim()) {
            return disciplines;
        }
        return disciplines.filter(disciplina =>
            disciplina.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [disciplines, searchQuery]);

    const handleDisciplinaPress = (disciplinaId: string) => {
        // Toggle do accordion
        if (expandedDisciplina === disciplinaId) {
            setExpandedDisciplina(null);
        } else {
            setExpandedDisciplina(disciplinaId);
        }
    };

    // Verifica se um dia está reservado para uma disciplina
    const isDiaReservado = (reservas: Reservation[], dia: number) => {
        return reservas.some(r => r.dia === dia);
    };

    // Pega informações da reserva de um dia específico
    const getReservaInfo = (reservas: Reservation[], dia: number) => {
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
                {loading ? (
                    <View className='flex-1 justify-center items-center py-20'>
                        <ActivityIndicator size="large" color="#15803d" />
                        <Text className='text-gray-600 mt-4'>Carregando disciplinas...</Text>
                    </View>
                ) : filteredDisciplinas.length === 0 ? (
                    <View className='flex-1 justify-center items-center py-20'>
                        <MaterialIcons name="computer" size={64} color="#9CA3AF" />
                        <Text className='text-gray-600 mt-4 text-center'>
                            {searchQuery ? 'Nenhuma disciplina encontrada' : 'Você ainda não possui disciplinas cadastradas'}
                        </Text>
                    </View>
                ) : (
                    filteredDisciplinas.map((disciplina) => {
                        const isExpanded = expandedDisciplina === disciplina.id;
                        const hasReservas = disciplina.reservas.length > 0;

                        // Obter dias únicos das reservas para o calendário
                        const diasComReservas = [...new Set(disciplina.reservas.map(r => r.dia).filter(d => d !== undefined))] as number[];
                        const diasSemana = diasComReservas.length > 0 
                            ? diasComReservas.sort((a, b) => a - b)
                            : [];

                        return (
                            <View key={disciplina.id} className='mb-3'>
                                {/* Header do Accordion */}
                                <TouchableOpacity
                                    className={`bg-green-600 p-4 flex-row items-center ${
                                        isExpanded ? 'rounded-t-3xl' : 'rounded-full'
                                    }`}
                                    onPress={() => handleDisciplinaPress(disciplina.id)}
                                    activeOpacity={0.8}
                                >
                                    {/* Ícone de Computador */}
                                    <MaterialIcons name="computer" size={28} color="#E8F5E9" />

                                    {/* Nome da Disciplina */}
                                    <Text className='flex-1 text-green-50 font-semibold text-base ml-4'>
                                        {disciplina.name}
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
                                                {diasSemana.length > 0 && (
                                                    <View className='flex-row justify-around items-start mb-4 mt-2'>
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
                                                                                {getReservaInfo(disciplina.reservas, dia)?.laboratorio?.replace('Laboratório ', 'Lab ') || 'Lab'}
                                                                            </Text>
                                                                        </View>
                                                                    )}
                                                                </View>
                                                            );
                                                        })}
                                                    </View>
                                                )}

                                                {/* Botão Ver mais */}
                                                <TouchableOpacity
                                                    className='bg-white rounded-full py-2 items-center'
                                                    activeOpacity={0.8}
                                                    onPress={() => router.push({
                                                        pathname: '/dashboard-aluno/disciplina-detalhes',
                                                        params: { 
                                                            disciplina: disciplina.name,
                                                            disciplinaId: disciplina.id
                                                        }
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
                    })
                )}
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
