import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  ImageBackground
} from 'react-native';
import { Search } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';
import { router } from 'expo-router';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Données des catégories avec leurs images DISTINCTES
const categories = [
  {
    id: 'morning',
    title: 'Morning\nAdhkar',
    subtitle: 'Start your day with remembrance',
    // Image de lever de soleil/matin
    backgroundImage: require('../../assets/images/Morning_bg.png'), // Remplacez par votre chemin d'image
    icon: '🌅'
  },
  {
    id: 'evening',
    title: 'Evening\nAdhkar',
    subtitle: 'End your day in gratitude',
    // Image de coucher de soleil/soir
    backgroundImage: require('../../assets/images/Evening_bg.png'), // Remplacez par votre chemin d'image
    icon: '🌆'
  },
  {
    id: 'afterSalah',
    title: 'After\nSalah',
    subtitle: 'Seek forgiveness and purification',
    // Image spirituelle/mosque ou montagne
    backgroundImage: require('../../assets/images/After_salah_bg.png'), // Remplacez par votre chemin d'image
    icon: '🤲'
  },
  {
    id: 'istighfar',
    title: 'Istighfar',
    subtitle: 'Protection through the night',
    // Image de nuit étoilée
    backgroundImage: require('../../assets/images/Istighfar_bg.png'), // Remplacez par votre chemin d'image
    icon: '🌙'
  },

  // NEW Categories
  {
    id: 'upon',
    title: 'Upon\nWaking',
    subtitle: 'Seek forgiveness and purification',
    // Image spirituelle/mosque ou montagne
    backgroundImage: require('../../assets/images/Upon_waking_bg.png'), // Remplacez par votre chemin d'image
    icon: '🤲'
  },

  {
    id: 'before',
    title: 'Before\nSleeping',
    subtitle: 'Seek forgiveness and purification',
    // Image spirituelle/mosque ou montagne
    backgroundImage: require('../../assets/images/Before_sleeping_bg.png'), // Remplacez par votre chemin d'image
    icon: '🤲'
  },

  {
    id: 'surahs',
    title: 'Surahs of\nProtection',
    subtitle: 'Seek forgiveness and purification',
    // Image spirituelle/mosque ou montagne
    backgroundImage: require('../../assets/images/Surahs_protection_bg.png'), // Remplacez par votre chemin d'image
    icon: '🤲'
  },

  {
    id: 'salawat',
    title: 'Salawat',
    subtitle: 'Seek forgiveness and purification',
    // Image spirituelle/mosque ou montagne
    backgroundImage: require('../../assets/images/Salawat_bg.png'), // Remplacez par votre chemin d'image
    icon: '🤲'
  },

  {
    id: 'travel',
    title: 'Travel',
    subtitle: 'Seek forgiveness and purification',
    // Image spirituelle/mosque ou montagne
    backgroundImage: require('../../assets/images/Travel_bg.png'), // Remplacez par votre chemin d'image
    icon: '🤲'
  },

  {
    id: 'anxiety',
    title: 'Anxiety\nRelief',
    subtitle: 'Seek forgiveness and purification',
    // Image spirituelle/mosque ou montagne
    backgroundImage: require('../../assets/images/Anxiety_bg.png'), // Remplacez par votre chemin d'image
    icon: '🤲'
  },

    {
    id: 'rizq',
    title: 'Increase\nRizq',
    subtitle: 'Seek forgiveness and purification',
    // Image spirituelle/mosque ou montagne
    backgroundImage: require('../../assets/images/Rizq_bg.png'), // Remplacez par votre chemin d'image
    icon: '🤲'
  },

  {
    id: 'evilEye',
    title: 'Evil Eye',
    subtitle: 'Seek forgiveness and purification',
    // Image spirituelle/mosque ou montagne
    backgroundImage: require('../../assets/images/Evil_eye_bg.png'), // Remplacez par votre chemin d'image
    icon: '🤲'
  },
];

// Données pour la section Tasbih
const tasbihItems = [
  { id: 'subhanallah', text: 'Subhanallah' },
  { id: 'alhamdulillah', text: 'Alhamdulillah' },
  { id: 'allahuakbar', text: 'Allahu Akbar' },
  { id: 'astaghfirullah', text: 'Astaghfirullah' },
];

// Données pour les options de comptage
const countOptions = [
  { id: '33x', label: '33x' },
  { id: '100x', label: '100x' },
  { id: '500x', label: '500x' },
  { id: 'custom', label: 'Custom' }
];
//const { theme } = useTheme();


// Composant pour une carte de catégorie - MODIFIÉ avec ImageBackground
const CategoryCard = ({ category, onPress }: any) => (
  <TouchableOpacity
    style={styles.categoryCard}
    onPress={() => onPress(category)}
    activeOpacity={0.8}
  >
    {/* ImageBackground remplace le background avec gradient */}
    <ImageBackground
      source={category.backgroundImage}
      style={styles.categoryCardBackground}
      imageStyle={styles.categoryCardImage}
      resizeMode="cover"
    >
      {/* Overlay sombre pour améliorer la lisibilité du texte */}
      <View style={styles.categoryCardOverlay} />

      {/* Contenu de la carte */}
      <View style={styles.categoryCardContent}>
        <Text style={styles.categoryTitle}>{category.title}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

// Composant pour les boutons Tasbih
const TasbihButton = ({ item, onPress }: any) => (
  <TouchableOpacity
    style={styles.tasbihButton}
    onPress={() => onPress(item)}
    activeOpacity={0.8}
  >
    <Text style={styles.tasbihButtonText}>{item.text}</Text>
  </TouchableOpacity>
);

export default function DiscoverScreen() {
  const { theme, isDarkBackground } = useTheme();
  const [activeTab, setActiveTab] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Nouveaux états pour la section Tasbih
  const [selectedCount, setSelectedCount] = useState('33x');
  const [customCount, setCustomCount] = useState('');
  const hiddenInputRef = useRef<TextInput>(null);

  // Réinitialiser l'état quand on revient sur l'écran
  useFocusEffect(
    React.useCallback(() => {
      setSearchQuery('');
      setIsSearching(false);
      setSelectedCount('33x');
      setCustomCount('');
    }, [])
  );

  // ✅ FONCTION NAVIGATION CORRIGÉE - Navigation vers DhikrScreen avec paramètres
  const handleCategoryPress = (category: any) => {
    // Réinitialiser l'état de recherche avant la navigation
    if (isSearching) {
      setSearchQuery('');
      setIsSearching(false);
    }
    
    router.push({
      pathname: '/(tabs)',
      params: {
        category: category.id,
        categoryTitle: category.title.replace('\n', ' ') // Enlever le saut de ligne
      }
    });
  };

  // Fonction pour gérer la sélection du comptage
  const handleCountSelection = (option: any) => {
    setSelectedCount(option.id);
    if (option.id === 'custom') {
      // Ouvrir automatiquement le clavier numérique sans montrer l'input
      setTimeout(() => {
        hiddenInputRef.current?.focus();
      }, 100);
    } else {
      setCustomCount('');
    }
  };

  // Fonction pour gérer les changements dans l'input caché
  const handleCustomCountChange = (value: string) => {
    setCustomCount(value);
  };

  // Fonction modifiée pour gérer les clics sur les boutons Tasbih
  const handleTasbihPress = (item: any) => {
    // Déterminer le count à utiliser
    let finalCount = '33'; // Valeur par défaut

    if (selectedCount === 'custom' && customCount && parseInt(customCount) > 0) {
      finalCount = customCount;
    } else if (selectedCount !== 'custom') {
      // Extraire le nombre des options (33x, 100x, 500x)
      finalCount = selectedCount.replace('x', '');
    }

    console.log('Navigating with count:', finalCount, 'for item:', item.id);

    router.push({
      pathname: '/(tabs)',
      params: {
        category: item.id,
        categoryTitle: item.text,
        tasbihType: item.id,
        count: finalCount
      }
    });
  };

  // Fonction pour gérer les changements dans la recherche
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsSearching(value.length > 0);
  };

  // Fonction pour annuler la recherche
  const handleCancelSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  // Filtrer les catégories selon la recherche - FONCTIONNALITÉ EXACTE
  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Composant pour les onglets General/Favourites - EXACT du design
  const TabButton = ({ title, onPress }: any) => (
    <LinearGradient

      colors={isDarkBackground ?
        [theme.colors.discover.tabButton.gradientStart, theme.colors.discover.tabButton.gradientEnd] :
        [theme.colors.discover.tabButton.gradientStart, theme.colors.discover.tabButton.gradientEnd]
      }

      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.tabButton,
        { borderColor: theme.colors.discover.tabButton.borderColor }
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.tabButtonText,
          { color: theme.colors.discover.tabButton.textColor }
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );



  // Nouveau composant pour les boutons de comptage
  const CountButton = ({ option, isSelected, onPress, customCount }: any) => {
    // Afficher le nombre custom au lieu de "Custom" si un nombre est entré
    const displayText = option.id === 'custom' && customCount && parseInt(customCount) > 0
      ? customCount
      : option.label;

    return (
      <TouchableOpacity
        style={[
          styles.countButton,
          {
            backgroundColor: theme.colors.discover.tasbishButton.backgroundColor,
            borderColor: theme.colors.discover.tasbishButton.borderColor,
            //color: theme.colors.discover.tasbishButton.textColor
          },
          isSelected && styles.countButtonSelected
        ]}
        onPress={() => onPress(option)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.countButtonText,
          { color: theme.colors.discover.tasbishButton.textColor },

          isSelected && styles.countButtonTextSelected,
        ]}>
          {displayText}
        </Text>
      </TouchableOpacity>
    );
  };



  return (
    <PageTransitionWrapper animationType="fade" duration={350}>
      <ScreenBackground>
        <View style={styles.container}>
          {/* ===== HEADER - Masqué pendant la recherche ===== */}
          {!isSearching && (
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: theme.colors.discover.hearderTitle }]}>Discover</Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.discover.hearderSubTitle }]}>
                Your personal adhkar library
              </Text>
            </View>
          )}

          {/* ===== BARRE DE RECHERCHE - Modifiée pour inclure le bouton Cancel ===== */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#8C8F7B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#8C8F7B"
                value={searchQuery}
                onChangeText={handleSearchChange}
              />
            </View>
            {isSearching && (
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancelSearch}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.discover.hearderTitle }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ===== SECTION CATEGORIES - EXACT du design ===== */}
          <View style={styles.categoriesSection}>
            <ScrollView
              style={styles.categoriesContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* ===== ONGLETS General/Favourites - Masqués pendant la recherche ===== */}
              {!isSearching && (
                <View style={styles.tabsContainer}>
                  <TabButton
                    title="General"
                    onPress={() => handleCategoryPress({ id: 'General', title: 'General' })}
                  />
                  <TabButton
                    title="Favourites"
                    onPress={() => handleCategoryPress({ id: 'favourites', title: 'Favourites' })}
                  />
                </View>
              )}

              {/* ===== SECTION TASBIH - Masquée pendant la recherche ===== */}
              {!isSearching && (
                <View style={styles.tasbihSection}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Tasbih</Text>
                  {/* Section de sélection du nombre - MODIFIÉE */}
                  <View style={styles.countSection}>
                    <View style={styles.countRow}>

                      <View style={styles.countOptionsContainer}>
                        <Text style={[styles.countLabelText, { color: theme.colors.discover.countLabel }]}>Count: </Text>
                        {countOptions.map((option) => (
                          <CountButton
                            key={option.id}
                            option={option}
                            isSelected={selectedCount === option.id}
                            onPress={handleCountSelection}
                            customCount={customCount}
                          />
                        ))}
                      </View>
                    </View>

                    {/* Input caché pour capturer la saisie */}
                    <TextInput
                      ref={hiddenInputRef}
                      style={styles.hiddenInput}
                      value={customCount}
                      onChangeText={handleCustomCountChange}
                      returnKeyType="done"
                      autoFocus={false}
                      keyboardType="number-pad"
                      maxLength={3}
                    />
                  </View>

                  {/* Boutons Tasbih */}
                  <View style={styles.tasbihGrid}>
                    {tasbihItems.map((item, index) => (
                      <TasbihButton
                        key={item.id}
                        item={item}
                        onPress={handleTasbihPress}
                      />
                    ))}
                  </View>
                </View>
              )}

              {!isSearching && (
                <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Categories</Text>
              )}
              
              {/* Grille de catégories 2x2 - Toujours visible mais filtrée */}
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
    </PageTransitionWrapper>
  );
}

// ===== STYLES COMPLETS =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, // EXACT : 20px de chaque côté
  },

  // ===== HEADER STYLES - EXACT du design =====
  header: {
    marginTop: 20, // EXACT : Espace pour la status bar
    marginBottom: 24, // EXACT : Espacement sous le header
  },
  headerTitle: {
    fontFamily: 'Classico', // EXACT : Font cohérente
    fontSize: 30, // EXACT : Taille du titre
    color: '#181818', // EXACT : Noir foncé
    marginBottom: 8, // EXACT : Espacement sous le titre
  },
  headerSubtitle: {
    fontFamily: 'Sofia-Pro-Light', // EXACT : Font cohérente
    fontSize: 16, // EXACT : Taille du sous-titre
    color: '#8C8F7B', // EXACT : Gris-vert du design
    opacity: 0.8, // EXACT : Légère transparence
  },

  // ===== SEARCH BAR STYLES - Modifiés pour le bouton Cancel =====
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14, // EXACT : Espacement sous la barre de recherche
  },
  searchInputContainer: {
    flex: 1,
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
    fontFamily: 'Sofia-Pro-ExtraLight', // EXACT : Font cohérente
    fontSize: 16, // EXACT : Taille du texte
    color: '#181818', // EXACT : Couleur du texte
  },
  // Nouveaux styles pour le bouton Cancel
  cancelButton: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cancelButtonText: {
    fontFamily: 'Sofia-Pro',
    fontSize: 16,
    color: '#181818',
  },

  // ===== TABS STYLES - MODIFIÉS SELON LE DESIGN =====
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12, // Légèrement plus d'espace entre les boutons
  },
  tabButton: {
    flex: 1,
    marginTop: 12,
    paddingVertical: 26, // Plus de padding vertical
    paddingHorizontal: 24,
    borderRadius: 10, // Plus arrondi
    // backgroundColor: '#7E0F3B', // Background plus opaque pour l'état inactif
    borderWidth: 1, // Bordure de 2px
    //borderColor: '#9F1F52', // Bordure blanche
    alignItems: 'center',
    shadowRadius: 4,
    elevation: 3,

  },
  tabButtonText: {
    fontFamily: 'Sofia-Pro',
    fontSize: 16,
    color: '#fff', // Couleur pour l'état inactif
    fontWeight: '500',
  },

  // ===== TASBIH SECTION STYLES - MODIFIÉS =====
  tasbihSection: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontFamily: 'Classico', // EXACT : Font du titre de section
    fontSize: 26, // EXACT : Taille du titre
    color: '#181818', // EXACT : Couleur du titre
    paddingBottom: 10,
  },
  sectionSubtitle: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 16,
    color: '#8C8F7B',
    marginBottom: 20,
    marginLeft: 8
  },

  // ===== STYLES MODIFIÉS POUR LA SÉLECTION DE COMPTAGE =====
  countSection: {
    marginBottom: 8,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
    fontFamily: 'Sofia-Pro',
  },
  countLabel: {
    fontFamily: 'Sofia-Pro',
    fontSize: 16,
    color: '#181818',
    marginRight: 16, // Espacement entre le label et les boutons
    maxWidth: 30, // Largeur minimale pour le label
  },
  countOptionsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    fontFamily: 'Sofia-Pro',
  },
  countLabelText: {
    paddingVertical: 6,
    borderRadius: 28,
    alignItems: 'center',
    fontSize: 16,
    fontFamily: 'Sofia-Pro-Light',
    marginRight: 10
  },

  countButton: {
    flex: 1,
    marginHorizontal: 8,
    //paddingVertical: 10,
    //backgroundColor: 'rgba(255, 255, 255, 0.9)',

    backgroundColor: '#340317',


    borderRadius: 28,
    alignItems: 'center',
    //borderWidth: 0.5,
    borderColor: '#E0E0E0',
    height: 30,
    justifyContent: "center"
  },
  countButtonSelected: {
    backgroundColor: '#931748',
    borderWidth: 0.5,
  },
  countButtonText: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 14,
    //    color: '#8C8F7B',
    color: '#FFF',
  },
  countButtonTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Sofia-Pro'
  },
  customInputContainer: {
    marginTop: 8,
  },
  customInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Sofia-Pro',
    fontSize: 16,
    color: '#181818',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlign: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    left: -1000,
    opacity: 0,
    height: 0,
    width: 0,
  },

  // ===== TASBIH GRID STYLES =====
  tasbihGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    //gap: 2,
  },
  tasbihButton: {
    width: (width - 56) / 2, // Ajusté pour le gap et padding
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#7E0F3B',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tasbihButtonText: {
    fontFamily: 'Sofia-Pro',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // ===== CATEGORIES SECTION STYLES - EXACT du design =====
  categoriesSection: {
    flex: 1,
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

  // ===== CATEGORY CARD STYLES - MODIFIÉS POUR LES IMAGES =====
  categoryCard: {
    width: (width - 56) / 2, // EXACT : 56 = 20*2 (padding) + 16 (gap)
    height: (width - 56) / 2, // EXACT : Hauteur des cartes
    marginBottom: 16, // EXACT : Espacement vertical entre cartes
    borderRadius: 16, // EXACT : Coins arrondis des cartes
    overflow: 'hidden',
    shadowColor: '#000', // EXACT : Couleur de l'ombre
    elevation: 8, // EXACT : Élévation Android
  },
  // NOUVEAU : Style pour ImageBackground
  categoryCardBackground: {
    flex: 1,
    position: 'relative',
  },
  // NOUVEAU : Style pour l'image elle-même
  categoryCardImage: {
    borderRadius: 16, // Assure que l'image respecte les coins arrondis
  },
  // MODIFIÉ : Overlay plus sombre pour améliorer la lisibilité
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
    textShadowRadius: 4,
  },
  categorySubtitle: {
    fontFamily: 'Sofia-Pro-Light', // EXACT : Font des sous-titres
    fontSize: 12, // EXACT : Taille des sous-titres
    color: 'rgba(255, 255, 255, 0.95)', // LÉGÈREMENT MODIFIÉ : Plus opaque pour meilleure lisibilité
    textAlign: 'center',
  },

  // ===== SPACING - EXACT du design =====
  bottomSpacing: {
    height: 100, // EXACT : Espace pour la navigation bottom
  },
});