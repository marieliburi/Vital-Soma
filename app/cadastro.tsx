import { useRouter } from 'expo-router';
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet, Alert, Pressable, StatusBar } from 'react-native';
import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Ionicons } from '@expo/vector-icons';

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};

// Função para avaliar a força da senha
const checkPasswordStrength = (senha: string): 'fraca' | 'media' | 'forte' => {
  if (senha.length < 6) return 'fraca';
  if (/[A-Z]/.test(senha) && /\d/.test(senha) && /[^A-Za-z0-9]/.test(senha)) return 'forte';
  return 'media';
};

export default function Cadastro() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaStrength, setSenhaStrength] = useState<'fraca' | 'media' | 'forte'>('fraca');
  const [showPassword, setShowPassword] = useState(false); // Controle da visibilidade da senha
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // Controle da visibilidade da senha
  const [senhaFocus, setSenhaFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Email inválido', 'Por favor, insira um email válido.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
      });

      if (error) throw error;

      Alert.alert('Sucesso', 'Cadastro realizado! Verifique seu email para confirmar.');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message || 'Erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
      keyboardVerticalOffset={StatusBar.currentHeight || 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Cadastrar</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Digite seu e-mail:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Ex: exemplo@email.com"
                placeholderTextColor="rgba(161, 161, 161, 0.5)"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
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
                style={styles.input}
                value={senha}
                onChangeText={(text) => {
                  setSenha(text);
                  setSenhaStrength(checkPasswordStrength(text));
                }}
                secureTextEntry={!showPassword} // Controla a visibilidade da senha
                autoCapitalize="none"
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

          {senhaFocus && (
            <Text style={styles.dica}>
              Dica: Use letras maiúsculas, números e símbolos para uma senha forte.
            </Text>
          )}

          <Text style={[
            styles.strength,
            { color: senhaStrength === 'fraca' ? 'red' : senhaStrength === 'media' ? 'orange' : 'green' }
          ]}>
            Senha: {senhaStrength}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirme sua senha:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Confirme sua senha"
                placeholderTextColor="rgba(161, 161, 161, 0.5)"
                style={styles.input}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!showPasswordConfirm} // Controla a visibilidade da senha
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                <Ionicons
                  name={showPasswordConfirm ? 'lock-open-outline' : 'lock-closed-outline'}
                  size={20}
                  style={styles.icon}
                />
              </Pressable>
            </View>
          </View>

          {confirmarSenha.length > 0 && (
            <Text style={{ color: senha === confirmarSenha ? 'green' : 'red', marginBottom: 10, alignSelf: 'flex-start' }}>
              {senha === confirmarSenha ? 'Senhas coincidem.' : 'Senhas diferentes.'}
            </Text>
          )}

          <Pressable style={styles.button} onPress={handleCadastro} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </Pressable>

          <Text style={styles.signupText}>
            Já possui conta? Entrar <Text style={styles.signupLink} onPress={() => router.push('/login')}>aqui</Text>.
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
  dica: {
    fontSize: 12, color: '#555', marginBottom: 5, alignSelf: 'flex-start'
  },
  strength: {
    fontSize: 14, marginBottom: 10, alignSelf: 'flex-start'
  },
  button: {
    backgroundColor: '#005A4A', paddingVertical: 12, paddingHorizontal: 40,
    borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3, elevation: 5, marginTop: 10, marginBottom: 20,
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold', fontSize: 18,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    color: 'dodgerblue',
  },
});
