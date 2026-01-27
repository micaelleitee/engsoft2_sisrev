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

    
