// App.tsx - VERSÃO FINAL E CORRETA

import { NavigationContainer } from '@react-navigation/native';
import { Buffer } from 'buffer';
import process from 'process';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import RootNavigator from './src/navigation/RootNavigator';
import supabase from './src/supabaseClient';
// Polyfills
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}
if (typeof global.process === 'undefined') {
  global.process = process;
}

export default function App() {
  
  // Sua lógica do Supabase
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // ...
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );

}