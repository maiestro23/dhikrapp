import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { Search as SearchIcon, X, Heart } from 'lucide-react-native';
import Fuse from 'fuse.js';
import { useSearchStore } from '../../../stores/searchStore';
import { useDhikrStore } from '../../../stores/dhikrStore';
import { useFavoritesStore } from '../../../stores/favoritesStore';
import { ScreenBackground } from '../../../components/ScreenBackground';

export default function SearchScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();
  const { dhikrs } = useDhikrStore();
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  const fuse = new Fuse(dhikrs, {
    keys: ['arabicText', 'transliteration', 'translation', 'category'],
    threshold: 0.4,
  });

  const searchResults = query ? fuse.search(query) : [];

  const handleSearch = useCallback((text: string) => {
      setQuery(text);
      if (text.length > 2){

      if (text.trim()) {
        addRecentSearch(text.trim());
      }
  
    }
  }, [addRecentSearch]);

  const handleFavoritePress = (dhikr: any) => {
    if (isFavorite(dhikr.id)) {
      removeFavorite(dhikr.id);
    } else {
      addFavorite(dhikr);
    }
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
        style={[
          styles.favoriteButton
        ]}
        onPress={() => handleFavoritePress(item.item)}
      >
        <Heart
          size={24}
          color={theme.colors.accent}
          fill={isFavorite(item.item.id) ? theme.colors.accent : '#fff'}
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
        style={[
          styles.favoriteButton
        ]}
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
    <ScreenBackground>
      
      
      
      
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
          <SearchIcon color={theme.colors.text.secondary} size={20} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text.primary }]}
            placeholder="Search dhikr..."
            placeholderTextColor={theme.colors.text.secondary}
            value={query}
            onChangeText={handleSearch}
          />
          {query.length > 2 && (
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
              {/* Section des recherches récentes */}
          

              {/* Section des favoris */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                    Favorites
                  </Text>
                </View>
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
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Sans-Medium',
    fontSize: 18,
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