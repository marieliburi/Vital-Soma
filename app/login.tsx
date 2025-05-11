import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, Pressable, KeyboardAvoidingView, ScrollView } from 'react-native';
import { supabase } from './supabaseClient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Controle da visibilidade da senha
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Controle para a tela de "Esqueci minha senha"


  const handleLogin = async () => {
    console.log('Tentando login com:', email, senha);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      console.log('Erro completo:', error);
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Sucesso', 'Login realizado!');
      router.replace('/(tabs)'); // manda pras abas
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }
    // Aqui você pode adicionar a lógica para o processo de recuperação de senha
    Alert.alert('Recuperar Senha', 'Instruções para recuperação de senha serão enviadas para o e-mail informado.');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" keyboardVerticalOffset={StatusBar.currentHeight || 0}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">

        <View style={styles.container}>
          <StatusBar style="dark" />
          <Text style={styles.title}>Entrar</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Digite seu e-mail:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Ex: example@email.com"
                placeholderTextColor="rgba(161, 161, 161, 0.5)"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Ionicons name="mail-outline" size={20} style={styles.icon} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Digite sua senha:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Digite sua senha"
                placeholderTextColor="rgba(161, 161, 161, 0.5)"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword} // Controla a visibilidade da senha
                style={styles.input}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'lock-open-outline' : 'lock-closed-outline'}
                  size={20}
                  style={styles.icon}
                />
              </Pressable>          
            </View>
          </View>

          <Pressable onPress={() => router.push('/esquecisenha')}>
            <Text style={styles.forgotPasswordLink}>Esqueci minha senha...</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>

          <Text style={styles.signupText}>
            Cadastrar-se <Text style={styles.signupLink} onPress={() => router.push('/cadastro')}>aqui</Text>.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25, backgroundColor: '#fff'
  },
  title: {
    fontSize: 28, fontWeight: 'bold', marginBottom: 35, fontFamily: 'Roboto',
  },
  inputContainer: {
    width: '100%', marginBottom: 15,
  },
  label: {
    fontSize: 16, marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5',
    borderRadius: 20, paddingHorizontal: 15,
    borderWidth: 1, borderColor: '#ccc',
  },
  input: {
    flex: 1, height: 50,
  },
  icon: {
    marginLeft: 10, color: '#888',
  },
  forgotPassword: {
    color: 'dodgerblue', marginBottom: 20, marginTop: 5, alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#005A4A', paddingVertical: 12, paddingHorizontal: 40,
    borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3, elevation: 5, marginBottom: 20,
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold', fontSize: 18,
  },
  forgotPasswordLink: {
    color: 'dodgerblue', marginTop: 10, marginBottom: 22
  },
  cancelLink: {
    color: 'gray', marginTop: 10,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    color: 'dodgerblue',
  },
});
