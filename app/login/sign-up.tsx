import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { ApiService } from '../../src/services/api';

interface Discipline {
    id: string;
    name: string;
    code?: string;
    description?: string;
}

export default function SignUp() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [isDisciplineModalVisible, setIsDisciplineModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingDisciplines, setLoadingDisciplines] = useState(false);
    const router = useRouter();
    const { register } = useAuth();
    const params = useLocalSearchParams<{ userType: 'aluno' | 'professor' }>();
    
    
