import { useNavigation } from '@react-navigation/native'; // Verifique se está importado
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { RootStackParamList } from '../navigation/RootNavigator';
type DiaryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainApp'>;
// Interfaces para tipar os dados
interface Meal {
  id: number;
  name: string;
  description: string;
  time: string;
  image?: any; 
}

const useDiaryViewModel = () => {
    const navigation = useNavigation<DiaryScreenNavigationProp>();
  // Estado para armazenar as refeições do dia
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: 1,
      name: 'Café da Manhã',
      description: 'Macarronada bolada com o melhor molho branco que você já viu na vida',
      time: '8:00',
      image: require('../../assets/images/cafemanha.jpg'),
    },
    {
      id: 2,
      name: 'Almoço',
      description: 'Barrinha de proteína da growth com um copo de água sem gás',
      time: '12:00',
      image: require('../../assets/images/almoco.jpeg'),
    },
    {
      id: 3,
      name: 'Janta',
      description: 'Pão e água',
      time: '23:00',
      image: require('../../assets/images/janta.jpg'), 
    },
  ]);

  // AJUSTE DO CARROSSEL: Array de dicas
  const [healthTips] = useState([
    'A quantidade de água que um adulto deve beber por dia é de cerca de 2 a 3 litros. Mantenha-se hidratado!',
    'Uma boa noite de sono, de 7 a 9 horas, é crucial para a recuperação muscular e para a saúde mental.',
    'Inclua vegetais em todas as refeições. Eles são ricos em vitaminas, minerais e fibras.',
    'Evite alimentos processados e ricos em açúcar. Eles podem causar picos de insulina e inflamação.',
    'Praticar 30 minutos de atividade física moderada na maioria dos dias da semana traz grandes benefícios para a saúde.',
  ]);

  // Estado para controlar qual dica está sendo exibida
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Effect para criar o temporizador (timer) que troca a dica
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prevIndex) =>
        (prevIndex + 1) % healthTips.length // Faz o índice voltar a 0 quando chega ao fim
      );
    }, 7000); // Troca a cada 7 segundos

    // Limpa o intervalo quando o componente é desmontado para evitar vazamento de memória
    return () => clearInterval(timer);
  }, [healthTips.length]);


  // Funções para interagir com a tela
  const handleOpenMealDetails = (meal: Meal) => {
    console.log('Abrindo detalhes de:', meal.name);
  };

  const handleOpenWorkoutList = () => {
    console.log('Abrindo a lista de treinos');
  };

  const handleOpenWeekPlanning = () => {
    console.log('Abrindo o planejamento da semana');
  };

  const handleNavigateToAlimentacao = () => {
    navigation.navigate('Receitas');
  };
  return {
    meals,
    healthTips, // Retorna o array de dicas
    currentTipIndex, // Retorna o índice da dica atual
    handleOpenMealDetails,
    handleOpenWorkoutList,
    handleOpenWeekPlanning,
    handleNavigateToAlimentacao,
  };
};

export default useDiaryViewModel;