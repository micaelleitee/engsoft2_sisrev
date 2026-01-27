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
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
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

    
