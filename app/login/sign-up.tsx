import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock de disciplinas - posteriormente virá do copo de dados
const DISCIPLINES = [
    'Engenharia de Software 2',
    'Engenharia de Software 1',
    'Banco de Dados',
    'Estruturas de Dados',
    'Programação Orientada a Objetos',
    'Redes de Computadores',
    'Segurança da Informação',
    'Desenvolvimento Mobile',
    'Inteligência Artificial',
    'Gestão de Projetos'
];

export default function SignUp() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [discipline, setDiscipline] = useState('Engenharia de Software 2');
    const [isDisciplineModalVisible, setIsDisciplineModalVisible] = useState(false);
    const router = useRouter();

    const handleSignUp = () => {
        if (!login || !password || !confirmPassword || !name || !email) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        if (!email.includes('@')) {
            Alert.alert('Erro', 'Email inválido.');
            return;
        }

        // Aqui você pode adicionar a lógica para cadastrar o usuário
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        router.replace('/login/sign-in');
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
            <Text className='text-3xl font-bold text-green-700 mb-8'>
                SISREV
            </Text>
            
            {/* Container do formulário */}
            <View className='w-full max-w-xs'>
                {/* Campo de Login */}
                <View className='mb-4'>
                    <Text className='text-green-700 font-semibold mb-2 text-base'>
                        Digite um login:
                    </Text>
                    <TextInput
                        className='border border-green-700 rounded-full px-4 py-3 text-gray-800 text-base'
                        placeholder='Digite um login'
                        placeholderTextColor='#1C5E27'
                        value={login}
                        onChangeText={setLogin}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                </View>
                
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
                        Email:
                    </Text>
                    <TextInput
                        className='border border-green-700 rounded-full px-4 py-3 text-gray-800 text-base'
                        placeholder='Digite seu email'
                        placeholderTextColor='#1C5E27'
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                </View>
                
                {/* Campo de Disciplina */}
                <View className='mb-6'>
                    <Text className='text-green-700 font-semibold mb-2 text-base'>
                        Escolha sua disciplina:
                    </Text>
                    <TouchableOpacity 
                        className='border border-green-700 rounded-full px-4 py-3 flex-row justify-between items-center'
                        onPress={() => setIsDisciplineModalVisible(true)}
                        activeOpacity={0.7}
                    >
                        <Text className='text-gray-800 text-base flex-1'>
                            {discipline}
                        </Text>
                        <Text className='text-green-700 text-lg'>▼</Text>
                    </TouchableOpacity>
                </View>

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
                                {DISCIPLINES.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        className={`border-b border-gray-100 p-4 ${
                                            item === discipline ? 'bg-green-50' : ''
                                        }`}
                                        onPress={() => {
                                            setDiscipline(item);
                                            setIsDisciplineModalVisible(false);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Text className={`text-base ${
                                            item === discipline ? 'text-green-700 font-semibold' : 'text-gray-800'
                                        }`}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </Modal>
                
                {/* Botão Cadastrar */}
                <TouchableOpacity
                    className='bg-green-700 rounded-full py-4 mb-6'
                    onPress={handleSignUp}
                    activeOpacity={0.8}
                >
                    <Text className='text-white text-center font-bold text-lg'>
                        Cadastrar
                    </Text>
                </TouchableOpacity>
                
                {/* Link Voltar ao Login */}
                <TouchableOpacity className='py-2' onPress={() => router.replace('/login/sign-in')}>
                    <Text className='text-green-700 text-center font-semibold text-base'>
                        Já tem uma conta? Entrar
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
