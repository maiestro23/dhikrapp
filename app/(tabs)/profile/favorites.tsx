import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { Search as SearchIcon, X, Heart, Search } from 'lucide-react-native';
import Fuse from 'fuse.js';
import { useSearchStore } from '../../../stores/searchStore';
import { useDhikrStore } from '../../../stores/dhikrStore';
import { useFavoritesStore } from '../../../stores/favoritesStore';
import { ScreenBackground } from '../../../components/ScreenBackground';
import { SwipeBackWrapper } from '../../../components/SwipeBackWrapper'; // Ajustez le chemin selon votre structure
import { router } from 'expo-router';
import { ProfileBackground } from '@/components/ProfileBackground';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const { theme } = useTheme();

  const [query, setQuery] = useState('');
  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();
  const dhikrs = useDhikrStore().getAllDhikrs();
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  const fuse = new Fuse(dhikrs, {
    keys: ['arabicText', 'transliteration', 'translation', 'category'],
    threshold: 0.4,
  });

  const searchResults = query ? fuse.search(query) : [];

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (text.length > 2) {
      if (text.trim()) {
        addRecentSearch(text.trim());
      }
    }
  }, [addRecentSearch]);

  const handleFavoritePress = (dhikr: any) => {
    if (isFavorite(dhikr.uuid)) {
      removeFavorite(dhikr.uuid);
    } else {
      addFavorite(dhikr);
    }
  };

  const handleSwipeBack = () => {
    router.replace('/profile');
  };

  const renderSearchResult = ({ item }: { item: { item: any } }) => (
    <View style={[styles.resultItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.resultContent}>
        <Text style={[styles.arabicText, { color: theme.colors.text.primary }]}>
          {item.item.arabicText}
        </Text>
        <Text style={[styles.transliteration]}>
          {item.item.transliteration}
        </Text>
        <Text style={[styles.translation]}>
          {item.item.translation}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.favoriteButton]}
        onPress={() => handleFavoritePress(item.item)}
      >
        <Heart
          size={24}
          color={theme.colors.accent}
          fill={isFavorite(item.item.uuid) ? theme.colors.accent : '#fff'}
        />
      </TouchableOpacity>
    </View>
  );

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <View style={[styles.resultItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.resultContent}>
        <Text style={[styles.arabicText, { color: theme.colors.text.primary }]}>
          {item.arabicText}
        </Text>
        <Text style={[styles.transliteration]}>
          {item.transliteration}
        </Text>
        <Text style={[styles.translation]}>
          {item.translation}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.favoriteButton]}
        onPress={() => handleFavoritePress(item)}
      >
        <Heart
          size={24}
          color={theme.colors.accent}
          fill={theme.colors.accent}
        />
      </TouchableOpacity>
    </View>
  );

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.recentItem, { backgroundColor: theme.colors.card }]}
      onPress={() => handleSearch(item)}
    >
      <Text style={[styles.recentText, { color: theme.colors.text.primary }]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SwipeBackWrapper
      onSwipeBack={handleSwipeBack}
      backgroundComponent={<ProfileBackground />}
    >
      <ScreenBackground>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            Favourites
          </Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
          View, add or remove favourites
        </Text>

        <View style={styles.searchContainer}>
          <View style={styles.XsearchInputContainer}>
            <Search size={20} color="#8C8F7B" style={styles.XsearchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#8C8F7B"
              value={query}
              onChangeText={handleSearch}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X color={theme.colors.text.secondary} size={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {query.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item, index) => `search-${index}`}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={[]}
            renderItem={() => null}
            ListHeaderComponent={() => (
              <View>
                <View style={styles.sectionContainer}>
                  {favorites.length > 0 ? (
                    <View style={styles.favoritesList}>
                      {favorites.map((item, index) => (
                        <View key={`favorite-${index}`} style={[styles.resultItem, { backgroundColor: theme.colors.card }]}>
                          <View style={styles.resultContent}>
                            <Text style={[styles.arabicText, { color: theme.colors.text.primary }]}>
                              {item.arabicText}
                            </Text>
                            <Text style={[styles.transliteration]}>
                              {item.transliteration}
                            </Text>
                            <Text style={[styles.translation]}>
                              {item.translation}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={[styles.favoriteButton]}
                            onPress={() => handleFavoritePress(item)}
                          >
                            <Heart
                              size={24}
                              color={theme.colors.accent}
                              fill={theme.colors.accent}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
                      No favorites yet
                    </Text>
                  )}
                </View>
              </View>
            )}
            contentContainerStyle={styles.mainContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScreenBackground>
    </SwipeBackWrapper>
  );
}

// Styles restent identiques
const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  XsearchContainer: {
    marginBottom: 24,
  },
  XsearchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  XsearchIcon: {
    marginRight: 12,
  },
  XsearchInput: {
    flex: 1,
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 16,
    color: '#181818',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Sans',
    fontSize: 16,
  },
  mainContainer: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    paddingLeft: 16,
    marginTop: 20,
    fontFamily: 'Classico',
    fontSize: 30,
    color: '#181818',
  },

  headerSubtitle: {
    fontFamily: 'Sofia-Pro-Light', // EXACT : Font cohérente
    fontSize: 16, // EXACT : Taille du sous-titre
    color: '#8C8F7B', // EXACT : Gris-vert du design
    paddingLeft: 16,
    marginTop: -10,
    marginBottom: 14
  },

  clearText: {
    fontFamily: 'Sans',
    fontSize: 14,
  },
  resultsList: {
    padding: 16,
    gap: 12,
  },
  resultItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resultContent: {
    flex: 1,
    gap: 4,
  },
  arabicText: {
    fontFamily: 'NotoNaskhArabic',
    fontSize: 18,
  },
  transliteration: {
    fontFamily: 'Classico',
    fontSize: 18,
    color: 'black'
  },
  translation: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 14,
    color: 'grey'
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentList: {
    gap: 8,
  },
  favoritesList: {
    gap: 12,
  },
  recentItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentText: {
    fontFamily: 'Sans',
    fontSize: 14,
  },
  emptyText: {
    fontFamily: 'Sans',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});