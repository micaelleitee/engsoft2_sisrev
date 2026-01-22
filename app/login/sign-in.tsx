import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function SignIn() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login: authLogin } = useAuth();
    const params = useLocalSearchParams<{ userType: 'aluno' | 'professor' }>();
    
    // Normaliza userType para garantir que seja uma string (não array)
    const userType = Array.isArray(params.userType) ? params.userType[0] : params.userType;

    const validateEmail = (email: string, type: 'aluno' | 'professor' | undefined): boolean => {
        if (!type) return true; // Se não houver tipo, não valida (compatibilidade)
        
        const emailLower = email.toLowerCase().trim();
        
        if (type === 'aluno') {
            return emailLower.endsWith('@aluno.ifce.edu.br');
        } else if (type === 'professor') {
            return emailLower.endsWith('@ifce.edu.br');
        }
        
        return true;
    };

    const handleLogin = async () => {
        const loginNormalized = login.toLowerCase().trim();
        const passwordNormalized = password.trim();
        
        // Validação básica
        if (!loginNormalized || !passwordNormalized) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        
        // Validação do email baseado no tipo de usuário
        if (userType && !validateEmail(loginNormalized, userType)) {
            const expectedSuffix = userType === 'aluno' 
                ? '@aluno.ifce.edu.br' 
                : '@ifce.edu.br';
            Alert.alert(
                'Email inválido', 
                `O email deve terminar com ${expectedSuffix} para ${userType === 'aluno' ? 'alunos' : 'professores'}.`
            );
            return;
        }

        setLoading(true);
        try {
            await authLogin(loginNormalized, passwordNormalized);
            
            // Redireciona baseado no tipo de usuário e role retornado pela API
            // A API já valida o email e retorna o role correto
            if (userType === 'aluno') {
                router.replace('/dashboard-aluno');
            } else if (userType === 'professor') {
                router.replace('/dashboard-professor');
            } else {
                // Se não houver userType, tenta redirecionar baseado no role retornado
                // Isso será tratado melhor quando tivermos acesso ao user do contexto
                router.replace('/dashboard-aluno');
            }
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className=' justify-center items-center'>
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
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className='text-white text-center font-bold text-lg'>
                            Entrar
                        </Text>
                    )}
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