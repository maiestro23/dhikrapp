import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Clés pour le stockage des préférences
const NOTIFICATION_PREFERENCES_KEY = 'notification_preferences';

// Types de notifications
export const NOTIFICATION_TYPES = {
  MORNING_ADHKAR: 'morning_adhkar',
  EVENING_ADHKAR: 'evening_adhkar',
  JUMMAH: 'jummah',
  DAILY_GOALS: 'daily_goals',
};

// Textes et règles des notifications
const NOTIFICATION_CONTENT = {
  [NOTIFICATION_TYPES.MORNING_ADHKAR]: {
    title: '🌅 Morning Adhkar',
    body: 'Start your day with protection. Your morning shield awaits.',
    data: { type: NOTIFICATION_TYPES.MORNING_ADHKAR },
  },
  [NOTIFICATION_TYPES.EVENING_ADHKAR]: {
    title: '🌙 Evening Adhkar',
    body: 'End your day in gratitude. Your evening protection is ready.',
    data: { type: NOTIFICATION_TYPES.EVENING_ADHKAR },
  },
  [NOTIFICATION_TYPES.JUMMAH]: {
    title: '🕌 Jummah Reminder',
    body: 'Send salawat and read Surah Al-Kahf. Blessed Friday!',
    data: { type: NOTIFICATION_TYPES.JUMMAH },
  },
  [NOTIFICATION_TYPES.DAILY_GOALS]: {
    title: '🎯 Daily Goals',
    body: 'A gentle reminder to continue your spiritual journey today.',
    data: { type: NOTIFICATION_TYPES.DAILY_GOALS },
  },
};

// Horaires par défaut
const DEFAULT_SCHEDULES = {
  [NOTIFICATION_TYPES.MORNING_ADHKAR]: { hour: 7, minute: 0 }, // 7h00
  [NOTIFICATION_TYPES.EVENING_ADHKAR]: { hour: 18, minute: 30 }, // 18h30
  [NOTIFICATION_TYPES.JUMMAH]: { hour: 12, minute: 0, weekday: 6 }, // Vendredi 12h00 (6 = vendredi)
  [NOTIFICATION_TYPES.DAILY_GOALS]: { hour: 20, minute: 0 }, // 20h00
};

class NotificationsHandler {
  constructor() {
    this.preferences = {
      allNotifications: false,
      morningEvening: true,
      jummah: false,
      dailyGoals: true,
    };
    this.initialized = false;
  }

  // Initialisation du gestionnaire de notifications
  async initialize() {
    if (this.initialized) return true;

    try {
      // Demander les permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Permissions de notification refusées');
        return false;
      }

      // Charger les préférences sauvegardées
      await this.loadPreferences();

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des notifications:', error);
      return false;
    }
  }

  // Demander les permissions de notification
  async requestPermissions() {
    try {
      if (!Device.isDevice) {
        console.warn('Les notifications ne fonctionnent pas sur l\'émulateur');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permissions de notification refusées');
        return false;
      }

      // Configuration pour Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#7E0F3B',
        });
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      return false;
    }
  }

  // Charger les préférences depuis le stockage
  async loadPreferences() {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_PREFERENCES_KEY);
      if (stored) {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  }

  // Sauvegarder les préférences
  async savePreferences(preferences) {
    try {
      this.preferences = { ...this.preferences, ...preferences };
      await AsyncStorage.setItem(
        NOTIFICATION_PREFERENCES_KEY,
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
    }
  }

  // Obtenir les préférences actuelles
  getPreferences() {
    return { ...this.preferences };
  }

  // Mettre à jour les préférences et reprogrammer les notifications
  async updatePreferences(newPreferences, progressStore = null) {
    await this.savePreferences(newPreferences);
    await this.scheduleAllNotifications(progressStore);
  }

  // Annuler toutes les notifications programmées
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erreur lors de l\'annulation des notifications:', error);
    }
  }

  // Programmer toutes les notifications selon les préférences
  async scheduleAllNotifications(progressStore = null) {
    if (!this.initialized) {
      await this.initialize();
    }

    // Annuler toutes les notifications existantes
    await this.cancelAllNotifications();

    // Si toutes les notifications sont désactivées, ne rien programmer
    if (!this.preferences.allNotifications) {
      // Vérifier les préférences individuelles
      const hasAnyEnabled = 
        this.preferences.morningEvening || 
        this.preferences.jummah || 
        this.preferences.dailyGoals;

      if (!hasAnyEnabled) {
        return;
      }
    }

    // Programmer chaque type de notification selon les préférences
    if (this.preferences.morningEvening || this.preferences.allNotifications) {
      await this.scheduleMorningEveningAdhkar();
    }

    if (this.preferences.jummah || this.preferences.allNotifications) {
      await this.scheduleJummahReminder();
    }

    if (this.preferences.dailyGoals || this.preferences.allNotifications) {
      await this.scheduleDailyGoalsReminder(progressStore);
    }
  }

  // Programmer les rappels d'Adhkar matin et soir
  async scheduleMorningEveningAdhkar() {
    try {
      // Notification du matin
      await Notifications.scheduleNotificationAsync({
        content: NOTIFICATION_CONTENT[NOTIFICATION_TYPES.MORNING_ADHKAR],
        trigger: {
          hour: DEFAULT_SCHEDULES[NOTIFICATION_TYPES.MORNING_ADHKAR].hour,
          minute: DEFAULT_SCHEDULES[NOTIFICATION_TYPES.MORNING_ADHKAR].minute,
          repeats: true,
        },
      });

      // Notification du soir
      await Notifications.scheduleNotificationAsync({
        content: NOTIFICATION_CONTENT[NOTIFICATION_TYPES.EVENING_ADHKAR],
        trigger: {
          hour: DEFAULT_SCHEDULES[NOTIFICATION_TYPES.EVENING_ADHKAR].hour,
          minute: DEFAULT_SCHEDULES[NOTIFICATION_TYPES.EVENING_ADHKAR].minute,
          repeats: true,
        },
      });

      console.log('Notifications d\'Adhkar programmées');
    } catch (error) {
      console.error('Erreur lors de la programmation des Adhkar:', error);
    }
  }

  // Programmer le rappel du Jummah
  async scheduleJummahReminder() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: NOTIFICATION_CONTENT[NOTIFICATION_TYPES.JUMMAH],
        trigger: {
          weekday: DEFAULT_SCHEDULES[NOTIFICATION_TYPES.JUMMAH].weekday,
          hour: DEFAULT_SCHEDULES[NOTIFICATION_TYPES.JUMMAH].hour,
          minute: DEFAULT_SCHEDULES[NOTIFICATION_TYPES.JUMMAH].minute,
          repeats: true,
        },
      });

      console.log('Notification Jummah programmée');
    } catch (error) {
      console.error('Erreur lors de la programmation du Jummah:', error);
    }
  }

  // Programmer le rappel des objectifs quotidiens
  async scheduleDailyGoalsReminder(progressStore = null) {
    try {
      let notificationBody = NOTIFICATION_CONTENT[NOTIFICATION_TYPES.DAILY_GOALS].body;

      // Personnaliser le message selon les données du store
      if (progressStore) {
        const state = progressStore.getState();
        const { dailyGoal, currentStreak } = state;

        if (dailyGoal && dailyGoal > 0) {
          notificationBody = `Your daily goal: ${dailyGoal} dhikr. Keep your ${currentStreak}-day streak alive!`;
        } else if (currentStreak > 0) {
          notificationBody = `Continue your ${currentStreak}-day spiritual journey. Every moment counts.`;
        }
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          ...NOTIFICATION_CONTENT[NOTIFICATION_TYPES.DAILY_GOALS],
          body: notificationBody,
        },
        trigger: {
          hour: DEFAULT_SCHEDULES[NOTIFICATION_TYPES.DAILY_GOALS].hour,
          minute: DEFAULT_SCHEDULES[NOTIFICATION_TYPES.DAILY_GOALS].minute,
          repeats: true,
        },
      });

      console.log('Notification d\'objectifs quotidiens programmée');
    } catch (error) {
      console.error('Erreur lors de la programmation des objectifs quotidiens:', error);
    }
  }

  // Obtenir toutes les notifications programmées (pour debug)
  async getScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return [];
    }
  }

  // Envoyer une notification immédiate (pour tests uniquement)
  async sendTestNotification(type = NOTIFICATION_TYPES.DAILY_GOALS) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          ...NOTIFICATION_CONTENT[type],
          title: `[TEST] ${NOTIFICATION_CONTENT[type].title}`,
        },
        trigger: null, // Envoyer immédiatement
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de test:', error);
    }
  }

  // Gérer les réponses aux notifications (quand l'utilisateur tape dessus)
  setupNotificationResponseHandler(navigationHandler = null) {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { type } = response.notification.request.content.data;

      switch (type) {
        case NOTIFICATION_TYPES.MORNING_ADHKAR:
        case NOTIFICATION_TYPES.EVENING_ADHKAR:
          if (navigationHandler) {
            navigationHandler('/adhkar');
          }
          break;
        case NOTIFICATION_TYPES.JUMMAH:
          if (navigationHandler) {
            navigationHandler('/surah-kahf');
          }
          break;
        case NOTIFICATION_TYPES.DAILY_GOALS:
          if (navigationHandler) {
            navigationHandler('/dhikr');
          }
          break;
        default:
          if (navigationHandler) {
            navigationHandler('/');
          }
      }
    });

    return subscription;
  }
}

// Instance singleton
const notificationsHandler = new NotificationsHandler();

// Exports
export default notificationsHandler;
export { NotificationsHandler };

// Fonctions utilitaires pour l'utilisation dans les composants
export const initializeNotifications = () => notificationsHandler.initialize();
export const updateNotificationPreferences = (preferences, progressStore) => 
  notificationsHandler.updatePreferences(preferences, progressStore);
export const getNotificationPreferences = () => notificationsHandler.getPreferences();
export const scheduleAllNotifications = (progressStore) => 
  notificationsHandler.scheduleAllNotifications(progressStore);
export const cancelAllNotifications = () => notificationsHandler.cancelAllNotifications();