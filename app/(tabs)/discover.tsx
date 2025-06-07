import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { Search } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// Données des catégories avec leurs informations visuelles EXACTES du design
const categories = [
  {
    id: 'morning',
    title: 'Morning\nAdhkar',
    subtitle: 'Start your day with remembrance',
    gradient: ['#F4A460', '#CD853F'], // Sandy brown gradient - EXACT du design
    icon: '🌅'
  },
  {
    id: 'evening',
    title: 'Evening\nAdhkar', 
    subtitle: 'End your day in gratitude',
    gradient: ['#8B4513', '#A0522D'], // Brown/rust gradient - EXACT du design
    icon: '🌆'
  },
  {
    id: 'istighfar',
    title: 'Istighfar',
    subtitle: 'Seek forgiveness and purification',
    gradient: ['#9370DB', '#8A2BE2'], // Purple gradient - EXACT du design
    icon: '🤲'
  },
  {
    id: 'night',
    title: 'Night\nAdhkar',
    subtitle: 'Protection through the night', 
    gradient: ['#2C3E50', '#34495E'], // Dark blue gradient - EXACT du design
    icon: '🌙'
  }
];

// Composant pour les onglets General/Favourites - EXACT du design
const TabButton = ({ title, isActive, onPress }: any) => (
  <TouchableOpacity
    style={[
      styles.tabButton,
      isActive && styles.tabButtonActive
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[
      styles.tabButtonText,
      isActive && styles.tabButtonTextActive
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// Composant pour une carte de catégorie - EXACT du design
const CategoryCard = ({ category, onPress }: any) => (
  <TouchableOpacity
    style={styles.categoryCard}
    onPress={() => onPress(category)}
    activeOpacity={0.8}
  >
    {/* Background avec gradient simulé - EXACT du design */}
    <View style={[
      styles.categoryCardBackground,
      { backgroundColor: category.gradient[0] }
    ]}>
      {/* Overlay pour créer l'effet de gradient - EXACT du design */}
      <View style={[
        styles.categoryCardOverlay,
        { backgroundColor: category.gradient[1], opacity: 0.3 }
      ]} />
      
      {/* Contenu de la carte - EXACT du design */}
      <View style={styles.categoryCardContent}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text style={styles.categoryTitle}>{category.title}</Text>
        <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ FONCTION NAVIGATION CORRIGÉE - Navigation vers DhikrScreen avec paramètres
  const handleCategoryPress = (category: any) => {

    router.replace(route);
    // Navigation avec Expo Router vers l'écran dhikr avec les paramètres de catégorie
    /*router.push({
      pathname: '/(tabs)/dhikr', // Ajustez le pathname selon votre structure de routes
      params: { 
        category: category.id,
        categoryTitle: category.title.replace('\n', ' ') // Enlever le saut de ligne
      }
    });*/
  };

  // Filtrer les catégories selon la recherche - FONCTIONNALITÉ EXACTE
  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenBackground>
      <View style={styles.container}>
        {/* ===== HEADER - EXACT du design ===== */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>
            Discover categories, moods and playlists.
          </Text>
        </View>

        {/* ===== BARRE DE RECHERCHE - EXACT du design ===== */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#8C8F7B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#8C8F7B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* ===== ONGLETS General/Favourites - EXACT du design ===== */}
        <View style={styles.tabsContainer}>
          <TabButton
            title="General"
            isActive={activeTab === 'General'}
            onPress={() => setActiveTab('General')}
          />
          <TabButton
            title="Favourites"
            isActive={activeTab === 'Favourites'}
            onPress={() => setActiveTab('Favourites')}
          />
        </View>

        {/* ===== SECTION CATEGORIES - EXACT du design ===== */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          
          <ScrollView 
            style={styles.categoriesContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Grille de catégories 2x2 - EXACT du design */}
            <View style={styles.categoriesGrid}>
              {filteredCategories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onPress={handleCategoryPress}
                />
              ))}
            </View>
            
            {/* Espacement en bas pour éviter la collision avec la navigation */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </View>
    </ScreenBackground>
  );
}

// ===== STYLES EXACT DU DESIGN =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, // EXACT : 20px de chaque côté
  },
  
  // ===== HEADER STYLES - EXACT du design =====
  header: {
    marginTop: 60, // EXACT : Espace pour la status bar
    marginBottom: 24, // EXACT : Espacement sous le header
  },
  headerTitle: {
    fontFamily: 'Sofia-Pro-Light', // EXACT : Font cohérente
    fontSize: 32, // EXACT : Taille du titre
    color: '#181818', // EXACT : Noir foncé
    marginBottom: 8, // EXACT : Espacement sous le titre
  },
  headerSubtitle: {
    fontFamily: 'Sofia-Pro-Light', // EXACT : Font cohérente
    fontSize: 16, // EXACT : Taille du sous-titre
    color: '#8C8F7B', // EXACT : Gris-vert du design
    opacity: 0.8, // EXACT : Légère transparence
  },

  // ===== SEARCH BAR STYLES - EXACT du design =====
  searchContainer: {
    marginBottom: 24, // EXACT : Espacement sous la barre de recherche
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // EXACT : Background blanc semi-transparent
    borderRadius: 12, // EXACT : Coins arrondis
    paddingHorizontal: 16, // EXACT : Padding horizontal
    paddingVertical: 12, // EXACT : Padding vertical
    shadowColor: '#000', // EXACT : Couleur de l'ombre
    shadowOffset: {
      width: 0,
      height: 2, // EXACT : Offset de l'ombre
    },
    shadowOpacity: 0.1, // EXACT : Opacité de l'ombre
    shadowRadius: 3.84, // EXACT : Rayon de l'ombre
    elevation: 5, // EXACT : Élévation Android
  },
  searchIcon: {
    marginRight: 12, // EXACT : Espacement après l'icône
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Sofia-Pro-Light', // EXACT : Font cohérente
    fontSize: 16, // EXACT : Taille du texte
    color: '#181818', // EXACT : Couleur du texte
  },

  // ===== TABS STYLES - EXACT du design =====
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 32, // EXACT : Espacement sous les onglets
    gap: 8, // EXACT : Espace entre les onglets
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12, // EXACT : Padding vertical
    paddingHorizontal: 24, // EXACT : Padding horizontal
    borderRadius: 25, // EXACT : Coins très arrondis
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // EXACT : Background inactif
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#F8BBD0', // EXACT : Rose pâle du design
  },
  tabButtonText: {
    fontFamily: 'Sofia-Pro', // EXACT : Font des onglets
    fontSize: 16, // EXACT : Taille du texte
    color: '#8C8F7B', // EXACT : Couleur inactive
  },
  tabButtonTextActive: {
    color: '#7E0F3B', // EXACT : Couleur accent de l'app
    fontWeight: '600', // EXACT : Font weight actif
  },

  // ===== CATEGORIES SECTION STYLES - EXACT du design =====
  categoriesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Sofia-Pro', // EXACT : Font du titre de section
    fontSize: 24, // EXACT : Taille du titre
    color: '#181818', // EXACT : Couleur du titre
    marginBottom: 20, // EXACT : Espacement sous le titre
  },
  categoriesContainer: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16, // EXACT : Espace entre les cartes
  },

  // ===== CATEGORY CARD STYLES - EXACT du design =====
  categoryCard: {
    width: (width - 56) / 2, // EXACT : 56 = 20*2 (padding) + 16 (gap)
    height: 160, // EXACT : Hauteur des cartes
    marginBottom: 16, // EXACT : Espacement vertical entre cartes
    borderRadius: 16, // EXACT : Coins arrondis des cartes
    overflow: 'hidden',
    shadowColor: '#000', // EXACT : Couleur de l'ombre
    shadowOffset: {
      width: 0,
      height: 4, // EXACT : Offset de l'ombre
    },
    shadowOpacity: 0.15, // EXACT : Opacité de l'ombre
    shadowRadius: 6, // EXACT : Rayon de l'ombre
    elevation: 8, // EXACT : Élévation Android
  },
  categoryCardBackground: {
    flex: 1,
    position: 'relative',
  },
  categoryCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, // EXACT : Padding interne des cartes
    position: 'relative',
    zIndex: 2,
  },
  categoryIcon: {
    fontSize: 32, // EXACT : Taille des emojis
    marginBottom: 8, // EXACT : Espacement sous l'emoji
  },
  categoryTitle: {
    fontFamily: 'Sofia-Pro', // EXACT : Font des titres de cartes
    fontSize: 18, // EXACT : Taille des titres
    fontWeight: '600', // EXACT : Font weight des titres
    color: '#FFFFFF', // EXACT : Couleur blanche
    textAlign: 'center',
    marginBottom: 4, // EXACT : Espacement sous le titre
    // EXACT : Text shadow pour lisibilité
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categorySubtitle: {
    fontFamily: 'Sofia-Pro-Light', // EXACT : Font des sous-titres
    fontSize: 12, // EXACT : Taille des sous-titres
    color: 'rgba(255, 255, 255, 0.9)', // EXACT : Blanc semi-transparent
    textAlign: 'center',
    // EXACT : Text shadow pour lisibilité
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // ===== SPACING - EXACT du design =====
  bottomSpacing: {
    height: 100, // EXACT : Espace pour la navigation bottom
  },
});