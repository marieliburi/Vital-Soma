import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { Alimento, tacoFoods } from '../models/alimentoModel';
import { mockCategories, RecipeCategory } from '../models/receitaModel';
import { Refeicao } from '../models/refeicaoModel';
import { RootStackParamList } from '../navigation/RootNavigator';

export type ActiveTab = 'receitas' | 'alimentos' | 'calorias';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useReceitasViewModel = () => {
  const navigation = useNavigation<NavigationProp>();

  // ESTADOS E LÓGICA EXISTENTES
  const [categories] = useState<RecipeCategory[]>(mockCategories);
  const [allFoods] = useState<Alimento[]>(tacoFoods);
  const [displayedFoods, setDisplayedFoods] = useState<Alimento[]>([]);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('receitas');
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  // --- LÓGICA DA ABA DE CALORIAS ---
  const [calorieGoal] = useState(1960); // Valor da imagem
  // INICIALIZAR COM ARRAYS VAZIOS PARA GARANTIR QUE COMECE ZERADO
  const [dailyMeals, setDailyMeals] = useState<Refeicao[]>([
    { id: '1', name: 'Café da Manhã', foods: [] },
    { id: '2', name: 'Almoço', foods: [] },
    { id: '3', name: 'Lanche', foods: [] },
    { id: '4', name: 'Jantar', foods: [] },
  ]);

  const { totalConsumedKcal, caloriesByMeal } = useMemo(() => {
    let totalKcal = 0;
    const mealTotals: { [key: string]: number } = {
      'Café da Manhã': 0, 'Almoço': 0, 'Lanche': 0, 'Jantar': 0,
    };
    dailyMeals.forEach(meal => {
      const mealKcal = meal.foods.reduce((sum, food) => sum + food.kcal, 0);
      mealTotals[meal.name] = mealKcal;
      totalKcal += mealKcal;
    });
    return { totalConsumedKcal: totalKcal, caloriesByMeal: mealTotals };
  }, [dailyMeals]);

  const remainingKcal = calorieGoal - totalConsumedKcal;

  const handleAddFood = (food: Alimento) => {
    // Simplesmente adiciona o novo alimento à refeição "Lanche"
    setDailyMeals(currentMeals =>
      currentMeals.map(meal =>
        meal.name === 'Lanche'
          ? { ...meal, foods: [...meal.foods, food] }
          : meal
      )
    );
    console.log(`${food.name} adicionado ao Lanche!`);
  };

  // Nova função para adicionar alimento a uma refeição específica
  const handleAddFoodToMeal = (food: Alimento, mealName: string) => {
    // Mapear nomes de exibição para nomes internos
    const mealMapping: { [key: string]: string } = {
      'Café da manhã': 'Café da Manhã',
      'Almoço': 'Almoço',
      'Jantar': 'Jantar',
      'Lanches': 'Lanche',
    };

    const internalMealName = mealMapping[mealName] || mealName;

    setDailyMeals(currentMeals =>
      currentMeals.map(meal =>
        meal.name === internalMealName
          ? { ...meal, foods: [...meal.foods, food] }
          : meal
      )
    );
    
    console.log(`${food.name} adicionado à refeição ${internalMealName}!`);
    
    // Voltar para a aba de calorias após adicionar
    setActiveTab('calorias');
    setSelectedMeal(null);
  };

  // NOVA FUNÇÃO PARA REMOVER ALIMENTO DE UMA REFEIÇÃO
  const handleRemoveFoodFromMeal = (foodIndex: number, mealName: string) => {
    // Mapear nomes de exibição para nomes internos
    const mealMapping: { [key: string]: string } = {
      'Café da manhã': 'Café da Manhã',
      'Almoço': 'Almoço',
      'Jantar': 'Jantar',
      'Lanches': 'Lanche',
    };

    const internalMealName = mealMapping[mealName] || mealName;

    setDailyMeals(currentMeals =>
      currentMeals.map(meal =>
        meal.name === internalMealName
          ? { 
              ...meal, 
              foods: meal.foods.filter((_, index) => index !== foodIndex)
            }
          : meal
      )
    );
    
    console.log(`Alimento removido da refeição ${internalMealName}!`);
  };

  // NOVA FUNÇÃO PARA LIMPAR TODOS OS ALIMENTOS DE UMA REFEIÇÃO
  const handleClearMeal = (mealName: string) => {
    const mealMapping: { [key: string]: string } = {
      'Café da manhã': 'Café da Manhã',
      'Almoço': 'Almoço',
      'Jantar': 'Jantar',
      'Lanches': 'Lanche',
    };

    const internalMealName = mealMapping[mealName] || mealName;

    setDailyMeals(currentMeals =>
      currentMeals.map(meal =>
        meal.name === internalMealName
          ? { ...meal, foods: [] }
          : meal
      )
    );
    
    console.log(`Todos os alimentos removidos da refeição ${internalMealName}!`);
  };

  const handleMealCardPress = (mealName: string) => {
    console.log(`Card da refeição '${mealName}' pressionado!`);
    
    // Definir a refeição selecionada
    setSelectedMeal(mealName);
    
    // Navegar para a aba de alimentos
    setActiveTab('alimentos');
    
    // Navegar para a mesma tela mas com parâmetro
    navigation.navigate('Receitas', { selectedMeal: mealName });
  };
  // --- FIM DA LÓGICA DE CALORIAS ---

  useEffect(() => {
    if (searchText.trim() === '') setDisplayedFoods(allFoods.slice(0, 50));
    else {
      const filteredFoods = allFoods.filter(food =>
        food.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setDisplayedFoods(filteredFoods);
    }
  }, [searchText, allFoods]);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    // Limpar seleção de refeição ao mudar de aba
    if (tab !== 'alimentos') {
      setSelectedMeal(null);
    }
  };
  
  const handleCategoryPress = (category: RecipeCategory) => console.log('Categoria selecionada:', category.name);
  const handleGoBack = () => navigation.goBack();
  const handleClearSearch = () => setSearchText('');

  return {
    activeTab, handleTabChange, handleGoBack,
    categories, handleCategoryPress,
    displayedFoods, searchText, setSearchText, handleAddFood, handleClearSearch,
    // Exportar dados para a tela de Calorias
    calorieGoal, remainingKcal, totalConsumedKcal, caloriesByMeal, handleMealCardPress, dailyMeals,
    // Novas funcionalidades
    selectedMeal, setSelectedMeal, handleAddFoodToMeal,
    // Funcionalidades de remoção
    handleRemoveFoodFromMeal, handleClearMeal,
  };
};

