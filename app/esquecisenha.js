import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './supabaseClient';  // Certifique-se de importar o cliente do Supabase

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleSend = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    try {
      // Envia o e-mail de recuperação de senha via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw error; // Se houver erro, lança uma exceção
      }

      // Se não houver erro, exibe uma mensagem de sucesso
      Alert.alert(
        'Recuperação de Senha',
        'Instruções para recuperação de senha foram enviadas para o e-mail informado.'
      );
      navigation.goBack(); // Volta para a tela anterior (Login)
    } catch (error) {
      // Caso haja erro
      Alert.alert('Erro', error.message);
    }
  };

  const handleCancel = () => {
    navigation.goBack(); // Volta para a tela anterior (Login)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Digite seu e-mail:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="rgba(161, 161, 161, 0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Ionicons name="mail-outline" size={20} style={styles.icon} />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      <Pressable onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 35,
    fontFamily: 'Roboto',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 50,
  },
  icon: {
    marginLeft: 10,
    color: '#888',
  },
  button: {
    backgroundColor: 'dodgerblue',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cancelButtonText: {
    color: 'dodgerblue',
    fontSize: 16,
    marginTop: 10,
  },
});
