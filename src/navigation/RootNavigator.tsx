import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ConfirmacaoCodigo from '../views/ConfirmacaoCodigoScreen';
import EsqueciSenha from '../views/EsqueciSenhaScreen';
import Home from '../views/Home';
import Login from '../views/LoginView';
import NovaSenha from '../views/NovaSenhaScreen';
import Sucesso from '../views/SucessoSenhaScreen';
import WelcomeView from '../views/WelcomeView';


export type RootStackParamList = {
  Welcome: undefined;
  Cadastro: undefined;
  Home: undefined;
  Login: undefined;
  EsqueciSenha: undefined;
  ConfirmacaoCodigo: undefined;
  NovaSenha: undefined;
  Sucesso: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
<Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Welcome" component={WelcomeView} />
  <Stack.Screen name="Login" component={Login} />
  <Stack.Screen name="Home" component={Home} />
  <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />
  <Stack.Screen name="ConfirmacaoCodigo" component={ConfirmacaoCodigo} />
  <Stack.Screen name="NovaSenha" component={NovaSenha} />
  <Stack.Screen name="Sucesso" component={Sucesso} />
</Stack.Navigator>
  );
}
