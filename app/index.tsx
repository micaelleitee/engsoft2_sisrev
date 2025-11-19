import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function index() {
    const router = useRouter();

    const handleUserTypeSelection = (userType: 'aluno' | 'professor') => {
        // Navega para a tela de login passando o tipo de usuário como parâmetro
        router.push({
            pathname: '/login/sign-in',
            params: { userType }
        });
    };

    return (
        <View className='flex-1 justify-center items-center bg-white px-6'>
            {/* Logo */}
            <Image 
                source={require('../src/img/LogoIF.png')} 
                className='w-24 h-24 mb-6'
                resizeMode='contain'
            />
            
            {/* Título SISREV */}
            <Text className='text-4xl font-black text-green-700 mb-4'>
                SISREV
            </Text>
            
            {/* Subtítulo */}
            <Text className='text-lg text-gray-600 mb-12 text-center'>
                Selecione o tipo de usuário
            </Text>
            
            {/* Container dos botões */}
            <View className='w-full max-w-xs'>
                {/* Botão Aluno */}
                <TouchableOpacity
                    className='bg-green-700 rounded-full py-4 mb-4'
                    onPress={() => handleUserTypeSelection('aluno')}
                    activeOpacity={0.8}
                >
                    <Text className='text-white text-center font-bold text-lg'>
                        Aluno
                    </Text>
                </TouchableOpacity>
                
                {/* Botão Professor */}
                <TouchableOpacity
                    className='bg-green-600 rounded-full py-4'
                    onPress={() => handleUserTypeSelection('professor')}
                    activeOpacity={0.8}
                >
                    <Text className='text-white text-center font-bold text-lg'>
                       Professor
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}