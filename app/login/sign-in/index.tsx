import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignIn() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = () => {
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
                source={require('../../../src/img/LogoIF.png')} 
                className='w-24 h-24 mb-6'
                resizeMode='contain'
            />
            
            {/* Título SISREV */}
            <Text className='text-3xl font-bold text-green-600 mb-12'>
                SISREV
            </Text>
            
            {/* Container do formulário */}
            <View className='w-full max-w-xs'>
                {/* Campo de Login */}
                <View className='mb-6'>
                    <Text className='text-green-700 font-semibold mb-3 text-base'>
                        Login
                    </Text>
                    <TextInput
                        className= 'border border-black rounded-full  p-3 text-gray-800 text-base'
                        placeholder='Digite seu login'
                        placeholderTextColor='#1C5E27'
                        value={login}
                        onChangeText={setLogin}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
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