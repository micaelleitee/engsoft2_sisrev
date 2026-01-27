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

    
