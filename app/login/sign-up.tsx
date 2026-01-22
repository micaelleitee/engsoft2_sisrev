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
    
    // Normaliza userType para garantir que seja uma string (não array)
    const userType = Array.isArray(params.userType) ? params.userType[0] : params.userType;

    // Carregar disciplinas do backend quando for aluno
    useEffect(() => {
        if (userType === 'aluno') {
            loadDisciplines();
        }
    }, [userType]);

    const loadDisciplines = async () => {
        try {
            setLoadingDisciplines(true);
            const data = await ApiService.getDisciplines();
            setDisciplines(data);
            if (data.length > 0) {
                setSelectedDiscipline(data[0]);
            }
        } catch (error) {
            console.error('Erro ao carregar disciplinas:', error);
            Alert.alert('Erro', 'Não foi possível carregar as disciplinas. Tente novamente.');
        } finally {
            setLoadingDisciplines(false);
        }
    };

    // Validação de email baseado no tipo de usuário
    const validateEmail = (email: string, type: 'aluno' | 'professor' | undefined): boolean => {
        if (!type) return true; // Se não houver tipo, não valida (compatibilidade)
        
        const emailLower = email.toLowerCase().trim();
        
        if (type === 'aluno') {
            return emailLower.endsWith('@aluno.ifce.edu.br');
        } else if (type === 'professor') {
            // Para professor, deve terminar com @ifce.edu.br mas NÃO com @aluno.ifce.edu.br
            return emailLower.endsWith('@ifce.edu.br') && !emailLower.endsWith('@aluno.ifce.edu.br');
        }
        
        return true;
    };

    const handleSignUp = async () => {
        if (!password || !confirmPassword || !name || !email) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        const emailLower = email.toLowerCase().trim();
        
        // Validação do email baseado no tipo de usuário
        if (userType && !validateEmail(emailLower, userType)) {
            const expectedSuffix = userType === 'aluno' 
                ? '@aluno.ifce.edu.br' 
                : '@ifce.edu.br';
            Alert.alert(
                'Email inválido', 
                `O email deve terminar com ${expectedSuffix} para ${userType === 'aluno' ? 'alunos' : 'professores'}.`
            );
            return;
        }
        
        // Determina o role baseado no userType ou no email (se userType não estiver disponível)
        let role: 'ALUNO' | 'PROFESSOR' | undefined;
        if (userType) {
            // Se userType foi fornecido, usa ele
            role = userType === 'aluno' ? 'ALUNO' : 'PROFESSOR';
        } else {
            // Fallback: determina pelo email (verificar primeiro o mais específico)
            if (emailLower.endsWith('@aluno.ifce.edu.br')) {
                role = 'ALUNO';
            } else if (emailLower.endsWith('@ifce.edu.br') && !emailLower.endsWith('@aluno.ifce.edu.br')) {
                role = 'PROFESSOR';
            } else {
                Alert.alert('Erro', 'Email deve terminar com @aluno.ifce.edu.br ou @ifce.edu.br');
                return;
            }
        }

        // Validação: se for aluno, deve ter selecionado uma disciplina
        if (userType === 'aluno' && !selectedDiscipline) {
            Alert.alert('Erro', 'Por favor, selecione uma disciplina.');
            return;
        }

        setLoading(true);
        try {
            // Prepara dados do registro
            const registerData: any = {
                email: emailLower,
                password,
                name,
                role
            };

            // Adiciona disciplineId se for aluno e tiver disciplina selecionada
            if (userType === 'aluno' && selectedDiscipline) {
                registerData.disciplineId = selectedDiscipline.id;
            }

            const response = await register(registerData.email, registerData.password, registerData.name, registerData.role, registerData.disciplineId);
            
            // Redireciona para o dashboard correto baseado no role do usuário criado
            if (response?.user?.role === 'ALUNO') {
                router.replace('/dashboard-aluno');
            } else if (response?.user?.role === 'PROFESSOR') {
                router.replace('/dashboard-professor');
            } else {
                // Fallback: redireciona baseado no userType ou vai para login
                if (userType === 'aluno') {
                    router.replace('/dashboard-aluno');
                } else if (userType === 'professor') {
                    router.replace('/dashboard-professor');
                } else {
                    router.replace('/login/sign-in');
                }
            }
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Erro ao realizar cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView 
            className='flex-1 bg-white'
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}
        >
            {/* Logo */}
            <Image 
                source={require('../../src/img/LogoIF.png')} 
                className='w-24 h-24 mb-6'
                resizeMode='contain'
            />
            
            {/* Título SISREV */}
            <Text className='text-4xl font-black text-green-700 mb-8'>
                SISREV
            </Text>
            
            {/* Container do formulário */}
            <View className='w-full max-w-xs'>
                {/* Campo de Senha */}
                <View className='mb-4'>
                    <Text className='text-green-700 font-semibold mb-2 text-base'>
                        Digite uma senha:
                    </Text>
                    <TextInput
                        className='border border-green-700 rounded-full px-4 py-3 text-gray-800 text-base'
                        placeholder='*********'
                        placeholderTextColor='#1C5E27'
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                </View>
                
                {/* Campo de Confirmar Senha */}
                <View className='mb-4'>
                    <Text className='text-green-700 font-semibold mb-2 text-base'>
                        Digite a senha novamente:
                    </Text>
                    <TextInput
                        className='border border-green-700 rounded-full px-4 py-3 text-gray-800 text-base'
                        placeholder='*********'
                        placeholderTextColor='#1C5E27'
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                </View>
                
                {/* Campo de Nome */}
                <View className='mb-4'>
                    <Text className='text-green-700 font-semibold mb-2 text-base'>
                        Digite seu nome:
                    </Text>
                    <TextInput
                        className='border border-green-700 rounded-full px-4 py-3 text-gray-800 text-base'
                        placeholder='Digite seu nome'
                        placeholderTextColor='#1C5E27'
                        value={name}
                        onChangeText={setName}
                        autoCapitalize='words'
                    />
                </View>
                
                {/* Campo de Email */}
                <View className='mb-4'>
                    <Text className='text-green-700 font-semibold mb-2 text-base'>
                        {userType === 'aluno' ? 'Email (Aluno)' : userType === 'professor' ? 'Email (Professor)' : 'Email'}
                    </Text>
                    <TextInput
                        className='border border-green-700 rounded-full px-4 py-3 text-gray-800 text-base'
                        placeholder={userType === 'aluno' ? 'exemplo@aluno.ifce.edu.br' : userType === 'professor' ? 'exemplo@ifce.edu.br' : 'Digite seu email'}
                        placeholderTextColor='#1C5E27'
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                    {userType && (
                        <Text className='text-xs text-gray-500 mt-1 ml-1'>
                            {userType === 'aluno' 
                                ? 'Use seu email institucional (@aluno.ifce.edu.br)'
                                : 'Use seu email institucional (@ifce.edu.br)'}
                        </Text>
                    )}
                </View>
                
                {/* Campo de Disciplina - Apenas para alunos */}
                {userType === 'aluno' && (
                    <View className='mb-6'>
                        <Text className='text-green-700 font-semibold mb-2 text-base'>
                            Escolha sua disciplina:
                        </Text>
                        {loadingDisciplines ? (
                            <View className='border border-green-700 rounded-full px-4 py-3 flex-row justify-center items-center'>
                                <ActivityIndicator size="small" color="#1C5E27" />
                                <Text className='text-gray-600 text-base ml-2'>Carregando disciplinas...</Text>
                            </View>
                        ) : (
                            <TouchableOpacity 
                                className='border border-green-700 rounded-full px-4 py-3 flex-row justify-between items-center'
                                onPress={() => setIsDisciplineModalVisible(true)}
                                activeOpacity={0.7}
                                disabled={disciplines.length === 0}
                            >
                                <Text className='text-gray-800 text-base flex-1'>
                                    {selectedDiscipline ? selectedDiscipline.name : 'Nenhuma disciplina disponível'}
                                </Text>
                                <Text className='text-green-700 text-lg'>▼</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Modal de Seleção de Disciplina */}
                <Modal
                    visible={isDisciplineModalVisible}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => setIsDisciplineModalVisible(false)}
                >
                    <TouchableOpacity 
                        className='flex-1 bg-black/50 justify-center items-center'
                        activeOpacity={1}
                        onPress={() => setIsDisciplineModalVisible(false)}
                    >
                        <View className='bg-white rounded-lg w-4/5 max-h-96'>
                            <View className='border-b border-gray-200 p-4'>
                                <Text className='text-green-700 font-bold text-lg text-center'>
                                    Selecione uma Disciplina
                                </Text>
                            </View>
                            <ScrollView className='max-h-80'>
                                {disciplines.length === 0 ? (
                                    <View className='p-4'>
                                        <Text className='text-gray-600 text-center'>
                                            Nenhuma disciplina disponível
                                        </Text>
                                    </View>
                                ) : (
                                    disciplines.map((item) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            className={`border-b border-gray-100 p-4 ${
                                                selectedDiscipline?.id === item.id ? 'bg-green-50' : ''
                                            }`}
                                            onPress={() => {
                                                setSelectedDiscipline(item);
                                                setIsDisciplineModalVisible(false);
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Text className={`text-base ${
                                                selectedDiscipline?.id === item.id ? 'text-green-700 font-semibold' : 'text-gray-800'
                                            }`}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </Modal>
                
                {/* Botão Cadastrar */}
                <TouchableOpacity
                    className='bg-green-700 rounded-full py-4 mb-6'
                    onPress={handleSignUp}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className='text-white text-center font-bold text-lg'>
                            Cadastrar
                        </Text>
                    )}
                </TouchableOpacity>
                
                {/* Link Voltar ao Login */}
                <TouchableOpacity className='py-2' onPress={() => {
                    if (userType) {
                        router.replace({
                            pathname: '/login/sign-in',
                            params: { userType }
                        });
                    } else {
                        router.replace('/login/sign-in');
                    }
                }}>
                    <Text className='text-green-700 text-center font-semibold text-base'>
                        Já tem uma conta? Entrar
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
