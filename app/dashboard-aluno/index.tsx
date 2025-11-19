import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock de disciplinas - posteriormente virá do banco de dados
const DISCIPLINAS = [
    'Cálculo Diferencial e Integral',
    'Lógica Matemática',
    'Português Instrumental',
    'Introdução à Filosofia',
    'Introdução à Administração',
    'Matemática Discreta',
    'Fundamentos de Ciência da Computação',
    'Fundamentos de Sistemas de Informação',
    'Algoritmos e Programação I',
    'Algoritmos e Estrutura de Dados I',
    'Banco de Dados I',
    'Arquitetura e Organização de Computadores',
    'Algoritmos e Programação II',
    'Programação Orientada a Objetos I',
    'Algoritmos e Estrutura de Dados II',
    'Banco de Dados II',
    'Análise e Projeto de Sistemas I',
    'Sistemas Operacionais',
    'Redes de Computadores I',
    'Estatística Computacional',
    'Análise e Projeto de Sistemas II',
    'Sistemas Distribuídos',
    'Redes de Computadores II',
    'Programação Orientada a Objetos II',
    'Inteligência Artificial',
    'Gerenciamento de Projetos',
    'Engenharia de Software I',
    'Projeto de Sistemas Web I',
    'Computação Gráfica',
    'Trabalho de Conclusão de Curso I',
    'Engenharia de Software II',
    'Projeto de Sistemas Web II',
    'Contabilidade e Finanças',
    'Trabalho de Conclusão de Curso II',
    'Tópicos Especiais em Sistemas de Informação',
    'Informática Educativa',
    'Metodologia Científica',
    'Linguagens e Paradigmas de Programação',
    'Pesquisa e Ordenação de Dados',
    'Estágio Supervisionado I',
    'Estágio Supervisionado II',
    'Estágio Supervisionado III',
    'Estágio Supervisionado IV',
    'Inglês Instrumental',
    'Introdução à Sociologia',
    'Interface Homem-Máquina',
    'Computador e Sociedade',
    'Gestão de Tecnologia da Informação',
    'Empreendedorismo e Gestão de Negócios',
];

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('home');
    const router = useRouter();

    // Filtrar disciplinas baseado na busca
    const filteredDisciplinas = useMemo(() => {
        if (!searchQuery.trim()) {
            return DISCIPLINAS;
        }
        return DISCIPLINAS.filter(disciplina =>
            disciplina.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleDisciplinaPress = (disciplina: string) => {
        // Aqui você pode adicionar a navegação para detalhes da disciplina
        console.log('Disciplina selecionada:', disciplina);
    };

    const handleTabPress = (tab: string) => {
        if (tab === activeTab) return;

        setActiveTab(tab);

        // Navegação
        if (tab === 'profile') {
            // TODO: Criar rota de perfil do aluno
            // router.replace('/dashboard-aluno/profile/profile');
        }
    };

    return (
        <View className='flex-1 bg-gray-200'>
            {/* Container principal com borda */}
            <View className='flex-1 m-2 bg-white rounded-lg'>
                {/* Header */}
                <View className='bg-white pt-12 pb-4 px-4'>
                    {/* Top Row - Icons */}
                    <View className='flex-row justify-between items-center mb-4'>
                        {/* Ícone de Perfil */}
                        <TouchableOpacity className='w-12 h-12 bg-green-700 rounded-full justify-center items-center' activeOpacity={0.7}>
                            <AntDesign name="user" size={24} color="white" />
                        </TouchableOpacity>
                        
                        {/* Logo SISREV */}
                        <View className='flex-row items-center relative'>
                            {/* Quadrado vermelho pequeno acima do SIS */}
                            <View className='absolute -top-1 left-0 w-2 h-2 bg-red-500' />
                            <Text className='text-3xl font-black' style={{ 
                                fontFamily: 'monospace',
                                color: '#90EE90',
                                textShadowColor: '#90EE90',
                                textShadowOffset: { width: 1, height: 1 },
                                textShadowRadius: 1,
                            }}>
                                SIS
                            </Text>
                            <Text className='text-3xl font-black text-green-700 ml-1'>
                                REV
                            </Text>
                        </View>
                        
                        {/* Ícone de Notificações */}
                        <TouchableOpacity className='w-10 h-10 justify-center items-center' activeOpacity={0.7}>
                            <Ionicons name="notifications-outline" size={28} color="#1C5E27" />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Barra de Busca */}
                    <View className='bg-white border border-gray-400 rounded-full px-4 flex-row items-center h-12'>
                        <TextInput
                            className='flex-1 text-gray-800 text-base h-10'
                            placeholder='Buscar...'
                            placeholderTextColor='#9CA3AF'
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Ionicons name="search" size={20} color="#4B5563" />
                    </View>
                </View>
                
                {/* Conteúdo Principal - Lista de Disciplinas */}
                <ScrollView className='flex-1 px-4 py-2 pb-20'>
                    {filteredDisciplinas.map((disciplina, index) => (
                        <TouchableOpacity
                            key={index}
                            className='bg-green-600 rounded-full p-4 mb-3 flex-row items-center'
                            onPress={() => handleDisciplinaPress(disciplina)}
                            activeOpacity={0.8}
                        >
                            {/* Ícone de Computador */}
                            <MaterialIcons name="computer" size={28} color="#E8F5E9" />
                            
                            {/* Nome da Disciplina */}
                            <Text className='flex-1 text-green-50 font-semibold text-base ml-4'>
                                {disciplina}
                            </Text>
                            
                            {/* Botão de Seta */}
                            <View className='w-8 h-8 bg-gray-300 rounded-full justify-center items-center'>
                                <Ionicons name="chevron-down" size={18} color="#4B5563" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                
                {/* Bottom Navigation Bar - Flutuante */}
                <View 
                    className='bg-green-700 rounded-full mx-8 mb-4 px-6 py-3 flex-row justify-around items-center'
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                >
                    {/* Início */}
                    <TouchableOpacity 
                        className={`px-6 py-2 flex-row items-center rounded-full ${
                            activeTab === 'home' ? 'bg-green-500' : ''
                        }`}
                        activeOpacity={0.7}
                        onPress={() => handleTabPress('home')}
                    >
                        <Ionicons 
                            name={activeTab === 'home' ? 'home' : 'home-outline'} 
                            size={20} 
                            color="white" 
                        />
                        <Text className='text-white font-semibold ml-2 text-sm'>
                            Início
                        </Text>
                    </TouchableOpacity>
                    
                    {/* Perfil */}
                    <TouchableOpacity 
                        className={`px-6 py-2 flex-row items-center rounded-full ${
                            activeTab === 'profile' ? 'bg-green-500' : ''
                        }`}
                        activeOpacity={0.7}
                        onPress={() => handleTabPress('profile')}
                    >
                        <Ionicons 
                            name={activeTab === 'profile' ? 'person' : 'person-outline'} 
                            size={20} 
                            color="white" 
                        />
                        <Text className='text-white font-semibold ml-2 text-sm'>
                            Perfil
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
