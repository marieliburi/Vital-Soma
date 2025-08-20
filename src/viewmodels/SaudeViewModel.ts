// src/viewmodels/SaudeViewModel.ts
import { useEffect, useState } from 'react';

export const useSaudeViewModel = () => {
  const [overallHealth, setOverallHealth] = useState(0); // Iniciar com 0 ou valor padrão
  const [nutrition, setNutrition] = useState(0);
  const [training, setTraining] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Começa como true para indicar carregamento

  // Efeito para carregar dados iniciais (ex: de uma API, AsyncStorage, etc.)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simular uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Espera 1.5 segundos

      // Aqui você substituiria por sua lógica real de busca de dados
      setOverallHealth(0);
      setNutrition(0);
      setTraining(0);
      setIsLoading(false); // Define como false após os dados serem carregados
    };

    fetchData();
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  const handleOptimize = () => {
    console.log('ViewModel: Otimizando saúde...');
    // Lógica de otimização, talvez atualizando os estados
    // Ex: setOverallHealth(prev => Math.min(prev + 10, 100));
  };

  return {
    overallHealthPercentage: overallHealth,
    nutritionPercentage: nutrition,
    trainingPercentage: training,
    isLoading,
    onOptimizePress: handleOptimize,
  };
};