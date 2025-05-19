import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import AuthService from '../models/authModel';
import { RootStackParamList } from '../navigation/RootNavigator';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export function useLoginViewModel() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (password: string): 'fraca' | 'media' | 'forte' => {
    if (password.length < 6) return 'fraca';
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) return 'forte';
    return 'media';
  };

  const login = useCallback(async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu email');
      return;
    }
    
    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, digite um email válido');
      return;
    }
    
    if (!password) {
      Alert.alert('Erro', 'Por favor, digite sua senha');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.signInWithEmail(email, password);

      if (!response.success) {
        Alert.alert('Erro ao fazer login', response.error || 'Ocorreu um erro ao fazer login');
        return;
      }

      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [email, password, navigation]);

  const signUp = useCallback(async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu email');
      return;
    }
    
    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, digite um email válido');
      return;
    }
    
    if (!password) {
      Alert.alert('Erro', 'Por favor, digite uma senha');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.signUp(email, password);

      if (!response.success) {
        Alert.alert('Erro ao cadastrar', response.error || 'Ocorreu um erro ao cadastrar');
        return;
      }

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      setActiveTab('login'); // Volta para a aba de login após cadastro
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword]);

  const toggleShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const navigateToForgotPassword = useCallback(() => {
    navigation.navigate('EsqueciSenha');
  }, [navigation]);

  const switchTab = useCallback((tab: 'login' | 'signup') => {
    setActiveTab(tab);
    // Resetar campos ao trocar de aba
    setPassword('');
    setConfirmPassword('');
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    login,
    signUp,
    showPassword,
    toggleShowPassword,
    activeTab,
    switchTab,
    navigateToForgotPassword,
    checkPasswordStrength,
  };
}
