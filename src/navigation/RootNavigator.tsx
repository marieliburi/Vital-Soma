import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MainTabNavigator from './MainTabNavigator';
// Telas existentes
import AlimentosScreen from '../views/AlimentosScreen';
import ConfirmacaoCodigo from '../views/ConfirmacaoCodigoScreen';
import EsqueciSenha from '../views/EsqueciSenhaScreen';
import Login from '../views/LoginView';
import NovaSenha from '../views/NovaSenhaScreen';
import ReceitasScreen from '../views/ReceitasScreen';
import Sucesso from '../views/SucessoSenhaScreen';
import WelcomeView from '../views/WelcomeView';

// Atualizado para incluir parâmetros de navegação
export type RootStackParamList = {
  Welcome: undefined;
  Cadastro: undefined;
  MainApp: undefined; // Renomeado de Home para MainApp
  Login: undefined;
  EsqueciSenha: undefined;
  ConfirmacaoCodigo: undefined;
  NovaSenha: undefined;
  Sucesso: undefined;
  Receitas: { selectedMeal?: string } | undefined; // Parâmetro para indicar refeição selecionada
  Alimentos: { selectedMeal?: string } | undefined; // Parâmetro para indicar refeição selecionada
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      {/* Telas do fluxo de autenticação */}
      <Stack.Screen name="Welcome" component={WelcomeView} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />
      <Stack.Screen name="ConfirmacaoCodigo" component={ConfirmacaoCodigo} />
      <Stack.Screen name="NovaSenha" component={NovaSenha} />
      <Stack.Screen name="Sucesso" component={Sucesso} />

      <Stack.Screen name="Alimentos" component={AlimentosScreen} />
      <Stack.Screen name="Receitas" component={ReceitasScreen} />
      {/* Tela principal do App (que contém as abas) */}
      <Stack.Screen name="MainApp" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}

