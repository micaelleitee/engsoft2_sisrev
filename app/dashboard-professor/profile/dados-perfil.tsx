import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DadosPerfil() {
    const router = useRouter();
    const [login, setLogin] = useState('Micael.leite60@aluno.ifce.edu.br');
    const [senha, setSenha] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [disciplina, setDisciplina] = useState('Engenharia de Software 2');

    const handleSave = () => {
        // Lógica para salvar os dados
        console.log('Dados salvos');
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <View className='flex-1 bg-white'>
            {/* Header */}
            <View className='bg-white pt-12 pb-4 px-4 border-b border-gray-200'>
                <View className='flex-row items-center'>
                    <TouchableOpacity
                        onPress={handleCancel}
                        className='mr-4'
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#15803d" />
                    </TouchableOpacity>

                    <View className='w-10 h-10 bg-green-700 rounded-full justify-center items-center mr-3'>
                        <AntDesign name="user" size={20} color="white" />
                    </View>

                    <Text className='text-lg font-semibold text-gray-800'>
                        Dados do perfil
                    </Text>
                </View>
            </View>

            {/* Conteúdo do formulário */}
            <ScrollView className='flex-1 px-4 pt-6' contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Login */}
                <View className='mb-4'>
                    <Text className='text-green-700 font-semibold mb-2'>
                        Digite um login:
                    </Text>
                    <TextInput
                        className='border border-gray-300 rounded-full px-4 py-3 text-gray-600'
                        value={login}
                        onChangeText={setLogin}
                        placeholder="Digite seu login"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Senha atual */}
                <View className='mb-4'>
                    <Text className='text-green-700 font-semibold mb-2'>
                        Digite uma senha:
                    </Text>
                    <TextInput
                        className='border border-gray-300 rounded-full px-4 py-3 text-gray-400'
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="* * * * * * * * *"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                    />
                </View>

                {/* Nova senha */}
                <View className='mb-4'>
                    <Text className='text-green-700 font-semibold mb-2'>
                        Digite a senha novamente:
                    </Text>
                    <TextInput
                        className='border border-gray-300 rounded-full px-4 py-3 text-gray-400'
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        placeholder="* * * * * * * * *"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                    />
                </View>

                {/* Nome */}
                <View className='mb-4'>
                    <Text className='text-green-700 font-semibold mb-2'>
                        Digite seu nome:
                    </Text>
                    <TextInput
                        className='border border-gray-300 rounded-full px-4 py-3 text-gray-600'
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite seu nome"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Email */}
                <View className='mb-4'>
                    <Text className='text-green-700 font-semibold mb-2'>
                        Email:
                    </Text>
                    <TextInput
                        className='border border-gray-300 rounded-full px-4 py-3 text-gray-600'
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Digite seu email"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                    />
                </View>

                {/* Disciplina */}
                <View className='mb-6'>
                    <Text className='text-green-700 font-semibold mb-2'>
                        Escolha sua disciplina:
                    </Text>
                    <View className='flex-row items-center'>
                        <TouchableOpacity
                            className='flex-1 border border-gray-300 rounded-full px-4 py-3 flex-row justify-between items-center mr-2'
                            activeOpacity={0.7}
                        >
                            <Text className='text-gray-700'>
                                {disciplina}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#4B5563" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className='w-10 h-10 border border-gray-300 rounded-full justify-center items-center'
                            activeOpacity={0.7}
                        >
                            <Ionicons name="add-circle-outline" size={24} color="#4B5563" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Botões de ação */}
                <View className='flex-row gap-3'>
                    <TouchableOpacity
                        className='flex-1 bg-green-600 rounded-full py-3 justify-center items-center'
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <Text className='text-white font-semibold text-base'>
                            Alterar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className='flex-1 bg-red-500 rounded-full py-3 justify-center items-center'
                        onPress={handleCancel}
                        activeOpacity={0.8}
                    >
                        <Text className='text-white font-semibold text-base'>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
