import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignIn() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { userType } = useLocalSearchParams<{ userType: 'aluno' | 'professor' }>();

    const validateEmail = (email: string, type: 'aluno' | 'professor' | undefined): boolean => {
        if (!type) return true; // Se não houver tipo, não valida (compatibilidade)
        
        const emailLower = email.toLowerCase().trim();
        
        if (type === 'aluno') {
            return emailLower.endsWith('@aluno.ifce.edu.br');
        } else if (type === 'professor') {
            return emailLower.endsWith('@professor.ifce.edu.br');
        }
        
        return true;
    };

    const handleLogin = () => {
        // Validação do email baseado no tipo de usuário
        if (userType && !validateEmail(login, userType)) {
            const expectedSuffix = userType === 'aluno' 
                ? '@aluno.ifce.edu.br' 
                : '@professor.ifce.edu.br';
            Alert.alert(
                'Email inválido', 
                `O email deve terminar com ${expectedSuffix} para ${userType === 'aluno' ? 'alunos' : 'professores'}.`
            );
            return;
        }

        // Validação de login e senha (mantendo a lógica original)
        if (login.toLowerCase() === 'micael' && password === 'micael') {
            router.replace('/dashboard');
        } else {
            Alert.alert('Erro', 'Login ou senha inválidos.');
        }
    };

    return (
        <View className='flex-1 justify-center items-center'>
            {/* Logo */}
            <Image 
                source={require('../../src/img/LogoIF.png')} 
                className='w-24 h-24 mb-6'
                resizeMode='contain'
            />
            
            {/* Título SISREV */}
            <Text className='text-4xl font-black text-green-700 mb-12'>
                SISREV
            </Text>
            
            {/* Container do formulário */}
            <View className='w-full max-w-xs'>
                {/* Campo de Login */}
                <View className='mb-6'>
                    <Text className='text-green-700 font-semibold mb-3 text-base'>
                        {userType === 'aluno' ? 'Email (Aluno)' : userType === 'professor' ? 'Email (Professor)' : 'Login'}
                    </Text>
                    <TextInput
                        className= 'border border-black rounded-full  p-3 text-gray-800 text-base'
                        placeholder={userType === 'aluno' ? 'exemplo@aluno.ifce.edu.br' : userType === 'professor' ? 'exemplo@ifce.edu.br' : 'Digite seu login'}
                        placeholderTextColor='#1C5E27'
                        value={login}
                        onChangeText={setLogin}
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='email-address'
                    />
                    {userType && (
                        <Text className='text-xs text-gray-500 mt-1 ml-1'>
                            {userType === 'aluno' 
                                ? 'Use seu email institucional (@aluno.ifce.edu.br)'
                                : 'Use seu email institucional (@ifce.edu.br)'}
                        </Text>
                    )}
                </View>
                
                {/* Campo de Senha */}
                <View className='mb-8'>
                    <Text className='text-green-700 font-semibold mb-3 text-base'>
                        Senha
                    </Text>
                    <TextInput
                        className=' border-black border rounded-full p-3 text-gray-800 text-base'
                        placeholder='*******'
                        placeholderTextColor='#1C5E27'
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                </View>
                
                {/* Botão Entrar */}
                <TouchableOpacity
                    className='bg-green-700 rounded-full  py-4 mb-6'
                    onPress={handleLogin}
                    activeOpacity={0.8}
                >
                    <Text className='text-white text-center font-bold text-lg'>
                        Entrar
                    </Text>
                </TouchableOpacity>
                
                {/* Link Registrar-se */}
                <TouchableOpacity className='py-2' onPress={() => router.push('/login/sign-up')}>
                    <Text className='text-green-700 text-center font-semibold text-base'>
                        Registrar-se
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}