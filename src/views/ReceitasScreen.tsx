import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MealCardHorizontal from '../componentes/MealCardHorizontal';
import RecipeCategoryCard from '../componentes/RecipeCategoryCard';
import { Alimento } from '../models/alimentoModel';
import { RootStackParamList } from '../navigation/RootNavigator';
import { ActiveTab, useReceitasViewModel } from '../viewmodels/useReceitasViewModel';

type ReceitasScreenRouteProp = RouteProp<RootStackParamList, 'Receitas'>;

// Componente AlimentoCard customizado para fundo branco
const AlimentoCardWhite: React.FC<{ food: Alimento; onAdd: () => void }> = ({ food, onAdd }) => (
  <View style={styles.alimentoCardWhite}>
    <View style={styles.alimentoInfoWhite}>
      <Text style={styles.alimentoNameWhite}>{food.name}</Text>
      <Text style={styles.alimentoKcalWhite}>{food.kcal} kcal | 100 g</Text>
    </View>
    <TouchableOpacity style={styles.addButtonWhite} onPress={onAdd}>
      <Ionicons name="add" size={24} color="#1e6a43" />
    </TouchableOpacity>
  </View>
);

export default function ReceitasScreen() {
  const route = useRoute<ReceitasScreenRouteProp>();
  const [showPopup, setShowPopup] = useState(false);
  const [showMealDetails, setShowMealDetails] = useState<string | null>(null);
  
  const {
    activeTab, handleTabChange, handleGoBack,
    categories, handleCategoryPress,
    displayedFoods, searchText, setSearchText, handleAddFood, handleClearSearch,
    // RECEBER DADOS DE CALORIAS
    calorieGoal, remainingKcal, totalConsumedKcal, caloriesByMeal, handleMealCardPress, dailyMeals,
    selectedMeal, setSelectedMeal, handleAddFoodToMeal,
    // Funcionalidades de remoção
    handleRemoveFoodFromMeal, handleClearMeal,
  } = useReceitasViewModel();

  // Verificar se veio com parâmetro de refeição selecionada
  useEffect(() => {
    if (route.params?.selectedMeal) {
      setSelectedMeal(route.params.selectedMeal);
      handleTabChange('alimentos');
      setShowPopup(true);
      // Esconder popup após 2 segundos
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }
  }, [route.params?.selectedMeal]);

  const renderTab = (tabName: string, tabIdentifier: ActiveTab) => (
    <TouchableOpacity onPress={() => handleTabChange(tabIdentifier)}>
      <Text style={[styles.tabText, activeTab === tabIdentifier && styles.activeTabText]}>
        {tabName}
      </Text>
      {activeTab === tabIdentifier && <View style={styles.activeTabLine} />}
    </TouchableOpacity>
  );

  // Função que desenha o conteúdo da aba "Alimentos"
  const renderAlimentosContent = () => (
    <View style={styles.whiteBackground}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={24} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={displayedFoods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlimentoCardWhite 
            food={item} 
            onAdd={() => selectedMeal ? handleAddFoodToMeal(item, selectedMeal) : handleAddFood(item)} 
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nada aqui</Text>
            <Text style={styles.emptySubText}>meu caro...</Text>
          </View>
        }
      />
    </View>
  );

  // Função que desenha o conteúdo da aba "Receitas"
  const renderReceitasContent = () => (
    <View style={styles.receitasContainer}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecipeCategoryCard category={item} onPress={handleCategoryPress} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 80 }}
      />
      
      {/* Botão de Favoritos na parte inferior */}
      <View style={styles.favoritesButtonContainer}>
        <TouchableOpacity style={styles.favoritesButton} onPress={() => console.log('Favoritos pressionado')}>
          <Ionicons name="heart" size={20} color="#4CAF50" style={styles.favoritesHeart} />
          <Text style={styles.favoritesText}>Favoritas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Função para renderizar item da lista de alimentos
  const renderFoodItem = ({ item, index }: { item: Alimento; index: number }) => (
    <View style={styles.foodItem}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodKcal}>{item.kcal} kcal</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => {
          if (showMealDetails) {
            handleRemoveFoodFromMeal(index, showMealDetails);
          }
        }}
      >
        <Ionicons name="close-circle" size={20} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  // Função que desenha o conteúdo da aba "Calorias"
  const renderCaloriasContent = () => {
    const meals = [
      { name: 'Café da manhã', kcal: caloriesByMeal['Café da Manhã'], items: dailyMeals.find(m => m.name === 'Café da Manhã')?.foods.length || 0 },
      { name: 'Almoço', kcal: caloriesByMeal['Almoço'], items: dailyMeals.find(m => m.name === 'Almoço')?.foods.length || 0 },
      { name: 'Jantar', kcal: caloriesByMeal['Jantar'], items: dailyMeals.find(m => m.name === 'Jantar')?.foods.length || 0 },
      { name: 'Lanches', kcal: caloriesByMeal['Lanche'], items: dailyMeals.find(m => m.name === 'Lanche')?.foods.length || 0 },
    ];

    return (
      <View style={styles.whiteBackground}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção de Cálculo */}
          <View style={styles.calculationSection}>
            <View style={styles.calculationHeader}>
              <Text style={styles.calculationHeaderText}>Cálculo</Text>
            </View>
            <View style={styles.calculationRow}>
              <View style={styles.calculationItem}>
                <Text style={styles.calculationLabel}>Meta</Text>
                <Text style={styles.calculationValue}>{calorieGoal} kcal</Text>
              </View>
              <Text style={styles.calculationOperator}>- (</Text>
              <View style={styles.calculationItem}>
                <Text style={styles.calculationLabel}>Alimento</Text>
                <Text style={styles.calculationValue}>{totalConsumedKcal} kcal</Text>
              </View>
              <Text style={styles.calculationOperator}>+</Text>
              <View style={styles.calculationItem}>
                <Text style={styles.calculationLabel}>Exercício</Text>
                <Text style={styles.calculationValue}>0 kcal</Text>
              </View>
              <Text style={styles.calculationOperator}>) =</Text>
              <View style={styles.calculationResult}>
                <Text style={styles.calculationValue}>{remainingKcal} kcal</Text>
                <Text style={styles.calculationLabel}>Restantes</Text>
              </View>
            </View>
          </View>

          {/* Cards das Refeições */}
          {meals.map((meal) => (
            <TouchableOpacity
              key={meal.name}
              onLongPress={() => meal.items > 0 ? setShowMealDetails(meal.name) : null}
            >
              <MealCardHorizontal
                mealName={meal.name}
                kcal={meal.kcal}
                items={meal.items}
                onAdd={() => handleMealCardPress(meal.name)}
                onClear={meal.items > 0 ? () => {
                  Alert.alert(
                    'Confirmar',
                    `Deseja remover todos os alimentos de ${meal.name}?`,
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Confirmar', onPress: () => handleClearMeal(meal.name) }
                    ]
                  );
                } : undefined}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Função para obter o título do header baseado na aba ativa
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'receitas':
        return 'Receitas';
      case 'alimentos':
        return 'Alimentos';
      case 'calorias':
        return 'Calorias';
      default:
        return 'Receitas';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header unificado para todas as abas */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {renderTab('Receitas', 'receitas')}
          {renderTab('Alimentos', 'alimentos')}
          {renderTab('Calorias', 'calorias')}
        </View>

        {/* Conteúdo das abas */}
        {activeTab === 'receitas' && renderReceitasContent()}
        {activeTab === 'alimentos' && renderAlimentosContent()}
        {activeTab === 'calorias' && renderCaloriasContent()}

        {/* Popup de seleção de alimentos */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showPopup}
          onRequestClose={() => setShowPopup(false)}
        >
          <View style={styles.popupOverlay}>
            <View style={styles.popupContainer}>
              <Text style={styles.popupText}>Selecione os alimentos</Text>
              {selectedMeal && (
                <Text style={styles.popupSubText}>para {selectedMeal}</Text>
              )}
            </View>
          </View>
        </Modal>

        {/* Modal de detalhes da refeição */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showMealDetails !== null}
          onRequestClose={() => setShowMealDetails(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {showMealDetails} - Alimentos Adicionados
                </Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowMealDetails(null)}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={dailyMeals.find(m => {
                  const mealMapping: { [key: string]: string } = {
                    'Café da manhã': 'Café da Manhã',
                    'Almoço': 'Almoço',
                    'Jantar': 'Jantar',
                    'Lanches': 'Lanche',
                  };
                  return m.name === (mealMapping[showMealDetails || ''] || showMealDetails);
                })?.foods || []}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderFoodItem}
                ListEmptyComponent={
                  <Text style={styles.emptyModalText}>Nenhum alimento adicionado</Text>
                }
                contentContainerStyle={styles.modalList}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#1e6a43' 
  },
  container: { 
    flex: 1 
  },
  // Header unificado para todas as abas
  headerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 15, 
    position: 'relative',
    paddingHorizontal: 20,
  },
  backButton: { 
    position: 'absolute', 
    left: 20, 
    padding: 5 
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  tabsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 0,
    paddingHorizontal: 20,
  },
  tabText: { 
    color: '#a0d1c3', 
    fontSize: 16, 
    paddingBottom: 10 
  },
  activeTabText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  activeTabLine: { 
    height: 3, 
    backgroundColor: '#fff', 
    borderRadius: 2 
  },

  // Container para aba de receitas (mantém fundo verde)
  receitasContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Fundo branco para abas de alimentos e calorias
  whiteBackground: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },

  // Estilos para busca na aba alimentos (ajustados para fundo branco)
  searchContainer: { 
    backgroundColor: '#f0f0f0', 
    borderRadius: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    marginVertical: 10 
  },
  searchIcon: { 
    marginRight: 10 
  },
  clearButton: { 
    padding: 5 
  },
  searchInput: { 
    flex: 1, 
    height: 50, 
    color: '#333', 
    fontSize: 16 
  },

  // Estilos para AlimentoCard no fundo branco
  alimentoCardWhite: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  alimentoInfoWhite: {
    flex: 1,
  },
  alimentoNameWhite: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  alimentoKcalWhite: {
    fontSize: 14,
    color: '#666',
  },
  addButtonWhite: {
    backgroundColor: '#e8f5e8',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Container vazio para alimentos
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: { 
    color: '#333', 
    textAlign: 'center', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5,
  },

  // Botão de favoritos
  favoritesButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  favoritesButton: {
    backgroundColor: '#1e6a43',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  favoritesHeart: {
    marginRight: 8,
  },
  favoritesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Estilos específicos para a aba de Calorias
  scrollContent: {
    paddingBottom: 20,
  },
  calculationSection: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  calculationHeader: {
    backgroundColor: '#a0d1c3',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  calculationHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  calculationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  calculationItem: {
    alignItems: 'center',
    marginHorizontal: 2,
  },
  calculationResult: {
    alignItems: 'center',
    marginLeft: 5,
  },
  calculationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  calculationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  calculationOperator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 3,
  },
  
  // Estilos do popup
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    minWidth: 200,
  },
  popupText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  popupSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },

  // Estilos do modal de detalhes
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalList: {
    padding: 20,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  foodKcal: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 5,
  },
  emptyModalText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
});

