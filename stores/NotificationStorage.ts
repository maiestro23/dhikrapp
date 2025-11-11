import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationPreferences {
  allNotifications: boolean;
  morningEvening: boolean;
  jummah: boolean;
  dailyGoals: boolean;
}

const STORAGE_KEY = 'notification_preferences';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  allNotifications: false,
  morningEvening: false,
  jummah: false,
  dailyGoals: false,
};

class NotificationStorage {
  
  async savePreferences(preferences: NotificationPreferences): Promise<void> {
    try {
      const jsonValue = JSON.stringify(preferences);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      throw error;
    }
  }

  async loadPreferences(): Promise<NotificationPreferences> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const stored = JSON.parse(jsonValue);
        // Merge avec les valeurs par défaut au cas où de nouvelles préférences sont ajoutées
        return { ...DEFAULT_PREFERENCES, ...stored };
      }
      return DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  async clearPreferences(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing notification preferences:', error);
      throw error;
    }
  }

  async updatePreference(key: keyof NotificationPreferences, value: boolean): Promise<NotificationPreferences> {
    try {
      const currentPreferences = await this.loadPreferences();
      const updatedPreferences = { ...currentPreferences, [key]: value };
      await this.savePreferences(updatedPreferences);
      return updatedPreferences;
    } catch (error) {
      console.error('Error updating notification preference:', error);
      throw error;
    }
  }

  async setAllNotifications(enabled: boolean): Promise<NotificationPreferences> {
    try {
      const preferences: NotificationPreferences = {
        allNotifications: enabled,
        morningEvening: enabled,
        jummah: enabled,
        dailyGoals: enabled,
      };
      await this.savePreferences(preferences);
      return preferences;
    } catch (error) {
      console.error('Error setting all notifications:', error);
      throw error;
    }
  }

  // Méthode utilitaire pour vérifier si toutes les notifications individuelles sont activées
  areAllIndividualNotificationsEnabled(preferences: NotificationPreferences): boolean {
    return preferences.morningEvening && preferences.jummah && preferences.dailyGoals;
  }

  // Méthode utilitaire pour vérifier si aucune notification individuelle n'est activée
  areAllIndividualNotificationsDisabled(preferences: NotificationPreferences): boolean {
    return !preferences.morningEvening && !preferences.jummah && !preferences.dailyGoals;
  }
}

export default new NotificationStorage();