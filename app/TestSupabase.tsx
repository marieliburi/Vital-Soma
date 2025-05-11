/*import { View, Text, Button } from 'react-native';
import { supabase } from './supabaseClient';
import { useState } from 'react';

export default function TestSupabase() {
  const [mensagem, setMensagem] = useState('');

  const testar = async () => {
    const { data, error } = await supabase.from('usuarios').select('*');

    if (error) {
        console.log('ERRO DETALHADO:', JSON.stringify(error, null, 2));
        setMensagem('❌ Erro: ' + error.message);
      } else {
      console.log('Dados:', data);
      setMensagem('✅ Conexão funcionando! Veja os dados no console.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
  <Text style={{ marginBottom: 20, fontSize: 18, color: '#000' }}>{mensagem}</Text>
  <Button title="Testar Supabase" onPress={testar} />
</View>

  );
}*/
