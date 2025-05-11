import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../supabaseClient'; // Importando o cliente do Supabase
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../type'; // Importando o tipo das rotas

// Tipando a navegação com o RootStackParamList
type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WelcomeScreen'>;

export default function WelcomeScreen() {
  const [loading, setLoading] = useState(true);
  const [waitTimeOver, setWaitTimeOver] = useState(false); // Estado para controlar o tempo de espera
  const navigation = useNavigation<WelcomeScreenNavigationProp>(); // Tipando a navegação

  useEffect(() => {
    // Função para simular o tempo de espera (exemplo: 3 segundos)
    const timeout = setTimeout(() => {
      setWaitTimeOver(true); // Marcar que o tempo de espera acabou
    }, 3000); // Aqui você pode ajustar o tempo de espera (3000 ms = 3 segundos)

    const checkAuthStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser(); // Pega o usuário logado com getUser()

        if (user && waitTimeOver) {
          // Se o usuário estiver logado e o tempo de espera acabou, vai para a tela principal
          navigation.replace('Home'); // Ou qualquer nome da sua tela principal
        } else if (!user && waitTimeOver) {
          // Se não estiver logado e o tempo de espera acabou, vai para a tela de cadastro
          navigation.replace('cadastro'); // Certifique-se de ter a tela de cadastro
        }
      } catch (error) {
        console.error('Erro ao verificar o usuário', error);
      }
    };

    // Chama a função de verificação após o tempo de espera
    checkAuthStatus();

    return () => clearTimeout(timeout); // Limpar timeout quando a tela for desmontada
  }, [waitTimeOver, navigation]); // Espera até o tempo de espera acabar para fazer a navegação

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo!</Text>
      {loading && (
        <ActivityIndicator size="large" color="dodgerblue" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
});
