import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import process from 'process';
import React, { useEffect } from 'react';
import 'react-native-url-polyfill/auto';
import supabase from '././src/supabaseClient';
import RootNavigator from './src/navigation/RootNavigator';

// Configura o Buffer e o process no runtime global
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

if (typeof global.process === 'undefined') {
  global.process = process;
}

const Stack = createNativeStackNavigator();

export default function App() {
  // 🔐 Escuta login/logout
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('Usuário logado:', session?.user?.email);
      }

      if (event === 'SIGNED_OUT') {
        console.log('Usuário saiu');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={RootNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
