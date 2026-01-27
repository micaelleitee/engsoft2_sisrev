import { AntDesign, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleDadosPerfil = () => {
        router.push('/dashboard-aluno/profile/dados-perfil');
    };

    const handleNotificacao = () => {
        router.push('/dashboard-aluno/profile/notificacao');
    };

    const handleSuporte = () => {
        router.push('/dashboard-aluno/profile/suporte');
    };

    const handleSairClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        
