import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Search as SearchIcon, X, Heart } from 'lucide-react-native';
import Fuse from 'fuse.js';
import { useSearchStore } from '../../stores/searchStore';
import { useDhikrStore } from '../../stores/dhikrStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { ScreenBackground } from '../../components/ScreenBackground';

export default function SearchScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();
  const { dhikrs } = useDhikrStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  const fuse = new Fuse(dhikrs, {
    keys: ['arabicText', 'transliteration', 'translation', 'category'],
    threshold: 0.4,
  });

  const searchResults = query ? fuse.search(query) : [];

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (text.trim()) {
      addRecentSearch(text.trim());
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
        <Text style={[styles.transliteration, { color: theme.colors.text.primary }]}>
          {item.item.transliteration}
        </Text>
        <Text style={[styles.translation, { color: theme.colors.text.secondary }]}>
          {item.item.translation}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.favoriteButton,
          { backgroundColor: isFavorite(item.item.id) ? `${theme.colors.accent}15` : 'transparent' }
        ]}
        onPress={() => handleFavoritePress(item.item)}
      >
        <Heart
          size={24}
          color={theme.colors.accent}
          fill={isFavorite(item.item.id) ? theme.colors.accent : 'none'}
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
        <View style={styles.recentContainer}>
          <View style={styles.recentHeader}>
            <Text style={[styles.recentTitle, { color: theme.colors.text.primary }]}>
              Recent Searches
            </Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text style={[styles.clearText, { color: theme.colors.accent }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={recentSearches}
            renderItem={renderRecentSearch}
            keyExtractor={(item, index) => `recent-${index}`}
            contentContainerStyle={styles.recentList}
            showsVerticalScrollIndicator={false}
          />
        </View>
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
    fontFamily: 'Serif',
    fontSize: 24,
  },
  transliteration: {
    fontFamily: 'Sans-Medium',
    fontSize: 16,
  },
  translation: {
    fontFamily: 'Sans',
    fontSize: 14,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentContainer: {
    flex: 1,
    padding: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontFamily: 'Sans-Medium',
    fontSize: 18,
  },
  clearText: {
    fontFamily: 'Sans',
    fontSize: 14,
  },
  recentList: {
    gap: 8,
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
});