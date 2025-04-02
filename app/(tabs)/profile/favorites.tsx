import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useFavoritesStore } from '../../../stores/favoritesStore';

export default function FavoritesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { favorites, removeFavorite } = useFavoritesStore();

  const handleBack = () => {
    router.push('/profile');
  };

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Favorites</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart color={theme.colors.text.secondary} size={48} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              Add dhikrs to your favorites by tapping the heart icon
            </Text>
          </View>
        ) : (
          <View style={styles.favoritesList}>
            {favorites.map((dhikr) => (
              <View
                key={dhikr.id}
                style={[styles.favoriteCard, { backgroundColor: theme.colors.card }]}
              >
                <View style={styles.favoriteContent}>
                  <Text style={[styles.arabicText, { color: theme.colors.text.primary }]}>
                    {dhikr.arabicText}
                  </Text>
                  <Text style={[styles.transliteration, { color: theme.colors.text.primary }]}>
                    {dhikr.transliteration}
                  </Text>
                  <Text style={[styles.translation, { color: theme.colors.text.secondary }]}>
                    {dhikr.translation}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.removeButton]}
                  onPress={() => handleRemoveFavorite(dhikr.id)}
                >
                  <Heart fill={theme.colors.accent} color={theme.colors.accent} size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontFamily: 'Classico',
    fontSize: 22,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  emptyTitle: {
    fontFamily: 'Serif',
    fontSize: 20,
  },
  emptyText: {
    fontFamily: 'Sans',
    fontSize: 16,
    textAlign: 'center',
  },
  favoritesList: {
    paddingVertical: 8,
    gap: 16,
  },
  favoriteCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  favoriteContent: {
    flex: 1,
  },
  arabicText: {
    fontFamily: 'NotoNaskhArabic',
    fontSize: 24,
    marginBottom: 8,
  },
  transliteration: {
    fontFamily: 'Classico',
    fontSize: 16,
    marginBottom: 4,
  },
  translation: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 14,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});