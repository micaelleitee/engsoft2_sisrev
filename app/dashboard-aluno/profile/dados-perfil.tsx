import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    ScrollView, Text, TextInput, TouchableOpacity, View, Modal,
    FlatList, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { useDisciplineFilter } from '../../../src/contexts/DisciplineFilterContext';
import { ApiService } from '../../../src/services/api';

interface Discipline {
    id: string;
    name: string;
}

export default function DadosPerfil() {
    const router = useRouter();
    const { selectedDisciplines, toggleDiscipline } = useDisciplineFilter();

    const [login, setLogin] = useState('Micael.leite60@aluno.ifce.edu.br');
    const [senha, setSenha] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const [allDisciplines, setAllDisciplines] = useState<Discipline[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loadingDisciplines, setLoadingDisciplines] = useState(true);
    const [disciplineError, setDisciplineError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDisciplines = async () => {
            try {
                setLoadingDisciplines(true);
                const data = await ApiService.getDisciplines();
                setAllDisciplines(data);
                setDisciplineError(null);
            } catch (err: any) {
                const errorMessage = err.error || 'Falha ao carregar disciplinas.';
                setDisciplineError(errorMessage);
                console.error(err);
                Alert.alert('Erro', errorMessage);
            } finally {
                setLoadingDisciplines(false);
            }
        };
        fetchDisciplines();
    }, []);

    const handleSave = () => {
        console.log('Dados do perfil salvos');
        Alert.alert('Sucesso', 'Dados do perfil atualizados (funcionalidade completa a ser implementada).');
    };

    const handleCancel = () => {
        router.back();
    };

    const renderSelectedDisciplinesText = () => {
        if (selectedDisciplines.length === 0) {
            return 'Selecione uma ou mais disciplinas';
        }
        if (selectedDisciplines.length === 1) {
            return selectedDisciplines[0].name;
        }
        return `${selectedDisciplines.length} disciplinas selecionadas`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={handleCancel} style={styles.backButton} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={24} color="#15803d" />
                    </TouchableOpacity>
                    <View style={styles.userIcon}>
                        <AntDesign name="user" size={20} color="white" />
                    </View>
                    <Text style={styles.headerTitle}>Dados do perfil</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Digite um login:</Text>
                    <TextInput style={styles.textInput} value={login} onChangeText={setLogin} placeholder="Digite seu login" placeholderTextColor="#9CA3AF" />
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Digite uma senha:</Text>
                    <TextInput style={styles.textInput} value={senha} onChangeText={setSenha} placeholder="* * * * * * * * *" placeholderTextColor="#9CA3AF" secureTextEntry />
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Digite a senha novamente:</Text>
                    <TextInput style={styles.textInput} value={novaSenha} onChangeText={setNovaSenha} placeholder="* * * * * * * * *" placeholderTextColor="#9CA3AF" secureTextEntry />
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Digite seu nome:</Text>
                    <TextInput style={styles.textInput} value={nome} onChangeText={setNome} placeholder="Digite seu nome" placeholderTextColor="#9CA3AF" />
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Email:</Text>
                    <TextInput style={styles.textInput} value={email} onChangeText={setEmail} placeholder="Digite seu email" placeholderTextColor="#9CA3AF" keyboardType="email-address" />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Escolha suas disciplinas:</Text>
                    <TouchableOpacity style={styles.disciplineSelector} onPress={() => setIsModalVisible(true)} activeOpacity={0.7}>
                        <Text style={styles.disciplineText} numberOfLines={1}>
                            {renderSelectedDisciplinesText()}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#4B5563" />
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Alterar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal transparent={true} visible={isModalVisible} animationType="fade" onRequestClose={() => setIsModalVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsModalVisible(false)} activeOpacity={1}>
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <Text style={styles.modalTitle}>Selecione as Disciplinas</Text>
                        {loadingDisciplines ? (
                            <ActivityIndicator size="small" color="#15803d" />
                        ) : disciplineError ? (
                            <Text style={{ color: 'red', textAlign: 'center' }}>{disciplineError}</Text>
                        ) : (
                            <FlatList
                                data={allDisciplines}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => {
                                    const isSelected = selectedDisciplines.some(d => d.id === item.id);
                                    return (
                                        <TouchableOpacity style={styles.modalItem} onPress={() => toggleDiscipline(item)}>
                                            <Ionicons name={isSelected ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={isSelected ? '#15803d' : '#4B5563'} />
                                            <Text style={styles.modalItemText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        )}
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsModalVisible(false)}>
                            <Text style={styles.modalCloseButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: { backgroundColor: 'white', paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerContent: { flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 16 },
    userIcon: { width: 40, height: 40, backgroundColor: '#15803d', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
    scrollView: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
    scrollContent: { paddingBottom: 120 },
    fieldContainer: { marginBottom: 24 },
    fieldLabel: { color: '#15803d', fontWeight: '600', marginBottom: 8 },
    textInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 12, color: '#374151' },
    disciplineSelector: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    disciplineText: { color: '#374151', flex: 1, marginRight: 8 },
    buttonGroup: { flexDirection: 'row', gap: 12 },
    saveButton: { flex: 1, backgroundColor: '#16A34A', borderRadius: 9999, paddingVertical: 12, justifyContent: 'center', alignItems: 'center' },
    cancelButton: { flex: 1, backgroundColor: '#EF4444', borderRadius: 9999, paddingVertical: 12, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: 'white', borderRadius: 8, padding: 16, width: '90%', maxHeight: '70%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    modalItemText: { fontSize: 16, color: '#333', marginLeft: 12, flex: 1 },
    modalCloseButton: { backgroundColor: '#15803d', borderRadius: 9999, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
    modalCloseButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
